import { Alert, StyleSheet, Text, View, TouchableOpacity, Platform } from 'react-native';
import { Agenda, LocaleConfig } from 'react-native-calendars';
import { GlobalStyles } from '../../constants/styles'
import { useContext, useLayoutEffect, useState } from 'react';
import { getAgenda } from '../../util/http';
import { AuthContext } from '../../context/AuthContext';
import { UserContext } from '../../context/UserContext';
import * as Calendar from 'expo-calendar';

LocaleConfig.locales['es'] = {
    monthNames: [
        'Enero',
        'Febrero',
        'Marzo',
        'Abril',
        'Mayo',
        'Junio',
        'Julio',
        'Agosto',
        'Septiembre',
        'Octubre',
        'Noviembre',
        'Diciembre'
    ],
    monthNamesShort: ['Ene.', 'Feb.', 'Mar.', 'Abr.', 'May.', 'Jun.', 'Jul.', 'Ago.', 'Sept.', 'Oct.', 'Nov.', 'Dic.'],
    dayNames: ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'],
    dayNamesShort: ['Dom.', 'Lun.', 'Mar.', 'Mier.', 'Jue.', 'Vie.', 'Sab.'],
    today: "Hoy"
};
LocaleConfig.defaultLocale = 'es';


const Schedule = ({ route }) => {
    const eventId = route.params.eventId;
    const userCntx = useContext(AuthContext);
    const eventData = useContext(UserContext);
    const [schedule, setSchedule] = useState({})
    const { fecha_cierre, fecha_inicio } = eventData.events.find(event => event.id === eventId);


    useLayoutEffect(() => {
        getSchedule();
    }, [])

    async function getSchedule() {
        if (eventId && userCntx.user) data = await getAgenda(eventId, userCntx.user.id);
        if (data) {
            const scheduleFormated = generateItems(data);
            setSchedule(scheduleFormated);
        }else{
            setSchedule(null)
        }
    }
    function generateItems(data) {
        let newData = {}
        data.forEach(item => {
            const key = Object.keys(item)[0];
            const value = item[key];
            newData[key] = value;
        });
        return newData;
    }
    const agregarEventoCalendario = async (eventData) => {
        try {
            // Solicitar permisos para acceder al calendario
            const { status } = await Calendar.requestCalendarPermissionsAsync()
            if (status === 'granted') {
                const evento = {
                    title: eventData.nombre_actividad,
                    startDate: new Date(`${eventData.dia}T${eventData.hora_inicio}`),
                    endDate: new Date(`${eventData.dia}T${eventData.hora_fin}`),
                    alarms: [{ relativeOffset: -15 }],
                    notes: eventData.detalles,
                };
                if (Platform.OS === 'ios') {
                    const defaultCalendarID = await Calendar.getDefaultCalendarAsync();
                    await Calendar.createEventAsync(defaultCalendarID.id, {
                        title: evento.title,
                        startDate: evento.startDate,
                        endDate: evento.endDate,
                        location: evento.location,
                        notes: evento.notes,
                    });
                } else {
                    const calendars = await Calendar.getCalendarsAsync();
                    const calendar = calendars[0];
                    await Calendar.createEventAsync(calendar.id, {
                        title: evento.title,
                        startDate: evento.startDate,
                        endDate: evento.endDate,
                        location: evento.location,
                        notes: evento.notes,
                    });
                }

                Alert.alert('Evento agregado correctamente al calendario')
            } else {
                Alert.alert('No hay permisos para agregar el evento al calendario')
            }

        } catch (error) {
            console.error('Error al agregar evento al calendario:', error);
        }
    };

    const renderItem = (reservation) => {
        const fontSize = 26;
        const color = 'black';
        return (
            <TouchableOpacity
                style={[styles.item, { height: 100 }]}
                onPress={agregarEventoCalendario.bind(this, reservation)}
            >
                <View>
                    <Text style={{ fontSize, color }}>{reservation.nombre_actividad}</Text>
                    <Text style={{ fontSize: 16 }}>{reservation.detalles}</Text>
                </View>
                <View style={styles.hourData}>
                    <Text style={{ fontSize: 16 }}>{reservation.hora_inicio} - </Text>
                    <Text style={{ fontSize: 16 }}>{reservation.hora_fin}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    const renderEmptyDate = () => {
        return (
            <View style={styles.emptyDate}>
                <Text>This is empty date!</Text>
            </View>
        );
    };

    if(schedule === null) {
       return <Text>No hay actividades para mostrar</Text>
    }
    return (<Agenda
        items={schedule}
        selected={fecha_inicio.slice(0, 10)}
        renderItem={renderItem}
        renderEmptyDate={renderEmptyDate}
        showClosingKnob={true}
        minDate={fecha_inicio.slice(0, 10)}
        maxDate={fecha_cierre.slice(0, 10)}
        markingType={'dot'}
        pastScrollRange={2}
        futureScrollRange={2}
        theme={{ dotColor: GlobalStyles.primary100, selectedDayBackgroundColor: GlobalStyles.primary500, agendaKnobColor: GlobalStyles.primary50, todayButtonTextColor: GlobalStyles.primary100, }}
        hideExtraDays={true}
        maxToRenderPerBatch={10}
        showOnlySelectedDayItems
    />)

}

export default Schedule



const styles = StyleSheet.create({
    item: {
        backgroundColor: 'white',
        flex: 1,
        borderRadius: 5,
        padding: 10,
        marginRight: 10,
        marginTop: 10,
    },
    emptyDate: {
        height: 15,
        flex: 1,
        paddingTop: 30
    },
    hourData: {
        flexDirection: 'row',
    }
});