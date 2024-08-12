import { Pressable, StyleSheet, Text, View, useWindowDimensions } from "react-native"
import { Ionicons } from '@expo/vector-icons'



const IconButton = ({icon, label, onPress}) => {
  const width = useWindowDimensions().width
  return (
    <View style={styles.container}>
        <Pressable style={({pressed}) => pressed && styles.pressed} onPress={onPress}>
            <Ionicons style={[styles.icon, {fontSize: width < 400 ? 50 : 40}]} name={icon} />
            <Text style={[styles.label, {fontSize: width < 400 ? 18 : 14}]}>{label}</Text>
        </Pressable>
    </View>
  )
}

export default IconButton;

const styles = StyleSheet.create({
    container:{
        width:110,
        height:110,
        justifyContent:'flex-start',
        alignItems:'center',
        padding:5
    },
    pressed:{
       opacity: 0.75
    },  
    icon:{
        textAlign:'center'
    },
    label:{
        textAlign:'center'
    }

})