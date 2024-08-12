import { View,Text, StyleSheet, Image } from "react-native"
import { GlobalStyles } from "../../../constants/styles";
import { URL } from "../../../constants/url";

const SpeakerItem = ({item}) => {
  return (
   <View style={styles.infoContainer}>
        {(item.speakerPhoto && item.speakerPhoto !== '') ? <Image source={{ uri: `${URL}${item.speakerPhoto}` }} style={styles.img}/> : <View style={styles.img}></View>}
    <View>
        <Text style={styles.speaker}>{item.name}</Text>
        <Text style={styles.presentation}>{item.presentation}</Text>
    </View>
   </View>
  )
}

export default SpeakerItem;

const styles = StyleSheet.create({
    infoContainer:{
        flexDirection:'row',
        marginVertical:10,
        alignItems:'center'
    },
    img:{
        width:80,
        height:80,
        borderRadius:40,
        marginHorizontal:20,
        backgroundColor:GlobalStyles.primary50,
    },
    speaker:{
        fontSize:20,
        fontWeight:'bold',
    },
    presentation:{
        color:GlobalStyles.textAccent,

    }
})