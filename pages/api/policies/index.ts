// index.ts

/**
 *
 */

import { getSession } from '@auth0/nextjs-auth0'
import { mongo } from '../../../lib/util'
import { NextApiRequest, NextApiResponse } from 'next'

/**
 *
 */
export default async function PoliciesHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, body } = req

  const session = getSession(req, res)
  const orgId = session?.user.org_id

  if (orgId === undefined) {
    res.status(401).json({
      errors: [
        {
          status: 'Unauthorized',
          detail: 'You must be an enterprise customer to perform this action.',
          links: {
            type: 'https:http.cat/401',
          },
        },
      ],
    })
    return
  }

  // TODO(owen): Make this check robust against admin being a substring of
  // another scope.
  if (!session?.accessTokenScope?.includes('admin')) {
    res.status(403).json({
      errors: [
        {
          status: 'Forbidden',
          detail: 'You must be an administrator to perform this action.',
          links: {
            type: 'https:http.cat/403',
          },
        },
      ],
    })
  }

  const db = await mongo()
  const policies = db.db('policies').collection('org_policies')

  switch (method) {
    case 'GET':
      // TODO: right now, we only support a global policy for each organization. As such, this query
      // only returns the first result of the query. Later on, it should return a list of the organization
      // policies and the /api/policies/<policy_id> route should be used to return individual policies.
      // const findResult = await policies.find({ org_id: orgId }).toArray()
      try {
        const findResult = await policies.findOne({ org_id: orgId })
        res.status(200).json({ policy: findResult })
      } catch (err) {
        res.status(503).json({ policy: {}, error: err })
      }
      break

    case 'POST':
      try {
        const insertResult = await policies.insertMany(body.content)
        res.status(200).json({ inserted: insertResult })
      } catch (err) {
        res.status(503).json({ inserted: 0, error: err })
      }
      break

    default:
      res.status(405).json({ message: 'Not Allowed' })
      break
  }
}
