// index.ts

/**
 *
 */

import { getSession, withPageAuthRequired } from '@auth0/nextjs-auth0'

import { auth0, mongo } from '../lib/util'

export default function Dashboard({ user, policy, users }) {
  return (
    <div>
      <a href="/api/auth/logout">Log out</a>
      <br />
      <br />
      <p>Policy</p>
      <textarea readOnly={ true } value={ JSON.stringify(policy) } />
      <br />
      <br />
      <p>Users</p>
      <table>
      <thead>
      <tr>
      <th>Photo</th>
      <th>Name</th>
      <th>Email</th>
      </tr>
      </thead>
      <tbody>
      {
	users.map(({ email, name, picture, user_id }) => (
	  <tr key={ user_id }>
	    <td><img src={ picture } alt={ name } /></td>
	    <td>{ name }</td>
	    <td>{ email }</td>
          </tr>
	))
      }
      </tbody>
      </table>
    </div>
  )
}

export const getServerSideProps = withPageAuthRequired({
  getServerSideProps: async ctx => {
    const db = await mongo
    const session = getSession(ctx.req, ctx.res)
    const policies = db.db('policies').collection('org_policies')
    const policy = await policies.findOne({ _id: session.user.org_id }) ?? {}
    const users = await new Promise((resolve, reject) => {
      auth0.organizations.getMembers({
	id: session.user.org_id
      }, (err, members) => {
	if (err !== undefined) {
	  resolve(members)
	} else {
	  reject(err)
	}
      })
    })
    
    return { props: { policy, users } }
  }
})
