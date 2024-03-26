import { useContext } from "react";
import { Image, StyleSheet, Text, View, Platform, Linking, Pressable } from "react-native"
import { UserContext } from "../../context/UserContext";
import { URL } from "../../constants/url";
import { Ionicons } from '@expo/vector-icons';




const Sede = ({ route }) => {
    const userCntx = useContext(UserContext)
    const eventId = route.params.eventId;
    const { sede, sede_telefono, sede_mapa, sede_foto } = userCntx.events.find(event => event.id === eventId);


    function phoneHandler() {
        const phoneUrl = `tel:${sede_telefono}`
        Linking.openURL(phoneUrl)
    }
    function mapHandler(){
        Linking.openURL(sede_mapa);
    }

    return (
        <View style={styles.container}>
            <Image source={{ uri: `${URL}${sede_foto}` }} style={styles.image} />
            <View style={styles.details}>
                <View>
                    <Text style={styles.eventName}>{sede}</Text>
                </View>
                <Ionicons style={styles.calendarIcon} name="business-sharp" />
            </View>
            <View style={styles.container}>
                <Pressable onPress={phoneHandler}>
                    <View style={styles.infoContainer}>
                        <Ionicons style={[styles.basicText, styles.infoIcon]} name="call-sharp" />
                        <Text style={styles.basicText}>{sede_telefono}</Text>
                    </View>
                </Pressable>
                <Pressable onPress={mapHandler}>
                    <View style={styles.infoContainer}>
                        <Ionicons style={[styles.basicText, styles.infoIcon]} name="location-sharp" />
                        <Text style={styles.basicText}>{sede_mapa}</Text>
                    </View>
                </Pressable>
            </View>
        </View>
    )
}

export default Sede;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
    image: {
        width: '100%',
        height: 200,
    },
    details: {
        flexDirection: 'row',
        width: '100%',
        backgroundColor: '#DDD6D6',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: 10,
        elevation: 10,
        shadowColor: '#000',
        shadowOpacity: 0.35,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        overflow: Platform.OS === 'android' ? 'hidden' : 'visible'
    },
    eventName: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    eventDate: {
        fontSize: 12,
        color: '#8A8A8A',
        fontWeight: 'bold'
    },
    calendarIcon: {
        fontSize: 24
    },
    infoIcon: {
        fontSize: 30,
        marginHorizontal: 5
    },
    infoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginVertical: 20,
        paddingHorizontal:20,
    },
    basicText: {
        color: '#929292',
        textAlign: 'center',
    }
})