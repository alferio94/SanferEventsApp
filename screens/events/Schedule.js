import {
  Alert,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  ScrollView,
  Linking,
} from "react-native";
import { Agenda, LocaleConfig } from "react-native-calendars";
import { GlobalStyles } from "../../constants/styles";
import { useContext, useLayoutEffect, useState, useEffect } from "react";
import { getAgenda } from "../../util/http";
import { AuthContext } from "../../context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import LoadingOverlay from "../../components/ui/LoadingOverlay";
import RenderHtml from "react-native-render-html";
import { useWindowDimensions } from "react-native";

LocaleConfig.locales["es"] = {
  monthNames: [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ],
  monthNamesShort: [
    "Ene.",
    "Feb.",
    "Mar.",
    "Abr.",
    "May.",
    "Jun.",
    "Jul.",
    "Ago.",
    "Sept.",
    "Oct.",
    "Nov.",
    "Dic.",
  ],
  dayNames: [
    "Domingo",
    "Lunes",
    "Martes",
    "Miercoles",
    "Jueves",
    "Viernes",
    "Sabado",
  ],
  dayNamesShort: ["Dom.", "Lun.", "Mar.", "Mier.", "Jue.", "Vie.", "Sab."],
  today: "Hoy",
};
LocaleConfig.defaultLocale = "es";

const Schedule = ({ route, navigation }) => {
  const { eventId, groupId, groupName, eventName } = route.params;
  const { events } = useContext(AuthContext);
  const [schedule, setSchedule] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const { width } = useWindowDimensions();

  // Obtener información del evento
  const eventSelected = events.find((event) => event.id === eventId);
  const startDate = eventSelected?.startDate || eventSelected?.fecha_inicio;
  const endDate = eventSelected?.endDate || eventSelected?.fecha_cierre;

  useEffect(() => {
    if (eventId && groupId) {
      getSchedule();
    }
  }, [eventId, groupId]);

  // Configurar el título de la pantalla
  useLayoutEffect(() => {
    navigation.setOptions({
      title: `Agenda - ${groupName}`,
      headerBackTitle: "Grupos",
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            Alert.alert(
              "Información",
              `Mostrando agenda del grupo: ${groupName}\nEvento: ${eventName || eventSelected?.name || eventSelected?.nombre}`,
              [{ text: "OK" }],
            );
          }}
          style={{ marginRight: 10 }}
        >
          <Ionicons name="information-circle-outline" size={24} color="white" />
        </TouchableOpacity>
      ),
    });
  }, [groupName, eventName, eventSelected]);

  async function getSchedule() {
    try {
      setLoading(true);
      setError(null);

      const data = await getAgenda(eventId, groupId);

      if (data && Object.keys(data).length > 0) {
        setSchedule(data);
      } else {
        setSchedule({});
        setError("No hay actividades programadas para este grupo");
      }
    } catch (error) {
      setError("Error al cargar la agenda");
      setSchedule({});
    } finally {
      setLoading(false);
    }
  }

  // Función para abrir el modal con detalles del evento
  const openEventModal = (eventData) => {
    setSelectedEvent(eventData);
    setModalVisible(true);
  };

  // Función para cerrar el modal
  const closeEventModal = () => {
    setModalVisible(false);
    setSelectedEvent(null);
  };

  // Función para obtener el día actual en formato YYYY-MM-DD
  const getTodayDate = () => {
    return new Date().toISOString().split("T")[0];
  };

  const renderItem = (reservation) => {
    const formatTime = (dateString) => {
      return new Date(dateString).toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
      });
    };

    return (
      <TouchableOpacity
        style={[styles.item, { height: "auto", minHeight: 100 }]}
        onPress={() => openEventModal(reservation)}
        activeOpacity={0.7}
      >
        <View style={styles.itemContent}>
          <View style={styles.itemHeader}>
            <Text style={styles.itemTitle}>
              {reservation.name || reservation.nombre_actividad}
            </Text>
            <Ionicons
              name="calendar-outline"
              size={20}
              color={GlobalStyles.primary500}
            />
          </View>

          <View style={styles.itemDetails}>
            <View style={styles.timeContainer}>
              <Ionicons name="time-outline" size={16} color="#666" />
              <Text style={styles.timeText}>
                {formatTime(reservation.startDate)} -{" "}
                {formatTime(reservation.endDate)}
              </Text>
            </View>

            {reservation.location && (
              <View style={styles.locationContainer}>
                <Ionicons name="location-outline" size={16} color="#666" />
                <Text style={styles.locationText}>{reservation.location}</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyDate = () => {
    return (
      <View style={styles.emptyDate}>
        <Ionicons name="calendar-outline" size={32} color="#ccc" />
        <Text style={styles.emptyDateText}>
          No hay actividades programadas para este día
        </Text>
      </View>
    );
  };

  if (loading) {
    return <LoadingOverlay />;
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="calendar-outline" size={64} color="#ccc" />
        <Text style={styles.errorTitle}>Sin actividades</Text>
        <Text style={styles.errorMessage}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={getSchedule}>
          <Ionicons name="refresh" size={20} color="white" />
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Formatear fechas para el calendario
  const formatDateForCalendar = (dateString) => {
    if (!dateString) return new Date().toISOString().split("T")[0];
    return new Date(dateString).toISOString().split("T")[0];
  };

  // Usar la fecha actual como default, pero dentro del rango del evento
  const todayDate = getTodayDate();
  const minDate = formatDateForCalendar(startDate);
  const maxDate = formatDateForCalendar(endDate);

  // Si hoy está dentro del rango del evento, usar hoy; sino usar la fecha de inicio
  const defaultSelectedDate =
    todayDate >= minDate && todayDate <= maxDate ? todayDate : minDate;

  // Manejar el cambio de día
  const onDayPress = (day) => {
    // Solo necesitamos confirmar que el día fue seleccionado
    // El Agenda manejará automáticamente mostrar los items o renderEmptyDate
    // c
  };

  return (
    <View style={styles.container}>
      <Agenda
        items={schedule}
        selected={defaultSelectedDate}
        renderItem={renderItem}
        renderEmptyData={renderEmptyDate}
        onDayPress={onDayPress}
        showClosingKnob={true}
        hideKnob={false}
        minDate={minDate}
        maxDate={maxDate}
        markingType={"dot"}
        pastScrollRange={1}
        futureScrollRange={1}
        calendarHeight={400}
        theme={{
          dotColor: GlobalStyles.primary100 || "#007AFF",
          selectedDayBackgroundColor: GlobalStyles.primary500 || "#007AFF",
          agendaKnobColor: GlobalStyles.primary50 || "#E3F2FD",
          todayButtonTextColor: GlobalStyles.primary100 || "#007AFF",
          textSectionTitleColor: "#333",
          dayTextColor: "#333",
          textDisabledColor: "#ccc",
          agendaDayTextColor: "#666",
          agendaDayNumColor: "#333",
          agendaTodayColor: GlobalStyles.primary500 || "#007AFF",
        }}
        hideExtraDays={true}
        maxToRenderPerBatch={10}
        showOnlySelectedDayItems={true}
        refreshControl={null}
        refreshing={false}
      />

      {/* Modal para mostrar detalles del evento */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeEventModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {selectedEvent && (
              <>
                {/* Header del modal */}
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>
                    {selectedEvent.name || selectedEvent.nombre_actividad}
                  </Text>
                  <TouchableOpacity
                    onPress={closeEventModal}
                    style={styles.closeButton}
                  >
                    <Ionicons name="close" size={24} color="#666" />
                  </TouchableOpacity>
                </View>

                {/* Contenido del modal */}
                <ScrollView
                  style={styles.modalContent}
                  showsVerticalScrollIndicator={false}
                >
                  {/* Información básica */}
                  <View style={styles.eventBasicInfo}>
                    <View style={styles.infoRow}>
                      <Ionicons
                        name="time-outline"
                        size={20}
                        color={GlobalStyles.primary500}
                      />
                      <Text style={styles.infoText}>
                        {new Date(selectedEvent.startDate).toLocaleString(
                          "es-ES",
                          {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
                      </Text>
                    </View>

                    {selectedEvent.endDate && (
                      <View style={styles.infoRow}>
                        <Ionicons
                          name="time"
                          size={20}
                          color={GlobalStyles.primary500}
                        />
                        <Text style={styles.infoText}>
                          Termina:{" "}
                          {new Date(selectedEvent.endDate).toLocaleTimeString(
                            "es-ES",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </Text>
                      </View>
                    )}

                    {selectedEvent.location && (
                      <View style={styles.infoRow}>
                        <Ionicons
                          name="location-outline"
                          size={20}
                          color={GlobalStyles.primary500}
                        />
                        <Text style={styles.infoText}>
                          {selectedEvent.location}
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* Descripción HTML */}
                  {selectedEvent.description && (
                    <View style={styles.descriptionContainer}>
                      <Text style={styles.descriptionTitle}>Descripción</Text>
                      <RenderHtml
                        contentWidth={width - 80}
                        source={{ html: selectedEvent.description }}
                        defaultTextProps={{
                          style: styles.htmlText,
                        }}
                        renderersProps={{
                          a: {
                            onPress: (event, href) => {
                              if (href) {
                                Linking.openURL(href).catch((err) => {
                                  Alert.alert(
                                    "Error",
                                    "No se pudo abrir el enlace",
                                  );
                                });
                              }
                            },
                          },
                        }}
                        tagsStyles={{
                          body: styles.htmlBody,
                          p: styles.htmlParagraph,
                          a: styles.htmlLink,
                          strong: styles.htmlBold,
                          b: styles.htmlBold,
                          em: styles.htmlItalic,
                          i: styles.htmlItalic,
                          h1: styles.htmlHeading,
                          h2: styles.htmlHeading,
                          h3: styles.htmlHeading,
                          ul: styles.htmlList,
                          ol: styles.htmlList,
                          li: styles.htmlListItem,
                        }}
                      />
                    </View>
                  )}
                </ScrollView>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Schedule;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  item: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginRight: 10,
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    borderLeftWidth: 4,
    borderLeftColor: GlobalStyles.primary500 || "#007AFF",
  },
  itemContent: {
    flex: 1,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    flex: 1,
    marginRight: 10,
  },
  itemDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
    lineHeight: 20,
  },
  itemDetails: {
    gap: 6,
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  timeText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginLeft: 6,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 6,
    flex: 1,
  },
  emptyDate: {
    height: 80,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 30,
  },
  emptyDateText: {
    fontSize: 14,
    color: "#999",
    marginTop: 8,
    fontStyle: "italic",
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "white",
    margin: 20,
    borderRadius: 12,
    maxHeight: "80%",
    width: "90%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e1e5e9",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    flex: 1,
    marginRight: 10,
  },
  closeButton: {
    padding: 4,
  },
  modalContent: {
    maxHeight: "70%",
  },
  eventBasicInfo: {
    padding: 20,
    paddingBottom: 10,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: "#333",
    marginLeft: 10,
    flex: 1,
  },
  descriptionContainer: {
    padding: 20,
    paddingTop: 10,
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  htmlText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
  htmlBody: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
  htmlParagraph: {
    marginBottom: 8,
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
  htmlLink: {
    color: GlobalStyles.primary500 || "#007AFF",
    textDecorationLine: "underline",
  },
  htmlBold: {
    fontWeight: "600",
  },
  htmlItalic: {
    fontStyle: "italic",
  },
  htmlHeading: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
    marginTop: 8,
  },
  htmlList: {
    marginBottom: 8,
  },
  htmlListItem: {
    fontSize: 14,
    color: "#333",
    marginBottom: 4,
  },
});
