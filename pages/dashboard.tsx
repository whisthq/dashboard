import { useState } from 'react'
import Network from '../components/network'
import Template from '../components/template'
import Users from '../components/users'
import PolicyDisplay from '../components/policy'
import { navigation } from '../constants/navigation'
import { Policy } from '../lib/types'
import { OrganizationMember } from 'auth0'
import Extensions from '../components/extensions'
import Protection from '../components/protection'

const Dashboard = ({
  policy,
}: {
  policy: Policy
  members: OrganizationMember[]
}) => {
  const [current, setCurrent] = useState(1)

  const nameToBody: { [page: string]: JSX.Element } = {
    Users: <Users />,
    'Network Logs': <Network />,
    Policies: <PolicyDisplay policy={policy} />,
    Extensions: <Extensions />,
    Protection: <Protection />,
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
