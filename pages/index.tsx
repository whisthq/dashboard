// index.ts

/**
 *
 */

import type { InferGetServerSidePropsType } from 'next'

import { getSession, withPageAuthRequired } from '@auth0/nextjs-auth0'
import ErrorComponent from 'next/error'
import Image from 'next/image'

import { isAdministrator } from '../lib/auth'
import { auth0, mongo } from '../lib/util'

import Dashboard from './dashboard'

export default function Root({
  authorized,
  policy,
  members,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  if (authorized) {
    return (
      <><Dashboard/></>
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

    const db = await mongo()
    const session = getSession(ctx.req, ctx.res)
    const orgId = session?.user.org_id
    const policies = db.db('policies').collection('org_policies')
    const policy = (await policies.findOne({ _id: orgId })) ?? {}
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

    return { props: { authorized: true, policy, members: withRoles } }
  },
})
