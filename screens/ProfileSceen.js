import { useContext } from "react"
import { StyleSheet, Text, View } from "react-native"
import { AuthContext } from '../context/AuthContext'
import { GlobalStyles } from "../constants/styles"
import { ButtonCustom } from "../components/ui/ButtonCustom";


const ProfileSceen = () => {
  const usrCntx = useContext(AuthContext)
  const { user } = usrCntx;
  function logOutHandler(){
    usrCntx.logout()
  }
  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Bienvenido</Text>
      <View style={styles.userData}>
        <View style={styles.img}></View>
        <Text style={styles.userInfo}>{user.name}</Text>
      </View>
      <ButtonCustom title='Cerrar Sesión' onPress={logOutHandler}/>
    </View>
  )
}

export default ProfileSceen;

const styles = StyleSheet.create({
  container: {
    padding: 10
  },
  welcome: {
    fontSize: 30,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  userData: {
    flexDirection: 'row',
    marginTop: 10,
    alignItems:'center',
  },
  userInfo: {
    fontSize: 20,
  },
  img:{
    width:60,
    height:60,
    borderRadius:30,
    backgroundColor:GlobalStyles.primary50,
    marginRight:10
  }
})