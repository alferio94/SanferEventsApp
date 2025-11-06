import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Switch,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { GlobalStyles } from "../../../constants/styles";

const QuestionInput = ({ question, value, onChange, error }) => {
  const renderInput = () => {
    switch (question.questionType) {
      case "text":
        return (
          <TextInput
            style={[styles.textInput, error && styles.inputError]}
            placeholder="Escribe tu respuesta aquí..."
            multiline
            numberOfLines={4}
            value={value?.answerValue || ""}
            onChangeText={(text) => onChange({ answerValue: text })}
            textAlignVertical="top"
          />
        );

      case "multiple_choice":
        return (
          <View style={styles.optionsContainer}>
            {question.options?.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionButton,
                  value?.selectedOption === option && styles.optionSelected,
                  error && !value?.selectedOption && styles.inputError,
                ]}
                onPress={() => onChange({ selectedOption: option })}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.radioOuter,
                    value?.selectedOption === option && styles.radioSelected,
                  ]}
                >
                  {value?.selectedOption === option && (
                    <View style={styles.radioInner} />
                  )}
                </View>
                <Text
                  style={[
                    styles.optionText,
                    value?.selectedOption === option && styles.optionTextSelected,
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        );

      case "rating":
        return (
          <View>
            <View style={styles.ratingContainer}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => (
                <TouchableOpacity
                  key={rating}
                  style={[
                    styles.ratingButton,
                    value?.ratingValue === rating && styles.ratingSelected,
                    error && !value?.ratingValue && styles.inputError,
                  ]}
                  onPress={() => onChange({ ratingValue: rating })}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.ratingText,
                      value?.ratingValue === rating && styles.ratingTextSelected,
                    ]}
                  >
                    {rating}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.ratingLabels}>
              <Text style={styles.ratingLabel}>Bajo</Text>
              <Text style={styles.ratingLabel}>Alto</Text>
            </View>
          </View>
        );

      case "boolean":
        return (
          <View style={styles.booleanContainer}>
            <TouchableOpacity
              style={[
                styles.booleanButton,
                value?.booleanValue === true && styles.booleanSelected,
                error && value?.booleanValue === undefined && styles.inputError,
              ]}
              onPress={() => onChange({ booleanValue: true })}
              activeOpacity={0.7}
            >
              <Ionicons
                name="checkmark-circle"
                size={24}
                color={
                  value?.booleanValue === true
                    ? "white"
                    : GlobalStyles.primary500
                }
              />
              <Text
                style={[
                  styles.booleanText,
                  value?.booleanValue === true && styles.booleanTextSelected,
                ]}
              >
                Sí
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.booleanButton,
                value?.booleanValue === false && styles.booleanSelected,
              ]}
              onPress={() => onChange({ booleanValue: false })}
              activeOpacity={0.7}
            >
              <Ionicons
                name="close-circle"
                size={24}
                color={
                  value?.booleanValue === false
                    ? "white"
                    : GlobalStyles.primary500
                }
              />
              <Text
                style={[
                  styles.booleanText,
                  value?.booleanValue === false && styles.booleanTextSelected,
                ]}
              >
                No
              </Text>
            </TouchableOpacity>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.questionHeader}>
        <Text style={styles.questionText}>
          {question.questionText}
          {question.isRequired && <Text style={styles.required}> *</Text>}
        </Text>
      </View>
      {renderInput()}
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

export default QuestionInput;

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  questionHeader: {
    marginBottom: 12,
  },
  questionText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    lineHeight: 22,
  },
  required: {
    color: "#e74c3c",
  },
  // Text Input
  textInput: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    color: "#333",
    minHeight: 100,
  },
  // Multiple Choice
  optionsContainer: {
    gap: 10,
  },
  optionButton: {
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
  },
  optionSelected: {
    borderColor: GlobalStyles.primary500,
    backgroundColor: "#f0f8ff",
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#ddd",
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  radioSelected: {
    borderColor: GlobalStyles.primary500,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: GlobalStyles.primary500,
  },
  optionText: {
    fontSize: 15,
    color: "#333",
    flex: 1,
  },
  optionTextSelected: {
    color: GlobalStyles.primary500,
    fontWeight: "600",
  },
  // Rating
  ratingContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "center",
  },
  ratingButton: {
    width: 44,
    height: 44,
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "#ddd",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  ratingSelected: {
    backgroundColor: GlobalStyles.primary500,
    borderColor: GlobalStyles.primary500,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
  ratingTextSelected: {
    color: "white",
  },
  ratingLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    paddingHorizontal: 4,
  },
  ratingLabel: {
    fontSize: 12,
    color: "#999",
  },
  // Boolean
  booleanContainer: {
    flexDirection: "row",
    gap: 12,
  },
  booleanButton: {
    flex: 1,
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  booleanSelected: {
    backgroundColor: GlobalStyles.primary500,
    borderColor: GlobalStyles.primary500,
  },
  booleanText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  booleanTextSelected: {
    color: "white",
  },
  // Error
  inputError: {
    borderColor: "#e74c3c",
  },
  errorText: {
    color: "#e74c3c",
    fontSize: 12,
    marginTop: 6,
  },
});
