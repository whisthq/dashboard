// [policyId].ts

/**
 *
 */

import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0'
import { ObjectId } from 'mongodb'
import { isAdministrator } from '../../../lib/auth'
import { mongo } from '../../../lib/util'
import { NextApiRequest, NextApiResponse } from 'next'

/**
 *
 */
export default withApiAuthRequired(
  async (req: NextApiRequest, res: NextApiResponse) => {
    const { method, body } = req

    const session = getSession(req, res)
    const orgId = session?.user.org_id

    if (orgId === undefined) {
      res.status(401).json({
        errors: [
          {
            status: 'Unauthorized',
            detail:
              'You must be an enterprise customer to perform this action.',
            links: {
              type: 'https:http.cat/401',
            },
          },
        ],
      })
      return
    }

    if (!(await isAdministrator(req, res))) {
      res.status(403).json({
        errors: [
          {
            status: 'Forbidden',
            detail: 'You must be an administrator to perform this action.',
            links: {
              type: 'https://http.cat/403',
            },
          },
        ],
      })
    }
    const db = await mongo()
    const policies = db.db('policies').collection('org_policies')

    switch (method) {
      case 'PUT':
        try {
          const updateResult = await policies.updateOne(
            { _id: new ObjectId(body.id) },
            { $set: body.policy }
          )
          res.status(200).json({ updated: updateResult })
        } catch (err) {
          console.error(err)
          res.status(503).json({ updated: 0, error: err })
        }
        break

      case 'DELETE':
        try {
          const deleteResult = await policies.deleteMany({
            _id: new ObjectId(body.id),
          })
          res.status(200).json({ deleted: deleteResult })
        } catch (err) {
          console.error(err)
          res.status(503).json({ deleted: 0, error: err })
        }
        break

      default:
        res.status(405).json({ message: 'Not Allowed' })
        break
    }
  }
)
