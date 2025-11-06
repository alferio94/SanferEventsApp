import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { GlobalStyles } from "../../../constants/styles";

const SurveyCard = ({ survey, onPress, isCompleted }) => {
  const getTypeIcon = () => {
    return survey.type === "entry" ? "log-in-outline" : "log-out-outline";
  };

  const getTypeLabel = () => {
    return survey.type === "entry" ? "Entrada" : "Salida";
  };

  const getTypeColor = () => {
    return survey.type === "entry" ? "#27ae60" : "#e67e22";
  };

  return (
    <TouchableOpacity
      style={[styles.card, !survey.isActive && styles.cardInactive]}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={!survey.isActive}
    >
      <View style={styles.cardContent}>
        {/* Icon and Type Badge */}
        <View style={styles.headerRow}>
          <View style={[styles.typeBadge, { backgroundColor: getTypeColor() }]}>
            <Ionicons name={getTypeIcon()} size={16} color="white" />
            <Text style={styles.typeText}>{getTypeLabel()}</Text>
          </View>
          {isCompleted && (
            <View style={styles.completedBadge}>
              <Ionicons name="checkmark-circle" size={16} color="#27ae60" />
              <Text style={styles.completedText}>Completada</Text>
            </View>
          )}
        </View>

        {/* Title */}
        <Text style={styles.title}>{survey.title}</Text>

        {/* Description */}
        {survey.description && (
          <Text style={styles.description} numberOfLines={2}>
            {survey.description}
          </Text>
        )}

        {/* Footer Info */}
        <View style={styles.footer}>
          <View style={styles.footerItem}>
            <Ionicons name="help-circle-outline" size={16} color="#666" />
            <Text style={styles.footerText}>
              {survey.questions?.length || 0} preguntas
            </Text>
          </View>
          {!survey.isActive && (
            <View style={styles.inactiveBadge}>
              <Text style={styles.inactiveText}>Inactiva</Text>
            </View>
          )}
          {!isCompleted && survey.isActive && (
            <Ionicons
              name="chevron-forward"
              size={20}
              color={GlobalStyles.primary500}
            />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default SurveyCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    borderLeftWidth: 4,
    borderLeftColor: GlobalStyles.primary500,
  },
  cardInactive: {
    opacity: 0.6,
    borderLeftColor: "#999",
  },
  cardContent: {
    padding: 16,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },
  typeBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  typeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  completedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#d4edda",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  completedText: {
    color: "#27ae60",
    fontSize: 12,
    fontWeight: "600",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 12,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  footerItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  footerText: {
    fontSize: 13,
    color: "#666",
  },
  inactiveBadge: {
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  inactiveText: {
    color: "#999",
    fontSize: 12,
    fontWeight: "600",
  },
});
