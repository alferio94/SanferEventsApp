import { useContext, useLayoutEffect } from "react";
import { Image, StyleSheet, Text, View, Platform, ScrollView } from "react-native"
import { UserContext } from "../../context/UserContext";
import { URL } from "../../constants/url";
import { Ionicons } from '@expo/vector-icons'
import IconButton from "../../components/ui/IconButton";



const EventDetails = ({ route, navigation }) => {
    const userCntx = useContext(UserContext)
    const eventId = route.params.eventId;
    const eventSelected = userCntx.events.find(event => event.id === eventId);

    function clickHandler(destinaton){
        navigation.navigate(destinaton, {eventId: eventId})
    }


    /* const {nombre} =  */
    return (
        <View>
            <Image source={{ uri: `${URL}${eventSelected.banner}` }} style={styles.image} />
            <View style={styles.details}>
                <View>
                    <Text style={styles.eventName}>{eventSelected.nombre}</Text>
                    <Text style={styles.eventDate}>{eventSelected.fecha_inicio.slice(0, 10)}</Text>
                </View>
                <Ionicons style={styles.calendarIcon} name="calendar" />
            </View>

            <ScrollView>
                <View style={styles.iconContainer}>
                    <IconButton icon='today' label='Agenda' onPress={clickHandler.bind(this, 'agenda')} />
                    <IconButton icon='easel-sharp' label='Ponentes' onPress={clickHandler.bind(this, 'speakers')}/>
                    <IconButton icon='business-sharp' label='Sede' onPress={clickHandler.bind(this, 'sedeDetails')}/>
                    <IconButton icon='airplane-sharp' label='Transporte' onPress={clickHandler.bind(this,'transport')}/>
                    <IconButton icon='bed-sharp' label='Hotel' onPress={clickHandler.bind(this,'hotel')}/>
                    <IconButton icon='restaurant-sharp' label='Alimentos' onPress={clickHandler.bind(this, 'foodInfo')}/>
                    <IconButton icon='information-circle-sharp' label='Informacion General' onPress={clickHandler.bind(this, 'generalInfo')}/>
                    <IconButton icon='medkit' label='Atención Médica'onPress={clickHandler.bind(this, 'health')}/>
                    <IconButton icon='clipboard-sharp' label='Encuestas'/>
                </View>
            </ScrollView>
        </View>
    )
}

export default EventDetails;

const styles = StyleSheet.create({
    imageContainer: {},
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
    iconContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingVertical:10,
        flex:1,
        alignItems:'center',
        justifyContent:'center'
    }
})