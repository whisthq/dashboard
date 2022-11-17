// policy.ts

/**
 *
 */

import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0'

import { mongo } from '../../lib/util'

export default withApiAuthRequired(async (req, res) => {
  const db = await mongo
  const session = getSession(req, res)

  switch (req.method) {
    case 'GET':
      const policies = db.db('policies').collection('org_policies')
      const policy = policies.findOne({ _id: session?.user.org_id })
      res.status(200).json(policy ?? {})
      break
    case 'PUT':
      // TODO(owen): Make this check robust against admin as a substring.
      if (session?.accessTokenScope?.includes('admin')) {
        // TODO(owen): Save policy and and return the new JSON.
      } else {
        res.status(403).json({
          error: 'forbidden',
          description: 'Missing admin authorization',
        })
      }
      break
    default:
      res.status(405).json({
        error: 'method_not_allowed',
        description: `HTTP request method '${req.method}' not allowed`,
      })
  }
})
