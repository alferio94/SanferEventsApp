import { useLayoutEffect, useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  View,
  Platform,
  Linking,
  Pressable,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getHotel } from "../../util/http";
import { GlobalStyles } from "../../constants/styles";

const HotelDetails = ({ route }) => {
  const eventId = route.params.eventId;
  const [hotel, setHotel] = useState();
  useLayoutEffect(() => {
    getHotelDetails();
  }, []);
  function phoneHandler() {
    const phoneUrl = `tel:${hotel.phone}`;
    Linking.openURL(phoneUrl);
  }
  function mapHandler() {
    Linking.openURL(hotel.mapUrl);
  }
  async function getHotelDetails() {
    try {
      const hotelDetails = await getHotel(eventId);
      hotelDetails && setHotel(hotelDetails);
    } catch (error) {}
  }
  if (!hotel) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="bed-outline" size={64} color="#ccc" />
        <Text style={styles.errorTitle}>Hotel no asignado aún</Text>
      </View>
    );
  }
  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: `${hotel.photoUrl}` }} style={styles.image} />
      </View>

      <View style={styles.details}>
        <View style={styles.titleContainer}>
          <Text style={styles.eventName}>{hotel.name}</Text>
          <Text style={styles.eventSubtitle}>Información del hotel</Text>
        </View>
        <Ionicons style={styles.calendarIcon} name="bed-sharp" />
      </View>

      <View style={styles.infoSection}>
        {hotel.phone && (
          <Pressable onPress={phoneHandler} style={styles.infoCard}>
            <View style={styles.infoContent}>
              <View style={styles.iconContainer}>
                <Ionicons name="call" size={24} color={GlobalStyles.primary500 || '#007AFF'} />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Teléfono</Text>
                <Text style={styles.infoValue}>{hotel.phone}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </View>
          </Pressable>
        )}

        {hotel.address && (
          <Pressable onPress={mapHandler} style={styles.infoCard}>
            <View style={styles.infoContent}>
              <View style={styles.iconContainer}>
                <Ionicons name="location" size={24} color={GlobalStyles.primary500 || '#007AFF'} />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Dirección</Text>
                <Text style={styles.infoValue} numberOfLines={2}>{hotel.address}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </View>
          </Pressable>
        )}
      </View>
    </ScrollView>
  );
};

export default HotelDetails;

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
});
