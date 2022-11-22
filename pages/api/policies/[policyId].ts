// [policyId].ts

/**
 *
 */

import { getSession } from '@auth0/nextjs-auth0'
import { ObjectId } from 'mongodb'
import { mongo } from '../../../lib/util.ts'

/**
 *
 */
export default async function PolicyHandler(req, res) {
  const { method, body } = req
  const { policyId } = req.query

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
      const findResult = await policies.findOne({ _id: ObjectId(policyId) })
      res.status(200).json({ policy: findResult })
      break
    case 'PUT':
      const updateResult = await policies.updateOne(
        { _id: ObjectId(body.id) },
        { $set: body.content }
      )
      res.status(200).json({ updated: updateResult })
      break
    case 'DELETE':
      const deleteResult = await policies.deleteMany({ _id: ObjectId(body.id) })
      res.status(200).json({ deleted: deleteResult })
      break
    default:
      res.status(405).json({ message: 'Not Allowed' })
      break
  }
}
