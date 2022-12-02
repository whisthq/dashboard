import { useState } from 'react'
import Network from '../components/network'
import Template from '../components/template'
import Users from '../components/users'
// import Policy from '../components/policy'
import PolicyForm from '../components/form'
import { navigation } from '../constants/navigation'

export default ({ token, orgId, policyId, policy, members }) => {
  const [current, setCurrent] = useState(1)

  const nameToBody = {
    Users: <Users members={members} />,
    'Network Logs': <Network />,
    Policies: (
      <PolicyForm
        token={token}
        orgId={orgId}
        policyId={policyId}
        policy={policy}
        isUpdate={false}
      />
    ),
  } as any

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
