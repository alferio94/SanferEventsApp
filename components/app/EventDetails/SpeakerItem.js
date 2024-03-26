import { View,Text, StyleSheet } from "react-native"
import { GlobalStyles } from "../../../constants/styles";


const SpeakerItem = ({item}) => {
  return (
   <View style={styles.infoContainer}>
    <View style={styles.img}></View>
    <View>
        <Text style={styles.speaker}>{item.nombre}</Text>
        <Text style={styles.presentation}>{item.ponencia}</Text>
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
        backgroundColor: GlobalStyles.primary50,
        borderRadius:40,
        marginHorizontal:20
    },
    speaker:{
        fontSize:20,
        fontWeight:'bold',
    },
    presentation:{
        color:GlobalStyles.textAccent,

    }
})