import { View, Text, FlatList } from "react-native"
import RestaurantCard from "./RestaurantCard"

const RestaurantList = ({food}) => {
  
  return (
    <View>
      <FlatList renderItem={RestaurantCard} data={food} />
    </View>
  )
}

export default RestaurantList