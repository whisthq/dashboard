// policy.ts

/**
 *
 */

import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0'

import { mongo } from '../../lib/util'

export default withApiAuthRequired((req, res) => {
  const db = await mongo
  const session = getSession(req, res)

  switch (req.method) {
    case 'GET':
      res.status(200).json({})
      break
    case 'PUT': {
      // TODO(owen): Check for admin authorization.
    }
    default:
      res.status(405).json({
	error: 'not_allowed',
	description: `HTTP request method '${req.method}' not allowed`
      })
  }
})
