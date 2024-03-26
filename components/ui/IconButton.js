import { Pressable, StyleSheet, Text, View } from "react-native"
import { Ionicons } from '@expo/vector-icons'

const IconButton = ({icon, label, onPress}) => {
  return (
    <View style={styles.container}>
        <Pressable style={({pressed}) => pressed && styles.pressed} onPress={onPress}>
            <Ionicons style={styles.icon} name={icon} />
            <Text style={styles.label}>{label}</Text>
        </Pressable>
    </View>
  )
}

export default IconButton;

const styles = StyleSheet.create({
    container:{
        width:110,
        height:110,
        justifyContent:'center',
        alignItems:'center',
        padding:5
    },
    pressed:{
       opacity: 0.75
    },  
    icon:{
        fontSize:35,
        textAlign:'center'
    },
    label:{
        textAlign:'center'
    }

})