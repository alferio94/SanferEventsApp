import { View, Text, StyleSheet, TouchableOpacity, Linking, Alert } from "react-native";
import { GlobalStyles } from "../../../constants/styles";
import { Ionicons } from '@expo/vector-icons';

const TransportItem = ({ item }) => {
  
  const getTransportIcon = (type) => {
    switch (type) {
      case 'airplane':
        return 'airplane';
      case 'bus':
        return 'bus';
      case 'train':
        return 'train';
      case 'van':
        return 'car-sport';
      case 'boat':
        return 'boat';
      default:
        return 'car';
    }
  };

  const getTransportTypeText = (type) => {
    switch (type) {
      case 'airplane':
        return 'Avión';
      case 'bus':
        return 'Autobús';
      case 'train':
        return 'Tren';
      case 'van':
        return 'Van';
      case 'boat':
        return 'Barco';
      default:
        return 'Transporte';
    }
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleString('es-ES', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleMapPress = () => {
    if (item.mapUrl) {
      Linking.openURL(item.mapUrl).catch(err => {
        console.error('Error opening map:', err);
        Alert.alert('Error', 'No se pudo abrir el mapa');
      });
    }
  };

  return (
    <View style={styles.transportCard}>
      <View style={styles.cardContent}>
        {/* Icono y tipo de transporte */}
        <View style={styles.transportHeader}>
          <View style={styles.iconContainer}>
            <Ionicons 
              name={getTransportIcon(item.type)} 
              size={24} 
              color={GlobalStyles.primary500 || '#007AFF'} 
            />
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.transportName}>{item.name}</Text>
            <Text style={styles.transportType}>{getTransportTypeText(item.type)}</Text>
          </View>
        </View>

        {/* Hora de salida */}
        <View style={styles.timeContainer}>
          <Ionicons name="time-outline" size={16} color="#666" />
          <Text style={styles.timeText}>
            Salida: {formatTime(item.departureTime)}
          </Text>
        </View>

        {/* Detalles */}
        {item.details && (
          <View style={styles.detailsContainer}>
            <Text style={styles.detailsText}>{item.details}</Text>
          </View>
        )}

        {/* Botón de mapa si existe */}
        {item.mapUrl && (
          <TouchableOpacity 
            style={styles.mapButton} 
            onPress={handleMapPress}
            activeOpacity={0.7}
          >
            <Ionicons name="location" size={16} color="white" />
            <Text style={styles.mapButtonText}>Ver ubicación</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default TransportItem;

const styles = StyleSheet.create({
  transportCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardContent: {
    padding: 16,
  },
  transportHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: (GlobalStyles.primary50 || '#E3F2FD'),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  transportName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  transportType: {
    fontSize: 12,
    color: GlobalStyles.primary500 || '#007AFF',
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  timeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginLeft: 8,
  },
  detailsContainer: {
    marginBottom: 12,
  },
  detailsText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: GlobalStyles.primary500 || '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  mapButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
});