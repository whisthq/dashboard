// index.ts

/**
 *
 */
import { getSession, withPageAuthRequired } from '@auth0/nextjs-auth0'
import ErrorComponent from 'next/error'

import { isAdministrator } from '../lib/auth'
import { auth0, mongo } from '../lib/util'
import { Policy } from '../lib/types'

import Dashboard from './dashboard'
import { OrganizationMember } from 'auth0'

export default function Root({
  authorized,
  policy,
  members,
}: {
  authorized: boolean
  policy: Policy
  members: OrganizationMember[]
}) {
  if (authorized) {
    return (
      <>
        <Dashboard policy={policy} members={members} />
      </>
    )
  } else {
    return (
      <ErrorComponent
        statusCode={403}
        title="You are 'not authorized to view this page"
      />
    )
  }
}

export const getServerSideProps = withPageAuthRequired({
  getServerSideProps: async (
    ctx
  ): Promise<{
    props: {
      authorized: boolean
      policy: Policy
      members: OrganizationMember[]
    }
  }> => {
    if (!(await isAdministrator(ctx.req, ctx.res))) {
      ctx.res.statusCode = 403
      return {
        props: {
          authorized: false,
          policy: {},
          members: [],
        },
      }
    }

    const session = getSession(ctx.req, ctx.res)
    const orgId = session?.user.org_id

    // TODO: Handle missing organization ID.

    const db = await mongo()
    const policies = db.db('policies').collection('org_policies')
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, ...policy } = (await policies.findOne({ _id: orgId })) ?? {}
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
        policy,
        members: withRoles,
      },
    }
  },
})
