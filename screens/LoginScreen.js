import { StyleSheet, Text, View, TextInput } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { GlobalStyles } from "../constants/styles";
import { ButtonCustom } from "../components/ui/ButtonCustom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";


const LoginScreen = () => {
    const authCntx = useContext(AuthContext)
    return (
        <View style={styles.rootScreen}>
            <LinearGradient colors={[GlobalStyles.primary500,GlobalStyles.primary50, '#f1f1f1f1']} style={[styles.rootScreen, styles.container]}>
                <View>
                    <Text style={styles.title}>Bienvenido</Text>
                    <Text style={styles.subtitle}>Ingresa los datos de tu cuenta</Text>
                    <TextInput
                    style={styles.textInput} 
                    placeholder="jhon@email.com" />
                    <TextInput
                    style={styles.textInput} 
                    placeholder="password"  secureTextEntry={true}/>
                </View>
            <ButtonCustom title={'Iniciar sesion'} onPress={authCntx.login}/>
            <Text style={styles.link}>Aun no tienes una cuenta?</Text>
            </LinearGradient>
        </View>
    )
}

export default LoginScreen

const styles = StyleSheet.create({
    rootScreen: {
        flex: 1
    },
    container: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        fontSize: 65,
        fontWeight: 'bold',
        textAlign:'left',
        color:'#181818'
    },
    subtitle:{
        fontSize:15,
        color:'#302E2E'
    },
    textInput:{
        borderWidth:1,
        borderColor:GlobalStyles.primary100,
        paddingStart:25,
        backgroundColor:'white',
        padding:10,
        marginVertical:10,
        borderRadius:20
    },
    link:{
        color: 'gray',
        marginVertical:10
    }
})