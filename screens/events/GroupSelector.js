import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { GlobalStyles } from "../../constants/styles";
import { AuthContext } from "../../context/AuthContext";
import { getUserAssignments } from "../../util/http";
import LoadingOverlay from "../../components/ui/LoadingOverlay";

const GroupSelector = ({ route, navigation }) => {
  const { eventId, mode = "agenda" } = route.params;
  const { user, events } = useContext(AuthContext);
  const [userGroups, setUserGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState(null);

  // Obtener información del evento
  const eventSelected = events.find((event) => event.id === eventId);

  useEffect(() => {
    fetchUserGroups();
  }, []);

  const fetchUserGroups = async () => {
    try {
      setLoading(true);

      if (!user || !user.id) {
        Alert.alert("Error", "No se pudo obtener información del usuario");
        return;
      }

      const assignments = await getUserAssignments(eventId, user.id);

      if (assignments && assignments[0].groups) {
        setUserGroups(assignments[0].groups);
      } else {
        // Fallback: usar grupos del evento cargado
        if (eventSelected && eventSelected.groups) {
          setUserGroups(eventSelected.groups);
        } else {
          setUserGroups([]);
        }
      }
    } catch (error) {
      Alert.alert("Error", "No se pudieron cargar los grupos del usuario");
      setUserGroups([]);
    } finally {
      setLoading(false);
    }
  };

  const handleGroupPress = (group) => {
    setSelectedGroup(group);

    // Navegar según el modo
    let destination = "agenda";
    if (mode === "transport") {
      destination = "transport";
    } else if (mode === "survey") {
      destination = "surveyList";
    }

    navigation.navigate(destination, {
      eventId: eventId,
      groupId: group.id,
      groupName: group.name,
      eventName: eventSelected?.name || eventSelected?.nombre,
      mode: mode,
    });
  };

  const renderGroupCard = (group) => {
    const isSelected = selectedGroup?.id === group.id;

    return (
      <TouchableOpacity
        key={group.id}
        style={[
          styles.groupCard,
          isSelected && styles.groupCardSelected,
          { borderLeftColor: group.color || GlobalStyles.primary500 },
        ]}
        onPress={() => handleGroupPress(group)}
        activeOpacity={0.7}
      >
        <View style={styles.groupCardContent}>
          <View style={styles.groupInfo}>
            <View
              style={[
                styles.groupColorIndicator,
                { backgroundColor: group.color || GlobalStyles.primary500 },
              ]}
            />
            <View style={styles.groupTextContainer}>
              <Text
                style={[
                  styles.groupName,
                  isSelected && styles.groupNameSelected,
                ]}
              >
                {group.name}
              </Text>
              <Text style={styles.groupDescription}>
                {mode === "transport"
                  ? "Toca para ver los transportes de este grupo"
                  : mode === "survey"
                  ? "Toca para ver las encuestas de este grupo"
                  : "Toca para ver la agenda de este grupo"}
              </Text>
            </View>
          </View>
          <Ionicons
            name="chevron-forward"
            size={24}
            color={isSelected ? GlobalStyles.primary500 : "#666"}
          />
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return <LoadingOverlay />;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Selecciona un Grupo</Text>
        <Text style={styles.subtitle}>
          {eventSelected?.name || eventSelected?.nombre}
        </Text>
        <Text style={styles.description}>
          {mode === "transport"
            ? "Selecciona el grupo para ver sus opciones de transporte"
            : mode === "survey"
            ? "Selecciona el grupo para ver sus encuestas disponibles"
            : "Selecciona el grupo para ver su agenda específica"}
        </Text>
      </View>

      {/* Groups List */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {userGroups.length === 0 ? (
          <View style={styles.noGroupsContainer}>
            <Ionicons name="people-outline" size={64} color="#ccc" />
            <Text style={styles.noGroupsTitle}>Sin grupos asignados</Text>
            <Text style={styles.noGroupsDescription}>
              No tienes grupos asignados para este evento.{"\n"}
              Contacta al organizador para más información.
            </Text>
            <TouchableOpacity
              style={styles.refreshButton}
              onPress={fetchUserGroups}
            >
              <Ionicons name="refresh" size={20} color="white" />
              <Text style={styles.refreshButtonText}>Reintentar</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.groupsList}>
            <Text style={styles.groupsTitle}>
              Tus grupos ({userGroups.length})
            </Text>
            {userGroups.map(renderGroupCard)}
          </View>
        )}
      </ScrollView>

      {/* Footer Info */}
      <View style={styles.footer}>
        <View style={styles.footerInfo}>
          <Ionicons name="information-circle-outline" size={16} color="#666" />
          <Text style={styles.footerText}>
            {mode === "transport"
              ? "Solo verás los transportes asignados a cada grupo"
              : mode === "survey"
              ? "Solo verás las encuestas asignadas a cada grupo"
              : "Solo verás los eventos asignados a cada grupo"}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    backgroundColor: "white",
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e1e5e9",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: GlobalStyles.primary500 || "#007AFF",
    fontWeight: "600",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  scrollView: {
    flex: 1,
  },
  groupsList: {
    padding: 20,
  },
  groupsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
  },
  groupCard: {
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  groupCardSelected: {
    borderColor: GlobalStyles.primary500 || "#007AFF",
    backgroundColor: "#f0f8ff",
  },
  groupCardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  groupInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  groupColorIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  groupTextContainer: {
    flex: 1,
  },
  groupName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  groupNameSelected: {
    color: GlobalStyles.primary500 || "#007AFF",
  },
  groupDescription: {
    fontSize: 12,
    color: "#666",
  },
  noGroupsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  noGroupsTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginTop: 16,
    marginBottom: 8,
  },
  noGroupsDescription: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  refreshButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: GlobalStyles.primary500 || "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  refreshButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },
  footer: {
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#e1e5e9",
  },
  footerInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  footerText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 6,
  },
});

export default GroupSelector;

