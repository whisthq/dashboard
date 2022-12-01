import Template from '../components/template'
import Users from '../components/users'

export default function Dashboard() {
  return(
    <div>
      <Template current="Users" body={<Users/>}/>
    </div>
  )
}