// auth.ts

/**
 * This file contains auxiliary functions that enforce authenticated and
 * authorized access to the Whist dashboard.
 */

import type { IncomingMessage, ServerResponse } from 'http'
import type {
  GetPublicKeyOrSecret,
  JwtPayload,
  VerifyOptions,
} from 'jsonwebtoken'
import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'

import { getSession } from '@auth0/nextjs-auth0'
import * as jwt from 'jsonwebtoken'
import { JwksClient } from 'jwks-rsa'

import { auth0 } from './util'

let _jwks: JwksClient

/**
 * Thrown when we are unable to extract claims from an access token. There's no
 * need to export this custom error class for now. We just use it in this file
 * to identify and handle specific failures.
 */
class TokenError extends Error {
  constructor() {
    super()
    this.name = 'TokenError'
  }
}

/**
 *
 */
function jwks(): JwksClient {
  if (_jwks === undefined) {
    const jwksEndpoint = new URL(
      '/.well-known/jwks.json',
      process.env.AUTH0_ISSUER_BASE_URL
    )
    _jwks = new JwksClient({ jwksUri: jwksEndpoint.href })
  }

  return _jwks
}

/**
 * Extract the raw JWT access token from the Authorization header of a request
 * to an API route that requires JWT authentication.
 */
function getToken(req: NextApiRequest): string | null {
  const auth = req.headers.authorization

  if (auth === undefined) {
    return null
  }

  const match = auth.match(/Bearer ([\w-]+\.[\w-]+\.[\w-]+)/)
  return match?.[1] ?? null
}

/**
 * Decode access token to get claims. This function does not perform claim
 * validation or signature verification. This function should only be called
 * from within API routes for which JWT authentication is requred.
 */
export function getClaims(req: NextApiRequest): JwtPayload | null {
  const token = getToken(req)

  if (token == null) {
    return null
  }

  return jwt.decode(token, { json: true })
}

/**
 * Ensures that the authenticated user has the Organization Admin role in Auth0.
 * This function should only called from within getServerSideProps functions
 * that are protected by withPageAuthRequired and API routes that are protected
 * by withApiAuthRequired.
 */
export async function isAdministrator(
  req: IncomingMessage | NextApiRequest,
  res: ServerResponse | NextApiResponse
): Promise<boolean> {
  const session = getSession(req, res)

  if (session?.user.org_id === undefined || session?.user.sub === undefined) {
    return false
  }

  const roles = await auth0().organizations.getMemberRoles({
    id: session.user.org_id,
    user_id: session.user.sub,
  })

  return roles.findIndex((role) => role.name === 'Organization Admin') >= 0
}

/**
 *
 */
export function withJwtAuthRequired(apiRoute: NextApiHandler): NextApiHandler {
  return async (req, res) => {
    const token = getToken(req)

    if (token === null) {
      res.status(401).json({
        errors: [
          {
            status: 'Unauthorized',
            detail: 'Failed to parse access token from Authorization header.',
            links: {
              type: 'https://http.cat/401',
            },
          },
        ],
      })
      return
    }

    const options: VerifyOptions = {
      algorithms: ['RS256'],
      audience: 'https://api.fractal.co',
      // This line will cause a runtime error if AUTH0_ISSUER_BASE_URL is not
      // set. That's good enough for now.
      issuer: new URL(process.env.AUTH0_ISSUER_BASE_URL as string).href,
    }
    const getPubKey: GetPublicKeyOrSecret = (header, callback) => {
      jwks()
        .getSigningKey(header.kid)
        .then((key) => {
          callback(null, key.getPublicKey())
        })
        .catch(callback)
    }

    try {
      await new Promise<void>((resolve, reject) => {
        jwt.verify(
          token,
          getPubKey,
          { ...options, complete: false },
          (err, claims) => {
            if (err !== null) {
              reject(err)
            } else if (claims === undefined || typeof claims === 'string') {
              reject(new TokenError())
            } else {
              resolve()
            }
          }
        )
      })
    } catch (err) {
      // Handle the case in which the access token is invalid for any reason.
      if (err instanceof TokenError || err instanceof jwt.JsonWebTokenError) {
        res.status(401).json({
          errors: [
            {
              status: 'Unauthorized',
              detail: 'Invalid access token.',
              links: {
                type: 'https://http.cat/401',
              },
            },
          ],
        })
        return
      }

      throw err
    }

    await apiRoute(req, res)
  }
}
