import { useEffect, useState } from "react"
import { FlatList, StyleSheet, Text, View } from "react-native"
import { getSpeakers } from "../../util/http";
import SpeakerItem from "../../components/app/EventDetails/SpeakerItem";
import { GlobalStyles } from "../../constants/styles";
import LoadingOverlay from "../../components/ui/LoadingOverlay";
import { Ionicons } from '@expo/vector-icons';


const Speakers = ({route}) => {
    const eventID = route.params.eventId
    const [speakers, setSpeakers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    async function getSpeakersHandler(){
        try {
            setLoading(true);
            setError(null);
            const speakersArr = await getSpeakers(eventID);
            
            if (speakersArr && speakersArr.length > 0) {
                setSpeakers(speakersArr);
            } else {
                setSpeakers([]);
            }
        } catch (error) {
            setError('Error al cargar los ponentes');
            setSpeakers([]);
        } finally {
            setLoading(false);
        }
    }
    
    useEffect(()=>{
        getSpeakersHandler();
    },[])
  if (loading) {
        return <LoadingOverlay />;
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Ionicons name="people-outline" size={64} color="#ccc" />
                <Text style={styles.errorTitle}>Error</Text>
                <Text style={styles.errorMessage}>{error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {speakers.length > 0 ? (
                <>
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Ponentes</Text>
                        <Text style={styles.headerSubtitle}>
                            {speakers.length} {speakers.length === 1 ? 'ponente confirmado' : 'ponentes confirmados'}
                        </Text>
                    </View>
                    <FlatList 
                        data={speakers} 
                        renderItem={({item}) => <SpeakerItem item={item} />}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.listContainer}
                    />
                </>
            ) : (
                <View style={styles.emptyContainer}>
                    <Ionicons name="mic-outline" size={64} color="#ccc" />
                    <Text style={styles.emptyTitle}>Sin ponentes</Text>
                    <Text style={styles.emptyMessage}>
                        Aún no se han registrado ponentes para este evento.
                    </Text>
                </View>
            )}
        </View>
    )
}

export default Speakers;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        backgroundColor: 'white',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e1e5e9',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#666',
    },
    listContainer: {
        padding: 16,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#333',
        marginTop: 16,
        marginBottom: 8,
    },
    emptyMessage: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        lineHeight: 20,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
        backgroundColor: '#f8f9fa',
    },
    errorTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#333',
        marginTop: 16,
        marginBottom: 8,
    },
    errorMessage: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        lineHeight: 20,
    },
})