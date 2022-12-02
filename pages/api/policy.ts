// policy.ts

/**
 *
 */

import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0'

import { isAdministrator } from '../../lib/auth'
import { mongo } from '../../lib/util'

/**
 *
 */
export default withApiAuthRequired(async (req, res) => {
  // Only POST is allowed.
  if (req.method !== 'POST') {
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

  const session = getSession(req, res)
  const orgId = session.user?.org_id

  // Callers must belong to an organization.
  if (orgId === undefined) {
    res.status(401).json({
      errors: [
        {
          status: 'Unauthorized',
          detail: 'You must be signed in to an enterprise Whist account.',
          links: {
            types: 'https://http.cat/403',
          },
        },
      ],
    })
    return
  }

  // Only administrators can call this endpoint.
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
    return
  }

  // We expect the request to be a JSON object containing a
  // data.policy key.
  const policy = req.body.data?.attributes

  if (!(policy instanceof Object)) {
    res.status(400).json({
      errors: [
        {
          status: 'Bad Request',
          links: {
            type: 'https://http.cat/400',
          },
        },
      ],
    })
    return
  }

  const db = await mongo()
  const policies = db.db('policies').collection('org_policies')
  await policies.replaceOne({ _id: orgId }, policy, {
    upsert: true,
  })

  res.status(201).json({
    data: {
      id: '',
      type: 'policy',
      attributes: policy,
    },
  })
})
