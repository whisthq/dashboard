// policy.ts

/**
 *
 */

import { getClaims, withJwtAuthRequired } from '../../../lib/auth'
import { mongo } from '../../../lib/util'

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

  const claims = getClaims(req)
  const orgId = claims?.org_id

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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { _id, ...policy } = (await policies.findOne({ _id: orgId })) ?? {}

  res.status(200).json({
    data: {
      id: '',
      type: 'policy',
      attributes: policy,
    },
  })
})
