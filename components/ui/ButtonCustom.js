import { Pressable, StyleSheet, Text, View } from "react-native"
import { GlobalStyles } from "../../constants/styles"
export const ButtonCustom = ({title, onPress}) => {
  return (
    <Pressable style={({pressed}) => pressed ? [styles.button, styles.buttonPressed] : styles.button} onPress={onPress}>
      <View >
        <Text style={styles.buttonText}>{title}</Text>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  button:{
      borderRadius: 20,
      padding: 10,
      backgroundColor: GlobalStyles.primary500,
      minWidth:150,
      elevation:6,
      shadowColor: '#181818',
      shadowOffset:{width:1,height:1},
      shadowRadius:2,
      shadowOpacity:0.75,
      marginVertical: 10
  },
  buttonPressed:{
    backgroundColor:GlobalStyles.primary50
  },
  buttonText:{
    color:'#ffffff',
    textAlign:'center'
  },
})
