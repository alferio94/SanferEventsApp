import { useContext } from "react";
import { Image, StyleSheet, Text, View, Platform, Linking, Pressable, ScrollView } from "react-native"
import { AuthContext } from "../../context/AuthContext";
import { URL } from "../../constants/url";
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { GlobalStyles } from "../../constants/styles";




const Sede = ({ route }) => {
    const { events } = useContext(AuthContext)
    const eventId = route.params.eventId;
    const eventSelected = events.find(event => event.id === eventId);
    
    // Usar los nuevos campos del backend o fallback a los antiguos
    const campus = eventSelected?.campus || eventSelected?.sede;
    const campusPhone = eventSelected?.campusPhone || eventSelected?.sede_telefono;
    const campusMap = eventSelected?.campusMap || eventSelected?.sede_mapa;
    const campusImage = eventSelected?.campusImage || eventSelected?.sede_foto;


    function phoneHandler() {
        if (campusPhone) {
            const phoneUrl = `tel:${campusPhone}`
            Linking.openURL(phoneUrl)
        }
    }
    
    function mapHandler(){
        if (campusMap) {
            Linking.openURL(campusMap);
        }
    }
    
    if (!eventSelected) {
        return (
            <View style={styles.errorContainer}>
                <Ionicons name="business-outline" size={64} color="#ccc" />
                <Text style={styles.errorTitle}>Evento no encontrado</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            {/* Imagen o gradiente de la sede */}
            <View style={styles.imageContainer}>
                {campusImage ? (
                    <Image 
                        source={{ uri: campusImage.startsWith('http') ? campusImage : `${URL}${campusImage}` }} 
                        style={styles.image} 
                    />
                ) : (
                    <LinearGradient
                        colors={['#ef3b42', '#ed353c']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.gradientImage}
                    >
                        <Ionicons name="business" size={48} color="white" />
                        <Text style={styles.gradientTitle}>Sede</Text>
                    </LinearGradient>
                )}
            </View>
            
            {/* Header con nombre de la sede */}
            <View style={styles.details}>
                <View style={styles.titleContainer}>
                    <Text style={styles.eventName}>{campus || 'Sede del evento'}</Text>
                    <Text style={styles.eventSubtitle}>Información de la sede</Text>
                </View>
                <Ionicons style={styles.calendarIcon} name="business-sharp" />
            </View>
            
            {/* Información de contacto */}
            <View style={styles.infoSection}>
                {campusPhone && (
                    <Pressable onPress={phoneHandler} style={styles.infoCard}>
                        <View style={styles.infoContent}>
                            <View style={styles.iconContainer}>
                                <Ionicons name="call" size={24} color={GlobalStyles.primary500 || '#007AFF'} />
                            </View>
                            <View style={styles.infoTextContainer}>
                                <Text style={styles.infoLabel}>Teléfono</Text>
                                <Text style={styles.infoValue}>{campusPhone}</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#ccc" />
                        </View>
                    </Pressable>
                )}
                
                {campusMap && (
                    <Pressable onPress={mapHandler} style={styles.infoCard}>
                        <View style={styles.infoContent}>
                            <View style={styles.iconContainer}>
                                <Ionicons name="location" size={24} color={GlobalStyles.primary500 || '#007AFF'} />
                            </View>
                            <View style={styles.infoTextContainer}>
                                <Text style={styles.infoLabel}>Ubicación</Text>
                                <Text style={styles.infoValue} numberOfLines={2}>Ver en el mapa</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#ccc" />
                        </View>
                    </Pressable>
                )}
                
                {!campusPhone && !campusMap && (
                    <View style={styles.emptyState}>
                        <Ionicons name="information-circle-outline" size={48} color="#ccc" />
                        <Text style={styles.emptyTitle}>Información no disponible</Text>
                        <Text style={styles.emptyMessage}>
                            La información de contacto de la sede no está disponible en este momento.
                        </Text>
                    </View>
                )}
            </View>
        </ScrollView>
    )
}

export default Sede;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    imageContainer: {
        position: 'relative',
    },
    image: {
        width: '100%',
        height: 200,
        backgroundColor: '#f0f0f0',
    },
    gradientImage: {
        width: '100%',
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
    },
    gradientTitle: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 8,
    },
    details: {
        flexDirection: 'row',
        width: '100%',
        backgroundColor: 'white',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e1e5e9',
    },
    titleContainer: {
        flex: 1,
    },
    eventName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 2,
    },
    eventSubtitle: {
        fontSize: 14,
        color: '#666',
    },
    calendarIcon: {
        fontSize: 28,
        color: GlobalStyles.primary500 || '#007AFF',
    },
    infoSection: {
        padding: 16,
    },
    infoCard: {
        backgroundColor: 'white',
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    infoContent: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: (GlobalStyles.primary50 || '#E3F2FD'),
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    infoTextContainer: {
        flex: 1,
    },
    infoLabel: {
        fontSize: 12,
        color: '#666',
        marginBottom: 2,
    },
    infoValue: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 40,
        paddingHorizontal: 20,
    },
    emptyTitle: {
        fontSize: 18,
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
    },
})