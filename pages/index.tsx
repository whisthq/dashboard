// index.ts

/**
 *
 */

import type { OrganizationMember } from 'auth0'

import { getSession, withPageAuthRequired } from '@auth0/nextjs-auth0'
import Error from 'next/error'
import Image from 'next/image'

import { auth0, mongo } from '../lib/util'

export default function Dashboard({ authorized, policy, members }) {
  if (authorized) {
    return (
      <div>
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a href="/api/auth/logout">Log out</a>
        <br />
        <br />
        <p>Policy</p>
        <textarea readOnly value={JSON.stringify(policy)} />
        <br />
        <br />
        <p>Users</p>
        <table>
          <thead>
            <tr>
              <th>Photo</th>
              <th>Name</th>
              <th>Email</th>
              <th>Roles</th>
            </tr>
          </thead>
          <tbody>
            {members.map(({ email, name, picture, roles, user_id: userId }) => (
              <tr key={userId}>
                <td>
                  <Image src={picture} alt={name} width={48} height={48} />
                </td>
                <td>{name}</td>
                <td>{email}</td>
                <td>{roles.map((role) => role.name).join(', ') || 'Member'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  } else {
    return (
      <Error
        statusCode={403}
        title="You are not authorized to view this page"
      />
    )
  }
}

export const getServerSideProps = withPageAuthRequired({
  getServerSideProps: async (ctx) => {
    const db = await mongo
    const session = getSession(ctx.req, ctx.res)

    // TODO(owen): Make this check robust against admin as a substring.
    if (!session?.accessTokenScope?.includes('admin')) {
      ctx.res.statusCode = 403
      return { props: { authorized: false, policy: {}, members: [] } }
    }

    const orgId = session.user.org_id
    const policies = db.db('policies').collection('org_policies')
    const policy = (await policies.findOne({ _id: orgId })) ?? {}
    const members = await new Promise<OrganizationMember[]>(
      (resolve, reject) => {
        auth0.organizations.getMembers({ id: orgId }, (err, members) => {
          if (!err) {
            resolve(members)
          } else {
            reject(err)
          }
        })
      }
    )
    const withRoles = await Promise.all(
      members.map(async (member) => {
        const roles = await new Promise(async (resolve, reject) => {
          if (member.user_id) {
            await auth0.organizations.getMemberRoles(
              {
                id: orgId,
                user_id: member.user_id,
              },
              (err, roles) => {
                if (!err) {
                  resolve(roles)
                } else {
                  reject(err)
                }
              }
            )
          } else {
            reject(`Missing property 'user_id' from ${JSON.stringify(member)}`)
          }
        })

        return { ...member, roles }
      })
    )

    return { props: { authorized: true, policy, members: withRoles } }
  },
})
