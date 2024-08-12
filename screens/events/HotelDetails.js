import { useLayoutEffect, useState } from "react";
import { Image, StyleSheet, Text, View, Platform, Linking, Pressable } from "react-native"
import { Ionicons } from '@expo/vector-icons';
import { getHotel } from "../../util/http";
import { URL } from "../../constants/url";

const HotelDetails = ({ route }) => {
    const eventId = route.params.eventId
    const [hotel, setHotel] = useState()
    useLayoutEffect(() => {
        getHotelDetails();
    }, [])
    function phoneHandler() {
        const phoneUrl = `tel:${hotel.phone}`
        Linking.openURL(phoneUrl)
    }
    function mapHandler() {
        Linking.openURL(hotel.map);
    }
    async function getHotelDetails() {
        try {
            const hotelDetails = await getHotel(eventId);
            hotelDetails && setHotel(hotelDetails);
        } catch (error) {
            
        }
    }
    if(!hotel){
        return<View>
            <Text>Hotel no asignado aún</Text>
        </View>
    }
    return (
        <View style={styles.container}>
            <Image source={{ uri: `${URL}${hotel.photo}` }} style={styles.image} />
            <View style={styles.details}>
                <View>
                    <Text style={styles.eventName}>{hotel.name}</Text>
                </View>
                <Ionicons style={styles.calendarIcon} name="business-sharp" />
            </View>
            <View style={styles.container}>
                <Pressable onPress={phoneHandler}>
                    <View style={styles.infoContainer}>
                        <Ionicons style={[styles.basicText, styles.infoIcon]} name="call-sharp" />
                        <Text style={styles.basicText}>{hotel.phone}</Text>
                    </View>
                </Pressable>
                <Pressable onPress={mapHandler}>
                    <View style={styles.infoContainer}>
                        <Ionicons style={[styles.basicText, styles.infoIcon]} name="location-sharp" />
                        <Text style={styles.basicText}>{hotel.address}</Text>
                    </View>
                </Pressable>
            </View>
        </View>
    )
}

export default HotelDetails

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
    image: {
        width: '100%',
        height: 300,
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
        paddingHorizontal:30,
    },
    basicText: {
        color: '#929292',
        textAlign: 'left',
    }
})