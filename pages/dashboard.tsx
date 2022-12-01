import { useState } from 'react'
import Network from '../components/network'
import Template from '../components/template'
import Users from '../components/users'
import { navigation } from '../constants/navigation'

export default () => {
  const [current, setCurrent] = useState(1)

  const nameToBody = {
    Users: <Users />,
    "Network Logs": <Network />
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
