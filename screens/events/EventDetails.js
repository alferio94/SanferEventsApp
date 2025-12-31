import { useContext, useLayoutEffect } from "react";
import {
  Image,
  StyleSheet,
  Text,
  View,
  Platform,
  ScrollView,
} from "react-native";
import { AuthContext } from "../../context/AuthContext";
import { URL } from "../../constants/url";
import { Ionicons } from "@expo/vector-icons";
import IconButton from "../../components/ui/IconButton";

const EventDetails = ({ route, navigation }) => {
  const { events } = useContext(AuthContext);
  const eventId = route.params.eventId;
  const eventSelected = events.find((event) => event.id === eventId);

  function clickHandler(destination) {
    navigation.navigate(destination, { eventId: eventId });
  }

  if (!eventSelected) {
    return (
      <View style={styles.container}>
        <Text>Evento no encontrado</Text>
      </View>
    );
  }

  // Obtener configuración del menú (con valores por defecto si no existe)
  const appMenu = eventSelected.appMenu || {
    agenda: true,
    ponentes: true,
    sede: true,
    transporte: true,
    hotel: true,
    alimentos: true,
    atencionMedica: true,
    encuestas: true,
    codigoVestimenta: true,
  };

  // Función para renderizar botones condicionalmente
  const renderButton = (
    condition,
    icon,
    label,
    destination,
    onPress = null,
  ) => {
    if (!condition) return null;

    return (
      <IconButton
        key={label}
        icon={icon}
        label={label}
        onPress={onPress || clickHandler.bind(this, destination)}
      />
    );
  };

  return (
    <View style={styles.containerMain}>
      <Image
        source={{
          uri: eventSelected.banner || `${URL}${eventSelected.banner}`,
        }}
        style={styles.image}
      />
      <View style={styles.details}>
        <View>
          <Text style={styles.eventName}>
            {eventSelected.name || eventSelected.nombre}
          </Text>
          <Text style={styles.eventDate}>
            {eventSelected.startDate
              ? new Date(eventSelected.startDate).toLocaleDateString()
              : eventSelected.fecha_inicio?.slice(0, 10)}
          </Text>
        </View>
        <Ionicons style={styles.calendarIcon} name="calendar" />
      </View>

      <ScrollView>
        <View style={styles.iconContainer}>
          {/* Renderizar botones basado en configuración del appMenu */}
          {renderButton(appMenu.agenda, "today", "Agenda", "groupSelector")}
          {renderButton(
            appMenu.ponentes,
            "easel-sharp",
            "Ponentes",
            "speakers",
          )}
          {renderButton(appMenu.sede, "business-sharp", "Sede", "sedeDetails")}
          {renderButton(
            appMenu.transporte,
            "airplane-sharp",
            "Transporte",
            "groupSelector",
            () => {
              navigation.navigate("groupSelector", {
                eventId: eventId,
                mode: "transport",
              });
            },
          )}
          {renderButton(appMenu.hotel, "bed-sharp", "Hotel", "hotel")}
          {/* {renderButton(appMenu.alimentos, 'restaurant-sharp', 'Alimentos', 'foodInfo')} */}
          {/* {renderButton(appMenu.codigoVestimenta, 'shirt-sharp', 'Código de Vestimenta', 'dressCode')} */}
          {/* {renderButton(appMenu.atencionMedica, 'medkit', 'Atención Médica', 'health')} */}
          {renderButton(
            appMenu.encuestas,
            "clipboard-sharp",
            "Encuestas",
            "groupSelector",
            () => {
              navigation.navigate("groupSelector", {
                eventId: eventId,
                mode: "survey",
              });
            },
          )}

          {/* Botón de Información General siempre visible */}
          <IconButton
            icon="information-circle-sharp"
            label="Información General"
            onPress={clickHandler.bind(this, "generalInfo")}
          />
        </View>

        {/* Mostrar información sobre secciones deshabilitadas (solo en desarrollo) */}
        {__DEV__ && (
          <View style={styles.debugContainer}>
            <Text style={styles.debugTitle}>Configuración del menú:</Text>
            {Object.entries(appMenu).map(([key, value]) => (
              <Text
                key={key}
                style={[
                  styles.debugText,
                  { color: value ? "#4CAF50" : "#F44336" },
                ]}
              >
                {key}: {value ? "✓" : "✗"}
              </Text>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default EventDetails;

const styles = StyleSheet.create({
  containerMain: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  imageContainer: {},
  image: {
    width: "100%",
    height: 200,
  },
  details: {
    flexDirection: "row",
    width: "100%",
    backgroundColor: "#DDD6D6",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 10,
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    overflow: Platform.OS === "android" ? "hidden" : "visible",
  },
  eventName: {
    fontSize: 20,
    fontWeight: "bold",
  },
  eventDate: {
    fontSize: 12,
    color: "#8A8A8A",
    fontWeight: "bold",
  },
  calendarIcon: {
    fontSize: 24,
  },
  iconContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingVertical: 20,
    paddingHorizontal: 10,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  debugContainer: {
    margin: 20,
    padding: 15,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  debugTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  debugText: {
    fontSize: 12,
    marginVertical: 2,
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
  },
});
