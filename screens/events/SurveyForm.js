import React, { useState, useEffect, useContext, useLayoutEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { GlobalStyles } from "../../constants/styles";
import { AuthContext } from "../../context/AuthContext";
import {
  getSurveyWithQuestions,
  submitSurveyResponse,
} from "../../util/http";
import LoadingOverlay from "../../components/ui/LoadingOverlay";
import QuestionInput from "../../components/app/Survey/QuestionInput";

const SurveyForm = ({ route, navigation }) => {
  const { surveyId, surveyTitle, eventId, groupId, groupName } = route.params;
  const { user } = useContext(AuthContext);
  const [survey, setSurvey] = useState(null);
  const [answers, setAnswers] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadSurvey();
  }, [surveyId]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: surveyTitle || "Encuesta",
      headerBackTitle: "Encuestas",
    });
  }, [surveyTitle]);

  const loadSurvey = async () => {
    try {
      setLoading(true);
      const surveyData = await getSurveyWithQuestions(surveyId);

      if (surveyData && surveyData.questions) {
        // Ordenar preguntas por orden
        surveyData.questions.sort((a, b) => a.order - b.order);
        setSurvey(surveyData);
      } else {
        Alert.alert("Error", "No se pudo cargar la encuesta", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo cargar la encuesta", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: { questionId, ...value },
    }));
    // Limpiar error si existe
    if (errors[questionId]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[questionId];
        return newErrors;
      });
    }
  };

  const validateAnswers = () => {
    const newErrors = {};
    let isValid = true;

    survey.questions.forEach((question) => {
      if (question.isRequired) {
        const answer = answers[question.id];

        if (!answer) {
          newErrors[question.id] = "Esta pregunta es obligatoria";
          isValid = false;
          return;
        }

        // Validar según tipo de pregunta
        switch (question.questionType) {
          case "text":
            if (!answer.answerValue || answer.answerValue.trim() === "") {
              newErrors[question.id] = "Esta pregunta es obligatoria";
              isValid = false;
            }
            break;
          case "multiple_choice":
            if (!answer.selectedOption) {
              newErrors[question.id] = "Debes seleccionar una opción";
              isValid = false;
            }
            break;
          case "rating":
            if (!answer.ratingValue) {
              newErrors[question.id] = "Debes seleccionar una calificación";
              isValid = false;
            }
            break;
          case "boolean":
            if (answer.booleanValue === undefined) {
              newErrors[question.id] = "Debes seleccionar una opción";
              isValid = false;
            }
            break;
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateAnswers()) {
      Alert.alert(
        "Campos incompletos",
        "Por favor completa todas las preguntas obligatorias"
      );
      return;
    }

    Alert.alert(
      "Enviar encuesta",
      "¿Estás seguro de que deseas enviar tus respuestas? No podrás modificarlas después.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Enviar",
          onPress: async () => {
            try {
              setSubmitting(true);

              // Convertir respuestas a formato del API
              const answersArray = Object.values(answers);

              const response = await submitSurveyResponse(
                surveyId,
                user.id,
                answersArray
              );

              if (response) {
                Alert.alert(
                  "¡Gracias!",
                  "Tu respuesta ha sido enviada exitosamente",
                  [
                    {
                      text: "OK",
                      onPress: () => {
                        // Navegar de regreso a la lista de encuestas
                        navigation.goBack();
                      },
                    },
                  ]
                );
              } else {
                Alert.alert("Error", "No se pudo enviar la encuesta");
              }
            } catch (error) {
              Alert.alert("Error", "No se pudo enviar la encuesta");
            } finally {
              setSubmitting(false);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return <LoadingOverlay />;
  }

  if (!survey) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={64} color="#ccc" />
        <Text style={styles.errorText}>No se pudo cargar la encuesta</Text>
      </View>
    );
  }

  const progress =
    (Object.keys(answers).length / survey.questions.length) * 100;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={100}
    >
      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressInfo}>
          <Text style={styles.progressText}>
            {Object.keys(answers).length} de {survey.questions.length} preguntas
            respondidas
          </Text>
          <Text style={styles.progressPercentage}>
            {Math.round(progress)}%
          </Text>
        </View>
        <View style={styles.progressBarBackground}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${Math.min(progress, 100)}%` },
            ]}
          />
        </View>
      </View>

      {/* Survey Description */}
      {survey.description && (
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionText}>{survey.description}</Text>
        </View>
      )}

      {/* Questions */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {survey.questions.map((question, index) => (
          <View key={question.id} style={styles.questionContainer}>
            <View style={styles.questionNumber}>
              <Text style={styles.questionNumberText}>{index + 1}</Text>
            </View>
            <View style={styles.questionContent}>
              <QuestionInput
                question={question}
                value={answers[question.id]}
                onChange={(value) => handleAnswerChange(question.id, value)}
                error={errors[question.id]}
              />
            </View>
          </View>
        ))}

        {/* Submit Button */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            submitting && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={submitting}
          activeOpacity={0.7}
        >
          {submitting ? (
            <Text style={styles.submitButtonText}>Enviando...</Text>
          ) : (
            <>
              <Ionicons name="checkmark-circle" size={24} color="white" />
              <Text style={styles.submitButtonText}>Enviar Respuestas</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Required Note */}
        <View style={styles.noteContainer}>
          <Ionicons name="information-circle-outline" size={16} color="#666" />
          <Text style={styles.noteText}>
            Los campos marcados con * son obligatorios
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SurveyForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  progressContainer: {
    backgroundColor: "white",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e1e5e9",
  },
  progressInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  progressText: {
    fontSize: 13,
    color: "#666",
  },
  progressPercentage: {
    fontSize: 13,
    fontWeight: "700",
    color: GlobalStyles.primary500,
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: "#e1e5e9",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: GlobalStyles.primary500,
    borderRadius: 3,
  },
  descriptionContainer: {
    backgroundColor: "#e8f4f8",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#d1e7ef",
  },
  descriptionText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  questionContainer: {
    flexDirection: "row",
    marginBottom: 24,
  },
  questionNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: GlobalStyles.primary500,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    marginTop: 2,
  },
  questionNumberText: {
    color: "white",
    fontSize: 14,
    fontWeight: "700",
  },
  questionContent: {
    flex: 1,
  },
  submitButton: {
    backgroundColor: GlobalStyles.primary500,
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 24,
    marginBottom: 16,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
  noteContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginBottom: 16,
  },
  noteText: {
    fontSize: 12,
    color: "#666",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  errorText: {
    fontSize: 16,
    color: "#666",
    marginTop: 16,
    textAlign: "center",
  },
});
