// policy.ts

/**
 *
 */

import { withJwtAuthRequired } from '../../lib/auth'
import { mongo } from '../../lib/util'

/**
 *
 */
export default withJwtAuthRequired(async (req, res) => {
  if (req.method !== 'GET') {
    res.status(405).json({
      errors: [
        {
          status: 'Method Not Allowed',
          links: {
            type: 'https://http.cat/405',
          },
        },
      ],
    })
    return
  }

  const orgId = req.token.org_id

  if (orgId === undefined) {
    res.status(401).json({
      errors: [
        {
          status: 'Unauthorized',
          detail: 'You must be signed in to an enterprise Whist account.',
        },
      ],
    })
    return
  }

  const db = await mongo()
  const policies = db.db('policies').collection('org_policies')
  const policy = await policies.findOne({ _id: orgId })

  if (policy) {
    res.status(200).json({
      data: {
        id: orgId,
        type: 'policy',
        attributes: policy,
      },
    })
  } else {
    res.status(404).json({
      errors: [
        {
          status: 'Not Found',
          detail: 'Your organization has not set any browser policies yet.',
          links: {
            type: 'https://http.cat/404',
          },
        },
      ],
    })
  }
})
