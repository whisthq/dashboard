import { useState } from 'react'
import Network from '../components/network'
import Template from '../components/template'
import Users from '../components/users'
import PolicyDisplay from '../components/policy'
import { navigation } from '../constants/navigation'
import { Policy } from '../lib/types'
import { OrganizationMember } from 'auth0'

const Dashboard = ({
  policy,
  members,
}: {
  policy: Policy
  members: OrganizationMember[]
}) => {
  const [current, setCurrent] = useState(1)

  const nameToBody: { [page: string]: JSX.Element } = {
    Users: <Users members={members} />,
    'Network Logs': <Network />,
    Policies: <PolicyDisplay policy={policy} />,
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
