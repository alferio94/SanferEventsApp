import { View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native";
import { GlobalStyles } from "../../../constants/styles";
import { useState } from "react";
import { WebView } from "react-native-webview";

const SurveyItem = ({ item }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const showModal = () => {
    setModalVisible(true);
  };

  const hideModal = () => {
    setModalVisible(false);
  };

  return (
    <>
      <TouchableOpacity style={styles.link} onPress={showModal}>
        <Text style={styles.linkText}>{item.name}</Text>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        visible={modalVisible}
        onRequestClose={hideModal} // permite cerrar el modal con botón de regreso
      >
        <View style={{ flex: 1, backgroundColor: "red", paddingTop: 60 }}>
          {/* Fondo blanco para mejor visibilidad */}
          <WebView
            source={{ uri: item.url }} // prueba otra URL si Google no carga
            style={{ flex: 1 }}
            startInLoadingState={true} // muestra un indicador de carga
          />
          <TouchableOpacity onPress={hideModal} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  );
};

export default SurveyItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: GlobalStyles.primary50,
  },
  link: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
    paddingHorizontal: 10,
    paddingVertical: 20,
    backgroundColor: GlobalStyles.primary50,
  },
  linkText: {
    color: GlobalStyles.textPrimary,
    fontSize: 20,
    fontWeight: "600",
    textAlign: "left",
  },
  closeButton: {
    paddingVertical: 30,
    backgroundColor: "red",
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
