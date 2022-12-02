// index.ts

/**
 *
 */

import type { InferGetServerSidePropsType } from 'next'

import { getSession, withPageAuthRequired } from '@auth0/nextjs-auth0'
import ErrorComponent from 'next/error'
import Image from 'next/image'

import { isAdministrator } from '../lib/auth'
import { auth0 } from '../lib/util'
import { loadPolicy } from '../lib/load-policies'

export default function Dashboard({
  authorized,
  policy,
  members,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  if (authorized) {
    return (
      <div>
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a href="/api/auth/logout">Log out</a>
        <br />
        <br />
        <p>Policy</p>
        <textarea readOnly value={policy} />

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
                  <Image
                    src={picture ?? ''}
                    alt={name ?? ''}
                    width={48}
                    height={48}
                  />
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
      <ErrorComponent
        statusCode={403}
        title="You are not authorized to view this page"
      />
    )
  }
}

export const getServerSideProps = withPageAuthRequired({
  getServerSideProps: async (ctx) => {
    if (!(await isAdministrator(ctx.req, ctx.res))) {
      ctx.res.statusCode = 403
      return { props: { authorized: false, policy: {}, members: [] } }
    }

    const session = getSession(ctx.req, ctx.res)
    const orgId = session?.user.org_id
    console.log("orgid " + orgId)
    const policy = await loadPolicy(orgId)
    const members = await auth0().organizations.getMembers({ id: orgId })
    const withRoles = await Promise.all(
      members.map(async (member) => {
        if (member.user_id === undefined) {
          throw new Error(
            `Missing property 'user_id' from ${JSON.stringify(member)}`,
            {}
          )
        }

        const roles = await auth0().organizations.getMemberRoles({
          id: orgId,
          user_id: member.user_id as string,
        })

        return { ...member, roles }
      })
    )

    return {
      props: {
        authorized: true,
        policy: policy != null ? JSON.parse(JSON.stringify(policy?.policy)) : {},
        members: withRoles,
      },
    }
  },
})
