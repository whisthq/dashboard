// index.ts

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
  }

  const session = getSession(req, res)
  const orgId = session?.user.org_id

  if (orgId === undefined) {
    res.status(401).json({
      errors: [
        {
          status: 'Unauthorized',
          detail: 'You must be an enterprise customer to perform this action.',
          links: {
            type: 'https://http.cat/401',
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

  // TODO(owen): Parse and save form data
  const db = await mongo()
  db.db('policies').collection('org_policies')
  console.log(req.body)
  res.status(501).send('Not Implemented')
})
