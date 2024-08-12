import { useEffect, useState } from "react"
import { FlatList, StyleSheet, Text, View } from "react-native"
import { getSpeakers } from "../../util/http";
import SpeakerItem from "../../components/app/EventDetails/SpeakerItem";
import { GlobalStyles } from "../../constants/styles";


const Speakers = ({route}) => {
    const eventID = route.params.eventId
    const [speakers, setSpeakers] = useState([]);

    async function getSpeakersHandler(){
        const speakersArr = await getSpeakers(eventID);
        speakersArr && setSpeakers(speakersArr);
    }
    useEffect(()=>{
        getSpeakersHandler();
    },[])
  return (
    <View style={styles.container}>
       {speakers.length > 0 ?  <FlatList data={speakers} renderItem={SpeakerItem} /> : <Text style={styles.errorMsg}>Aún no se han registrado ponentes</Text>}
    </View>
  )
}

export default Speakers;
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