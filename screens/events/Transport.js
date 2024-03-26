import { useLayoutEffect, useState } from "react";
import { FlatList, View, Text, StyleSheet, Platform, Pressable, Linking, Alert } from "react-native"
import { getTransports } from "../../util/http";
import { Ionicons } from '@expo/vector-icons';


const Transport = ({ route }) => {
    const eventId = route.params.eventId;
    const [transports, setTransports] = useState([]);
    useLayoutEffect(() => {
        getTransportsEvent()
    }, [])
    async function getTransportsEvent() {
        try {
            const data = await getTransports(eventId);
            data.length > 0 && setTransports(data);
        } catch (error) {

        }
    }
    function pressHandler(map) {
        if (map.length > 2) {
            Linking.openURL(map);
        } else {
            Alert.alert('Sin mapa', 'El administrador aun no ha proporcionado un enlace a la ubicacion')
        }
    }
    function renderItem({ item }) {
        return <View style={styles.transport}>
            <Pressable android_ripple={{ color: '#ccc' }} style={({ pressed }) => [pressed && styles.buttonPressed]} onPress={pressHandler.bind(this, item.mapa)}>
                <View style={styles.innerContainer}>
                    <Text style={styles.title}>{item.nombre}</Text>
                    <View style={styles.dataWrapper}>
                        <Ionicons style={styles.calendarIcon} name="calendar" />
                        <Text>{item.fecha.slice(0, 16)}</Text>
                    </View>
                </View>
            </Pressable>
        </View>
    }
    if (transports.length === 0) {
        return (
            <View>
                <Text>No se ha agregado informacion de transporte</Text>
            </View>
        )
    }
    return (
        <View style={styles.listContainer}>
            <FlatList data={transports} renderItem={renderItem} />
        </View>
    )
}

export default Transport

const styles = StyleSheet.create({
    listContainer: {
        flex: 1,
        padding: 20
    },
    transport: {
        padding: 5,
        marginBottom: 10,
        elevation: 6,
        shadowColor: '#000',
        shadowOpacity: 0.35,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        overflow: Platform.OS === 'android' ? 'hidden' : 'visible'
    },
    title: {
        marginBottom: 5,
        fontSize: 18,
        fontWeight: 'bold'
    },
    dataWrapper: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    calendarIcon: {
        fontSize: 18,
        marginHorizontal: 10
    },
    innerContainer: {
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: '#fff',
        padding: 10
    },
    buttonPressed: {
        opacity: 0.75
    },
})