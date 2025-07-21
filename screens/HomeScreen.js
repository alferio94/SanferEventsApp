import EventsList from '../components/app/EventsList'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import LoadingOverlay from '../components/ui/LoadingOverlay'

const HomeScreen = () => {
  const { events, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return <LoadingOverlay />
  }

  return (
    <EventsList events={events} />
  )
}

export default HomeScreen