import { Pressable, Text, View, Image, StyleSheet, Platform,Linking } from "react-native"
import { GlobalStyles } from "../../../constants/styles"
import { ButtonCustom } from "../../ui/ButtonCustom";

const RestaurantCard = ({item}) => {
    const {direccion, foto, mapa, telefono, nombre} = item
    function mapHandler(){
        Linking.openURL(mapa);
    }
    function callHandler(){
        const url = `tel:${telefono}`
        Linking.openURL(url);
    }
    return (
        <View style={styles.eventItem}>
                <View style={styles.innerContainer}>
                    <View>
                        <Image source={{ uri: `${foto}` }} style={styles.image} />
                        <Text style={[styles.textBase, styles.title]}>{nombre}</Text>
                    </View>
                    <View style={styles.buttonContainer}>
                        <ButtonCustom title='Mostrar ubicacion' onPress={mapHandler} />
                        <ButtonCustom title='Llamar' style={styles.callButton} onPress={callHandler} />
                    </View>
                </View>
        </View>
    )
}

export default RestaurantCard

const styles = StyleSheet.create({
    eventItem: {
        margin: 14,
        elevation: 10,
        shadowColor: '#000',
        shadowOpacity: 0.35,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        overflow: Platform.OS === 'android' ? 'hidden' : 'visible'
    },
    innerContainer: {
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: '#fff'
    },
    image: {
        width: '100%',
        height: 300,
    },
    textBase: {
        paddingHorizontal: 10
    },
    title: {
        fontWeight: 'bold',
        textAlign: 'left',
        fontSize: 18,
        marginVertical: 8,
        color: GlobalStyles.textPrimary
    },
    date: {
        fontWeight: 'bold',
        textAlign: 'left',
        fontSize: 15,
        marginVertical: 8,
        color: GlobalStyles.textAccent
    },
    infoWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: 8,
        marginVertical: 5
    },
    buttonPressed: {
        opacity: 0.75
    },
    buttonContainer:{
        flexDirection:'row',
        justifyContent: 'space-around'
    },  
    callButton:{
        backgroundColor:'#498AEB'
    }
})