import { FlatList, Linking, StyleSheet, View, Platform, Pressable, Text } from 'react-native'
import { Ionicons } from '@expo/vector-icons';



const HealthCare = () => {
    const numeros = [
        {
            name: 'Emergencias',
            phone: '911'
        },
        {
            name: 'Ángeles Verdes',
            phone: '078'
        },
        {
            name: 'Protección Civil',
            phone: '5551280000'
        },
        {
            name: 'LOCATEL',
            phone: '5556581111'
        },
        {
            name: 'Policía Federal',
            phone: '088'
        },
    ]
    function pressHandler(phone) {
        if (phone.length > 2) {
            Linking.openURL(`tel:${phone}`);
        }
    }
    function renderItem({ item }) {
        return <View style={styles.phone}>
            <Pressable android_ripple={{ color: '#ccc' }} style={({ pressed }) => [pressed && styles.buttonPressed]} onPress={pressHandler.bind(this, item.phone)}>
                <View style={styles.innerContainer}>
                    <View style={styles.dataWrapper}>
                        <Ionicons style={styles.calendarIcon} name="call-sharp" />
                        <Text>{item.name}</Text>
                    </View>
                </View>
            </Pressable>
        </View>
    }
    return (
        <View style={styles.listContainer}>
            <FlatList data={numeros} renderItem={renderItem} />
        </View>
    )
}

export default HealthCare;

const styles = StyleSheet.create({
    listContainer: {
        flex: 1,
        padding: 20
    },
    phone: {
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
        paddingHorizontal:10,
        paddingVertical:20
    },
    buttonPressed: {
        opacity: 0.75
    },
})