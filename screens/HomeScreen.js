import { DATA } from '../constants/data'
import EventsList from '../components/app/EventsList'
import { useLayoutEffect,useContext, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import { UserContext } from '../context/UserContext'
import { getEvents } from '../util/http'
import LoadingOverlay from '../components/ui/LoadingOverlay'

const HomeScreen = () => {
  const {user} = useContext(AuthContext);
  const userCntx = useContext(UserContext);
  const [fetching, setFetching]=useState(true)

  async function getUserEvents(){
    setFetching(true);
    const events = await getEvents(user.id);
    userCntx.fetchEvents(events);
    setFetching(false);
  }
  useLayoutEffect( ()=>{
    getUserEvents();
  },[])

  if(fetching){
    return <LoadingOverlay />
  }
  return (
    <EventsList events={userCntx.events} />
  )
}

export default HomeScreen