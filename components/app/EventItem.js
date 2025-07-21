import {
  Pressable,
  Text,
  View,
  Image,
  StyleSheet,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from '@expo/vector-icons';
import { GlobalStyles } from "../../constants/styles";
import { URL } from "../../constants/url";
import { useNavigation } from "@react-navigation/native";

const EventItem = ({ id, banner, nombre, name, startDate, endDate, campus, sede }) => {
  const navigation = useNavigation();
  
  // Usar las propiedades del nuevo backend si están disponibles, sino usar las del anterior
  const eventName = name || nombre;
  const eventVenue = campus || sede;
  const eventBanner = banner;
  
  function pressHandler() {
    navigation.navigate("eventDetails", { eventId: id });
  }

  function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  function formatTime(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  return (
    <View style={styles.eventItem}>
      <Pressable
        android_ripple={{ color: "#ccc" }}
        style={({ pressed }) => [pressed && styles.buttonPressed]}
        onPress={pressHandler}
      >
        <View style={styles.innerContainer}>
          {/* Banner o Gradiente */}
          <View style={styles.bannerContainer}>
            {eventBanner ? (
              <Image 
                source={{ uri: eventBanner.startsWith('http') ? eventBanner : `${URL}${eventBanner}` }} 
                style={styles.image} 
              />
            ) : (
              <LinearGradient
                colors={['#ef3b42', '#ed353c']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradientBanner}
              >
                <Text style={styles.gradientTitle}>{eventName}</Text>
              </LinearGradient>
            )}
          </View>

          {/* Información del evento */}
          <View style={styles.infoContainer}>
            {/* Título (solo si hay banner) */}
            {eventBanner && (
              <Text style={[styles.textBase, styles.title]}>{eventName}</Text>
            )}

            {/* Fechas */}
            <View style={styles.dateContainer}>
              <View style={styles.dateRow}>
                <Ionicons name="calendar" size={16} color={GlobalStyles.primary500} />
                <Text style={styles.dateLabel}>Inicio:</Text>
                <Text style={styles.dateText}>
                  {formatDate(startDate)} {formatTime(startDate)}
                </Text>
              </View>
              
              {endDate && (
                <View style={styles.dateRow}>
                  <Ionicons name="calendar-outline" size={16} color={GlobalStyles.primary500} />
                  <Text style={styles.dateLabel}>Fin:</Text>
                  <Text style={styles.dateText}>
                    {formatDate(endDate)} {formatTime(endDate)}
                  </Text>
                </View>
              )}
            </View>

            {/* Sede */}
            {eventVenue && (
              <View style={styles.venueContainer}>
                <Ionicons name="location" size={16} color={GlobalStyles.primary500} />
                <Text style={styles.venueText}>{eventVenue}</Text>
              </View>
            )}
          </View>
        </View>
      </Pressable>
    </View>
  );
};

export default EventItem;

const styles = StyleSheet.create({
  eventItem: {
    margin: 14,
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    overflow: Platform.OS === "android" ? "hidden" : "visible",
  },
  innerContainer: {
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  bannerContainer: {
    width: "100%",
    height: 200,
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: 'cover',
  },
  gradientBanner: {
    width: "100%",
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  gradientTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  infoContainer: {
    padding: 16,
  },
  textBase: {
    paddingHorizontal: 0,
  },
  title: {
    fontWeight: "bold",
    textAlign: "left",
    fontSize: 20,
    marginBottom: 12,
    color: GlobalStyles.textPrimary || "#333",
  },
  dateContainer: {
    marginBottom: 12,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  dateLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: GlobalStyles.textPrimary || "#333",
    marginLeft: 8,
    marginRight: 6,
  },
  dateText: {
    fontSize: 14,
    color: GlobalStyles.textSecondary || "#666",
    flex: 1,
  },
  venueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: GlobalStyles.primary500 || '#007AFF',
  },
  venueText: {
    fontSize: 14,
    fontWeight: '500',
    color: GlobalStyles.textPrimary || "#333",
    marginLeft: 8,
    flex: 1,
  },
  buttonPressed: {
    opacity: 0.75,
  },
});

