import { useContext } from "react";
import { ScrollView, View, useWindowDimensions, Text, StyleSheet, Platform, Image } from "react-native"
import HTML from 'react-native-render-html';
import { UserContext } from "../../context/UserContext";
import { URL } from "../../constants/url";

const GeneralInfo = ({ route }) => {
    const userCntx = useContext(UserContext)
    const eventId = route.params.eventId;
    const { tips, vestimenta, banner } = userCntx.events.find(event => event.id === eventId);
    const { width } = useWindowDimensions();

    return (
        <ScrollView>
            <Image style={styles.image} source={{uri:`${URL}${banner}`}}/>
            <View>
                <View style={styles.generalInfo}>
                    <Text style={styles.title}>Código de vestimenta:</Text>
                    <Text style={styles.subtitle}>{vestimenta}</Text>
                </View>
                <View style={styles.scroll}>
                    <Text style={[styles.tips,styles.subtitle]}>Tips de viaje:</Text>
                    <HTML source={{ html: tips }} contentWidth={width} />
                </View>
            </View>
        </ScrollView>
    )
}

export default GeneralInfo;

const styles = StyleSheet.create({
    image: {
        width: '100%',
        height: 200,
    },
    scroll: {
        padding: 10
    },
    generalInfo:{
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
    title:{
        fontWeight:'bold',
        fontSize:20
    },
    subtitle:{
        fontSize:16,
        fontWeight:'500'
    },
    tips:{
        marginBottom:20
    }
})

