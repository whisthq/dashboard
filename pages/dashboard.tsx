import { useState } from 'react'
import Network from '../components/network'
import Template from '../components/template'
import Users from '../components/users'
import PolicyDisplay from '../components/policy'
import { navigation } from '../constants/navigation'
import { Policy } from '../lib/load-policies'
import { OrganizationMember } from 'auth0'

const Dashboard = ({
  token,
  orgId,
  policyId,
  policy,
  members,
}: {
  token: string
  orgId: string
  policyId: string
  policy: Policy
  members: OrganizationMember[]
}) => {
  const [current, setCurrent] = useState(1)

  // TODO: Fix types
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const nameToBody: any = {
    Users: <Users members={members} />,
    'Network Logs': <Network />,
    Policies: (
      <PolicyDisplay
        token={token}
        orgId={orgId}
        policyId={policyId}
        policy={policy}
      />
    ),
  }

  const onClick = (index: number) => {
    setCurrent(index)
    console.log(index)
  }

  return (
    <div>
      <Template
        current={navigation[current].name}
        body={nameToBody[navigation[current].name]}
        onClick={(index: number) => onClick(index)}
      />
    </div>
  )
}

export default Dashboard
