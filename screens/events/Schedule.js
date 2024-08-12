import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Pressable,
  ScrollView,
  Modal,
} from "react-native";
import { Agenda, LocaleConfig } from "react-native-calendars";
import { GlobalStyles } from "../../constants/styles";
import { useContext, useLayoutEffect, useState } from "react";
import { getAgenda, getAgendaFiltered } from "../../util/http";
import { UserContext } from "../../context/UserContext";
import HTML from "react-native-render-html";

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

const Schedule = ({ route }) => {
  const eventId = route.params.eventId;
  const eventData = useContext(UserContext);
  const { groups } = eventData.events.find(
    (event) => event.id === eventId
  );
  const [schedule, setSchedule] = useState({});
  const [dates, setDates] = useState([]);
  const [active, setActive] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [activeAgenda, setActiveAgenda] = useState(null);
  const [loading, setLoading] = useState(false);

  useLayoutEffect(() => {
    getSchedule();
  }, []);

  async function getSchedule() {
    setLoading(true);
    setSchedule({});
    if (eventId) {
      try {
        const agenda = await getAgenda(eventId);
        setSchedule(agenda);
        setDates(Object.keys(agenda));
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  }

  async function filterAgenda(groupId) {
    setLoading(true);
    setSchedule({});
    if (eventId) {
      try {
        const agenda = await getAgendaFiltered(eventId,groupId);
        setSchedule(agenda);
        setDates(Object.keys(agenda));
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  }

  function handleModal(data) {
    setActiveAgenda(data ? data : null);
    setModalOpen(!modalOpen);
  }

   async function filterButton(name, id) {
    setLoading(true);
    if (active === name) {
      setActive("");
      await getSchedule();
    } else {
      setActive(name);
      await filterAgenda(id);
    }
    setLoading(false);
  };

  const renderItem = (reservation) => {
    const fontSize = 22;
    const color = "white";
    let bg = "#585959";
    if (reservation.groups.length === 1) {
      groups.forEach((group) => {
        if (group.id === reservation.groups[0]) {
          bg = group.color;
        }
      });
    }
    return (
      <TouchableOpacity
        style={[styles.item, { height: "auto", backgroundColor: bg }]}
        onPress={() => handleModal(reservation)}
      >
        <View>
          <Text style={{ fontSize, color }}>{reservation.name}</Text>
          <Text style={{ fontSize: 16, color: "#fff" }}>{reservation.details}</Text>
        </View>
        <View style={styles.hourData}>
          <Text style={{ fontSize: 16, color: "#fff" }}>
            {reservation.startDate.split("T")[1].substring(0, 5)} -{" "}
          </Text>
          <Text style={{ fontSize: 16, color: "#fff" }}>
            {reservation.endDate.split("T")[1].substring(0, 5)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1, paddingBottom: 3, marginBottom: 5 }}>
      <View>
        <ScrollView horizontal={true}>
          {groups.map((item) => (
            <Pressable
              onPress={() => filterButton(item.name, item.id)}
              key={item.id}
            >
              <View
                style={[
                  styles.filter,
                  active === item.name
                    ? { backgroundColor: GlobalStyles.primary100 }
                    : { backgroundColor: item.color },
                ]}
              >
                <Text
                  style={[
                    styles.textoBoton,
                    active === item.name ? { color: "#000" } : { color: "#fff" },
                  ]}
                >
                  {item.name}
                </Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      </View>
      {!loading && (
        <Agenda
          items={schedule}
          renderItem={renderItem}
          selected={dates[0]}
          minDate={dates[0]}
          maxDate={dates[dates.length - 1]}
          pastScrollRange={2}
          futureScrollRange={2}
          theme={{
            dotColor: GlobalStyles.primary100,
            selectedDayBackgroundColor: GlobalStyles.primary500,
            agendaKnobColor: GlobalStyles.primary50,
            todayButtonTextColor: GlobalStyles.primary100,
          }}
        />
      )}
      {loading && <Text>Cargando...</Text>}
      <Modal visible={modalOpen} animationType="slide" transparent={true}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={{ alignItems: "flex-end", width: "100%", flex: 1 }}>
              <TouchableOpacity
                style={{
                  backgroundColor: GlobalStyles.primary100,
                  paddingHorizontal: 5,
                  paddingVertical: 8,
                  borderRadius: 10,
                }}
                onPress={() => handleModal(null)}
              >
                <Text style={{ color: "white" }}>Cerrar</Text>
              </TouchableOpacity>
            </View>
            <View style={{ flex: 5 }}>
              <ScrollView>
                {activeAgenda && activeAgenda.extraInfo !== "" ? (
                  <HTML
                    source={{ html: activeAgenda.extraInfo }}
                    ignoredDomTags={["font"]}
                    contentWidth={350}
                  />
                ) : (
                  <Text>No hay datos extra</Text>
                )}
              </ScrollView>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Schedule;

const styles = StyleSheet.create({
  item: {
    backgroundColor: "white",
    flex: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 15,
    marginRight: 10,
    marginTop: 10,
  },
  emptyDate: {
    height: 15,
    flex: 1,
    paddingTop: 30,
  },
  hourData: {
    flexDirection: "row",
  },
  filter: {
    marginVertical: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginHorizontal: 3,
  },
  textoBoton: {
    fontWeight: "700",
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    color: "#fff",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    width: "90%",
    height: "60%",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});