import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useContext, useLayoutEffect, useState, useEffect } from "react";
import { getTransportsByGroup } from "../../util/http";
import { AuthContext } from "../../context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import LoadingOverlay from "../../components/ui/LoadingOverlay";
import TransportItem from "../../components/app/EventDetails/TransportItem";
import { GlobalStyles } from "../../constants/styles";

const Transport = ({ route, navigation }) => {
  const { eventId, groupId, groupName, eventName } = route.params;
  const { events } = useContext(AuthContext);
  const [transports, setTransports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Obtener información del evento
  const eventSelected = events.find((event) => event.id === eventId);

  useEffect(() => {
    if (groupId) {
      getTransportsData();
    }
  }, [groupId]);

  // Configurar el título de la pantalla
  useLayoutEffect(() => {
    navigation.setOptions({
      title: `Transportes - ${groupName}`,
      headerBackTitle: "Grupos",
    });
  }, [groupName]);

  async function getTransportsData() {
    try {
      setLoading(true);
      setError(null);

      const data = await getTransportsByGroup(groupId);

      if (data && data.length > 0) {
        // Ordenar transportes por fecha de salida
        const sortedTransports = data.sort((a, b) => 
          new Date(a.departureTime) - new Date(b.departureTime)
        );
        setTransports(sortedTransports);
      } else {
        setTransports([]);
        setError("No hay opciones de transporte para este grupo");
      }
    } catch (error) {
      setError("Error al cargar las opciones de transporte");
      setTransports([]);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <LoadingOverlay />;
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="bus-outline" size={64} color="#ccc" />
        <Text style={styles.errorTitle}>Sin transportes</Text>
        <Text style={styles.errorMessage}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={getTransportsData}>
          <Ionicons name="refresh" size={20} color="white" />
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {transports.length > 0 ? (
        <>
          {/* Header informativo */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Opciones de Transporte</Text>
            <Text style={styles.headerSubtitle}>
              {transports.length} {transports.length === 1 ? 'opción disponible' : 'opciones disponibles'}
            </Text>
            <Text style={styles.headerDescription}>
              Transportes disponibles para el grupo {groupName}
            </Text>
          </View>

          {/* Lista de transportes */}
          <FlatList
            data={transports}
            renderItem={({ item }) => <TransportItem item={item} />}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
          />
        </>
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="bus-outline" size={64} color="#ccc" />
          <Text style={styles.emptyTitle}>Sin transportes disponibles</Text>
          <Text style={styles.emptyMessage}>
            No hay opciones de transporte configuradas para este grupo en este momento.
          </Text>
        </View>
      )}
    </View>
  );
};

export default Transport;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    backgroundColor: "white",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e1e5e9",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: GlobalStyles.primary500 || "#007AFF",
    fontWeight: "500",
    marginBottom: 6,
  },
  headerDescription: {
    fontSize: 12,
    color: "#666",
  },
  listContainer: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
    backgroundColor: "#f8f9fa",
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginTop: 16,
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
  },
  retryButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: GlobalStyles.primary500 || "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },
});