import React, { useState, useEffect, useContext, useLayoutEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { GlobalStyles } from "../../constants/styles";
import { AuthContext } from "../../context/AuthContext";
import { getSurveysByGroup, checkSurveyCompleted } from "../../util/http";
import LoadingOverlay from "../../components/ui/LoadingOverlay";
import SurveyCard from "../../components/app/Survey/SurveyCard";

const SurveyList = ({ route, navigation }) => {
  const { eventId, groupId, groupName, eventName } = route.params;
  const { user } = useContext(AuthContext);
  const [surveys, setSurveys] = useState([]);
  const [completedSurveys, setCompletedSurveys] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (groupId) {
      loadSurveys();
    }
  }, [groupId]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: `Encuestas - ${groupName}`,
      headerBackTitle: "Grupos",
    });
  }, [groupName]);

  // Recargar estados de completado cuando la pantalla vuelve al foco
  useFocusEffect(
    useCallback(() => {
      if (surveys.length > 0 && user?.id) {
        checkCompletedStatus();
      }
    }, [surveys, user])
  );

  const checkCompletedStatus = async () => {
    if (user?.id && surveys.length > 0) {
      const completedStatus = {};
      await Promise.all(
        surveys.map(async (survey) => {
          const isCompleted = await checkSurveyCompleted(survey.id, user.id);
          completedStatus[survey.id] = isCompleted;
        })
      );
      setCompletedSurveys(completedStatus);
    }
  };

  const loadSurveys = async () => {
    try {
      setLoading(true);
      setError(null);

      // Cargar encuestas del grupo
      const surveysData = await getSurveysByGroup(groupId);

      if (surveysData && surveysData.length > 0) {
        setSurveys(surveysData);

        // Verificar cuáles encuestas ya fueron completadas
        if (user?.id) {
          const completedStatus = {};
          await Promise.all(
            surveysData.map(async (survey) => {
              const isCompleted = await checkSurveyCompleted(
                survey.id,
                user.id
              );
              completedStatus[survey.id] = isCompleted;
            })
          );
          setCompletedSurveys(completedStatus);
        }
      } else {
        setSurveys([]);
        setError("No hay encuestas disponibles para este grupo");
      }
    } catch (error) {
      setError("Error al cargar las encuestas");
      setSurveys([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSurveyPress = (survey) => {
    if (!survey.isActive) {
      Alert.alert("Encuesta inactiva", "Esta encuesta no está disponible.");
      return;
    }

    const isCompleted = completedSurveys[survey.id];

    if (isCompleted) {
      Alert.alert(
        "Encuesta completada",
        "Ya has completado esta encuesta.",
        [{ text: "OK" }]
      );
      return;
    }

    // Navegar a formulario de encuesta
    navigation.navigate("surveyForm", {
      surveyId: survey.id,
      surveyTitle: survey.title,
      eventId,
      groupId,
      groupName,
    });
  };

  if (loading) {
    return <LoadingOverlay />;
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="document-text-outline" size={64} color="#ccc" />
        <Text style={styles.errorTitle}>Sin encuestas</Text>
        <Text style={styles.errorMessage}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadSurveys}>
          <Ionicons name="refresh" size={20} color="white" />
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Encuestas Disponibles</Text>
        <Text style={styles.headerSubtitle}>
          {surveys.length} {surveys.length === 1 ? "encuesta" : "encuestas"}
        </Text>
        <Text style={styles.headerDescription}>
          Encuestas disponibles para el grupo {groupName}
        </Text>
      </View>

      {/* Surveys List */}
      <FlatList
        data={surveys}
        renderItem={({ item }) => (
          <SurveyCard
            survey={item}
            onPress={() => handleSurveyPress(item)}
            isCompleted={completedSurveys[item.id]}
          />
        )}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

export default SurveyList;

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
    color: GlobalStyles.primary500,
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
  listHeader: {
    marginBottom: 12,
  },
  listFooter: {
    marginTop: 24,
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
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
    backgroundColor: GlobalStyles.primary500,
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
