// index.ts

/**
 *
 */

import { getSession } from '@auth0/nextjs-auth0'
import { mongo } from '../../../lib/util.ts'

/**
 *
 */
export default async function PoliciesHandler(req, res) {
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
      // TODO(mauricio): find all policies for the current org
      const findResult = await policies.find({}).toArray()
      res.status(200).json({ policies: findResult })
      break
    case 'POST':
      // TODO(mauricio): insert policies for the current org
      const insertResult = await policies.insertMany(body.content)
      res.status(200).json({ inserted: insertResult })
      break
    default:
      res.status(405).json({ message: 'Not Allowed' })
      break
  }
}
