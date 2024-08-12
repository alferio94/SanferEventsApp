import { useLayoutEffect, useState } from "react";
import RestaurantList from "../../components/app/EventDetails/RestaurantList"
import { getFood } from "../../util/http";
import { StyleSheet, Text, View } from "react-native";
import { GlobalStyles } from "../../constants/styles";


const FoodInfo = ({ route }) => {
    const eventId = route.params.eventId;
    const [food, setFood] = useState([])
    async function getFoodInfo() {
        const foodInfo = await getFood(eventId);
        foodInfo && setFood(foodInfo);
    }
    useLayoutEffect(() => {
        getFoodInfo();
    }, [eventId])
    return (
        <View style={styles.container}>
            {food.length > 0 ? <RestaurantList food={food} /> : <Text style={styles.errorMsg}>No se han agregado restaurantes aún</Text>}
        </View>

    )
}

export default FoodInfo

const styles = StyleSheet.create({
    container:{
       padding:10
    },
    errorMsg:{
       color:GlobalStyles.primary100,
       fontSize:20,
       fontWeight: '600'
    }
})