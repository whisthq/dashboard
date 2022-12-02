// index.ts

/**
 *
 */
import { getSession, withPageAuthRequired } from '@auth0/nextjs-auth0'
import ErrorComponent from 'next/error'

import { isAdministrator } from '../lib/auth'
import { auth0 } from '../lib/util'
import { loadPolicy, Policy } from '../lib/load-policies'

import Dashboard from './dashboard'
import { OrganizationMember } from 'auth0'

export default function Root({
  authorized,
  token,
  orgId,
  policyId,
  policy,
  members,
}: {
  authorized: boolean
  token: string
  orgId: string
  policyId: string
  policy: Policy
  members: OrganizationMember[]
}) {
  if (authorized) {
    return (
      <>
        <Dashboard
          token={token}
          orgId={orgId}
          policyId={policyId}
          policy={policy}
          members={members}
        />
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
      token: string
      orgId: string
      policyId: string
      policy: Policy
      members: OrganizationMember[]
    }
  }> => {
    if (!(await isAdministrator(ctx.req, ctx.res))) {
      ctx.res.statusCode = 403
      return {
        props: {
          authorized: false,
          token: '',
          orgId: '',
          policyId: '',
          policy: {},
          members: [],
        },
      }
    }

    const session = getSession(ctx.req, ctx.res)
    const orgId = session?.user.org_id
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
        token: session?.accessToken ? session.accessToken : '',
        orgId: orgId,
        policyId: policy != null ? JSON.parse(JSON.stringify(policy?._id)) : '',
        policy:
          policy != null ? JSON.parse(JSON.stringify(policy?.policy)) : {},
        members: withRoles,
      },
    }
  },
})
