// auth.ts

/**
 * This file contains functions that enforce JWT (not session-cookie) authentication
 * for API routes.
 */

import type {
  GetPublicKeyOrSecret,
  JwtPayload,
  VerifyOptions,
} from 'jsonwebtoken'

import * as jwt from 'jsonwebtoken'
import type { NextApiRequest, NextApiResponse } from 'next'

import { JwksClient } from 'jwks-rsa'

export interface NextApiRequestWithToken extends NextApiRequest {
  token: JwtPayload
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type NextApiHandlerWithToken<T = any> = (
  req: NextApiRequestWithToken,
  res: NextApiResponse<T>
) => unknown | Promise<unknown>

let _jwks: JwksClient

function jwks(): JwksClient {
  if (_jwks === undefined) {
    _jwks = new JwksClient({
      jwksUri: `${process.env.AUTH0_ISSUER_BASE_URL}/.well-known/jwks.json`,
    })
  }

  return _jwks
}

function getToken(req: NextApiRequest): string | null {
  const auth = req.headers.authorization

  if (auth === undefined) {
    return null
  }

  const match = auth.match(/Bearer ([\w-]+\.[\w-]+\.[\w-]+)/)

  if (match === null) {
    return null
  }

  return match[1]
}

export function withJwtAuthRequired(
  apiRoute: NextApiHandlerWithToken
): NextApiHandlerWithToken {
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
      audience: process.env.AUTH0_AUDIENCE,
      issuer: process.env.AUTH0_ISSUER_BASE_URL,
    }
    const getPubKey: GetPublicKeyOrSecret = (header, callback) => {
      jwks()
        .getSigningKey(header.kid)
        .then((key) => {
          callback(null, key.getPublicKey())
        })
        .catch(callback)
    }

    const claims = await new Promise<JwtPayload>((resolve, reject) => {
      jwt.verify(
        token,
        getPubKey,
        { ...options, complete: false },
        (err, claims) => {
          if (err !== null) {
            reject(err)
          } else if (claims === undefined || typeof claims === 'string') {
            reject(new Error('Failed to parse JSON claims'))
          } else {
            resolve(claims)
          }
        }
      )
    })

    req.token = claims

    apiRoute(req, res)
  }
}
