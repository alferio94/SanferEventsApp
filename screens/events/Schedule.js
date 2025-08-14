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
import { GlobalStyles } from "../../constants/styles";
import { useContext, useLayoutEffect, useState, useEffect } from "react";
import { getAgenda } from "../../util/http";
import { AuthContext } from "../../context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import LoadingOverlay from "../../components/ui/LoadingOverlay";
import RenderHtml from "react-native-render-html";
import { useWindowDimensions } from "react-native";


const Schedule = ({ route, navigation }) => {
  const { eventId, groupId, groupName, eventName } = route.params;
  const { events } = useContext(AuthContext);
  const [schedule, setSchedule] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const { width, height } = useWindowDimensions();

  // Obtener información del evento
  const eventSelected = events.find((event) => event.id === eventId);
  const startDate = eventSelected?.startDate || eventSelected?.fecha_inicio;
  const endDate = eventSelected?.endDate || eventSelected?.fecha_cierre;

  useEffect(() => {
    if (eventId && groupId) {
      getSchedule();
    }
  }, [eventId, groupId]);

  // Inicializar fecha seleccionada cuando los datos estén listos
  useEffect(() => {
    if (!selectedDate && schedule && Object.keys(schedule).length > 0) {
      const firstAvailableDay = Object.keys(schedule)
        .filter(date => schedule[date] && schedule[date].length > 0)
        .sort()[0];
      if (firstAvailableDay) {
        setSelectedDate(firstAvailableDay);
      }
    }
  }, [schedule, selectedDate]);

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


  // Función auxiliar para crear fecha local sin problemas de zona horaria
  const createLocalDate = (dateString) => {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  // Formatear fecha para mostrar (ej: "Lunes 30 de Julio")
  const formatDateForDisplay = (dateString) => {
    const date = createLocalDate(dateString);
    const formatted = date.toLocaleDateString("es-ES", {
      weekday: "long",
      day: "numeric",
      month: "long"
    });
    
    // Capitalizar la primera letra del día y del mes
    return formatted.replace(/^(\w)/, (match) => match.toUpperCase())
                   .replace(/(\s+de\s+)(\w)/, (match, p1, p2) => p1 + p2.toUpperCase());
  };

  // Formatear hora para mostrar
  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Función auxiliar para obtener fecha de hoy en formato YYYY-MM-DD local
  const getTodayDateString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Procesar datos del schedule para obtener días disponibles
  const getAvailableDays = () => {
    if (!schedule || Object.keys(schedule).length === 0) {
      return [];
    }

    const todayString = getTodayDateString();

    return Object.keys(schedule)
      .filter(date => schedule[date] && schedule[date].length > 0)
      .sort()
      .map(date => {
        const localDate = createLocalDate(date);
        return {
          date,
          events: schedule[date],
          dayNumber: localDate.getDate(),
          monthName: localDate.toLocaleDateString("es-ES", { month: "short" }).replace(/^(\w)/, (match) => match.toUpperCase()),
          fullDisplayDate: formatDateForDisplay(date),
          isToday: date === todayString
        };
      });
  };

  const availableDays = getAvailableDays();

  // Obtener eventos del día seleccionado
  const getSelectedDayEvents = () => {
    if (!selectedDate || !schedule[selectedDate]) {
      return [];
    }
    return schedule[selectedDate];
  };

  const selectedDayEvents = getSelectedDayEvents();
  const selectedDayInfo = availableDays.find(day => day.date === selectedDate);

  return (
    <View style={styles.container}>
      {availableDays.length > 0 ? (
        <>
          {/* Day Picker Horizontal */}
          <View style={styles.dayPickerContainer}>
            <ScrollView 
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.dayPickerContent}
            >
              {availableDays.map((day) => (
                <TouchableOpacity
                  key={day.date}
                  style={[
                    styles.dayPickerItem,
                    selectedDate === day.date && styles.dayPickerItemSelected,
                    day.isToday && styles.dayPickerItemToday
                  ]}
                  onPress={() => setSelectedDate(day.date)}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.dayPickerMonth,
                    selectedDate === day.date && styles.dayPickerTextSelected
                  ]}>
                    {day.monthName}
                  </Text>
                  <Text style={[
                    styles.dayPickerDay,
                    selectedDate === day.date && styles.dayPickerTextSelected,
                    day.isToday && selectedDate !== day.date && styles.dayPickerTodayText
                  ]}>
                    {day.dayNumber}
                  </Text>
                  {day.isToday && (
                    <View style={[
                      styles.todayIndicator,
                      selectedDate === day.date && styles.todayIndicatorSelected
                    ]} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Selected Day Header */}
          {selectedDayInfo && (
            <View style={styles.selectedDayHeader}>
              <Text style={styles.selectedDayTitle}>
                {selectedDayInfo.fullDisplayDate}
              </Text>
              <Text style={styles.selectedDayCount}>
                {selectedDayEvents.length} {selectedDayEvents.length === 1 ? 'actividad' : 'actividades'}
              </Text>
            </View>
          )}

          {/* Events List for Selected Day */}
          <ScrollView 
            style={styles.eventsScrollContainer}
            contentContainerStyle={styles.eventsScrollContent}
            showsVerticalScrollIndicator={false}
          >
            {selectedDayEvents.map((event, index) => (
              <TouchableOpacity
                key={`${selectedDate}-${index}`}
                style={styles.eventCard}
                onPress={() => openEventModal(event)}
                activeOpacity={0.7}
              >
                <View style={styles.eventContent}>
                  <View style={styles.eventHeader}>
                    <Text style={styles.eventTitle}>
                      {event.name || event.nombre_actividad}
                    </Text>
                    <Ionicons
                      name="chevron-forward"
                      size={16}
                      color={GlobalStyles.primary500}
                    />
                  </View>

                  <View style={styles.eventDetails}>
                    <View style={styles.timeContainer}>
                      <Ionicons name="time-outline" size={16} color="#666" />
                      <Text style={styles.timeText}>
                        {formatTime(event.startDate)} - {formatTime(event.endDate)}
                      </Text>
                    </View>

                    {event.location && (
                      <View style={styles.locationContainer}>
                        <Ionicons name="location-outline" size={16} color="#666" />
                        <Text style={styles.locationText}>{event.location}</Text>
                      </View>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </>
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="calendar-outline" size={64} color="#ccc" />
          <Text style={styles.emptyStateTitle}>Sin actividades</Text>
          <Text style={styles.emptyStateMessage}>
            No hay actividades programadas para este grupo
          </Text>
        </View>
      )}

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
  dayPickerContainer: {
    backgroundColor: "white",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e1e5e9",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 3,
  },
  dayPickerContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  dayPickerItem: {
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    minWidth: 60,
    position: "relative",
    borderWidth: 2,
    borderColor: "transparent",
  },
  dayPickerItemSelected: {
    backgroundColor: GlobalStyles.primary500 || "#007AFF",
    borderColor: GlobalStyles.primary500 || "#007AFF",
  },
  dayPickerItemToday: {
    borderColor: GlobalStyles.primary300 || "#87CEEB",
  },
  dayPickerMonth: {
    fontSize: 12,
    fontWeight: "500",
    color: "#666",
    textTransform: "uppercase",
  },
  dayPickerDay: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginTop: 2,
  },
  dayPickerTextSelected: {
    color: "white",
  },
  dayPickerTodayText: {
    color: GlobalStyles.primary500 || "#007AFF",
  },
  todayIndicator: {
    position: "absolute",
    bottom: 4,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: GlobalStyles.primary500 || "#007AFF",
  },
  todayIndicatorSelected: {
    backgroundColor: "white",
  },
  selectedDayHeader: {
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e1e5e9",
  },
  selectedDayTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },
  selectedDayCount: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  eventsScrollContainer: {
    flex: 1,
  },
  eventsScrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  eventCard: {
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 8,
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
  eventContent: {
    padding: 16,
  },
  eventHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    flex: 1,
    marginRight: 8,
  },
  eventDetails: {
    gap: 6,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
    minHeight: 300,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateMessage: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
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
  calendarToggleContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  showCalendarButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: GlobalStyles.primary500 || "#007AFF",
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  showCalendarText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});
