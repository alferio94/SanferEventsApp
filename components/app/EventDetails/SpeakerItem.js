import { View, Text, StyleSheet, Image } from "react-native";
import { GlobalStyles } from "../../../constants/styles";
import { Ionicons } from "@expo/vector-icons";

const SpeakerItem = ({ item }) => {
  return (
    <View style={styles.speakerCard}>
      <View style={styles.imageContainer}>
        {item.photoUrl ? (
          <Image source={{ uri: item.photoUrl }} style={styles.speakerImage} />
        ) : (
          <View style={styles.placeholderImage}>
            <Ionicons name="person" size={32} color="#666" />
          </View>
        )}
      </View>

      <View style={styles.speakerInfo}>
        <Text style={styles.speakerName}>{item.name || item.nombre}</Text>
        <Text style={styles.speakerPresentation}>
          {item.presentation || item.ponencia}
        </Text>
        {item.specialty && (
          <Text style={styles.speakerSpecialty}>{item.specialty}</Text>
        )}
      </View>
    </View>
  );
};

export default SpeakerItem;

const styles = StyleSheet.create({
  speakerCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  imageContainer: {
    marginRight: 16,
  },
  speakerImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#f0f0f0",
  },
  placeholderImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: GlobalStyles.primary50 || "#E3F2FD",
    justifyContent: "center",
    alignItems: "center",
  },
  speakerInfo: {
    flex: 1,
    paddingRight: 12,
  },
  speakerName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  speakerPresentation: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
    lineHeight: 20,
  },
  speakerSpecialty: {
    fontSize: 12,
    color: GlobalStyles.primary500 || "#007AFF",
    fontWeight: "500",
  },
  speakerIcon: {
    justifyContent: "center",
    alignItems: "center",
  },
});

