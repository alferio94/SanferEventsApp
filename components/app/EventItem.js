import { Pressable, Text, View, Image, StyleSheet, Platform } from "react-native"
import { GlobalStyles } from "../../constants/styles";
import { URL } from "../../constants/url";
import { useNavigation } from "@react-navigation/native";

const EventItem = ({ id, banner, name, startDate }) => {
    const navigation = useNavigation()
    function pressHandler() {
        navigation.navigate('eventDetails', { eventId: id })
    }
    return (
        <View style={styles.eventItem}>
            <Pressable android_ripple={{ color: '#ccc' }} style={({ pressed }) => [pressed && styles.buttonPressed]} onPress={pressHandler}>
                <View style={styles.innerContainer}>
                    <View>
                        <Image source={{ uri: `${URL}${banner}` }} style={styles.image} />
                        <Text style={[styles.textBase, styles.title]}>{name}</Text>
                        <Text style={[styles.textBase, styles.date]}>{startDate.slice(0, 10)}</Text>
                    </View>
                </View>
            </Pressable>
        </View>

    )
}

export default EventItem;

const styles = StyleSheet.create({
    eventItem: {
        margin: 14,
        elevation: 6,
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
})