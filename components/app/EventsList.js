import { FlatList } from "react-native"
import EventItem from "./EventItem"

function RenderEventItem(itemData){
    return <EventItem {...itemData.item} />
}

const EventsList = ({events}) => {
  return (
    <FlatList data={events} renderItem={RenderEventItem} />
  )
}

export default EventsList