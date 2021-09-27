import { useContext } from 'react'
import UserContext from '../../UserContext'
import ComplexInput from './ComplexInput'
import Skeleton from 'react-loading-skeleton'

const DisplayHomeFromId = props => {
  const userContext = useContext(UserContext)
  const home = userContext.user?.homes?.find(home => home._id === props.watch("homeId"))
  const homeText = home?.nickname || home?.address

  return <> 
    <p>{props.areDetailsLoaded ? (homeText || "Home not found") : <Skeleton height={20} width={400}/>}</p>
    <ComplexInput {...props} labelHidden type="hidden" />
  </>
}

export default DisplayHomeFromId