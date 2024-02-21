import { Pressable, Text, View, Image, StyleSheet, Platform } from "react-native"
import { GlobalStyles } from "../../constants/styles";

const EventItem = ({ imageUrl, title, date }) => {
    return (
        <View style={styles.eventItem}>
            <Pressable android_ripple={{ color: '#ccc' }} style={({ pressed }) => [pressed && styles.buttonPressed]}>
                <View style={styles.innerContainer}>
                    <View>
                        <Image source={{ url: imageUrl }} style={styles.image} />
                        <Text style={[styles.textBase,styles.title]}>{title}</Text>
                        <Text style={[styles.textBase,styles.date]}>{date}</Text>
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
        height: 200,
    },
    textBase:{
        paddingHorizontal: 10
    },  
    title: {
        fontWeight: 'bold',
        textAlign: 'left',
        fontSize: 18,
        marginVertical: 8,
        color:GlobalStyles.textPrimary
    },
    date:{
        fontWeight: 'bold',
        textAlign: 'left',
        fontSize: 15,
        marginVertical: 8,
        color:GlobalStyles.textAccent
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