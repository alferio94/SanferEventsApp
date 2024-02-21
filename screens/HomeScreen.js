import { Text } from 'react-native'
import { DATA } from '../constants/data'
import EventsList from '../components/app/EventsList'

const HomeScreen = () => {
  const DUMMY_DATA = DATA
  return (
    <EventsList events={DUMMY_DATA} />
  )
}

export default HomeScreen