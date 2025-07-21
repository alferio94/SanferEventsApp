import { createNativeStackNavigator } from "@react-navigation/native-stack"
import HomeScreen from "../screens/HomeScreen";
import { GlobalStyles } from "../constants/styles";
import UserContextProvider from "../context/UserContext";
import EventDetails from "../screens/events/EventDetails";
import Sede from "../screens/events/Sede";
import GeneralInfo from "../screens/events/GeneralInfo";
import FoodInfo from "../screens/events/FoodInfo";
import Speakers from "../screens/events/Speakers";
import Schedule from "../screens/events/Schedule";
import GroupSelector from "../screens/events/GroupSelector";
import HotelDetails from "../screens/events/HotelDetails";
import Transport from "../screens/events/Transport";
import HealthCare from "../screens/events/HealthCare";


const Stack = createNativeStackNavigator();
const EventStack = () => {
    return (
        <UserContextProvider>
            <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: GlobalStyles.primary500 }, headerTintColor: '#ffffff'}}>
                <Stack.Screen name="eventsOverview" component={HomeScreen} options={{ title: 'Mis Eventos', presentation:'fullScreenModal' }} />
                <Stack.Screen name="eventDetails" component={EventDetails} options={{title: 'Detalles'}} />
                <Stack.Screen name="sedeDetails" component={Sede} options={{title: 'Sede'}} />
                <Stack.Screen name="generalInfo" component={GeneralInfo} options={{title: 'Informacion General'}} />
                <Stack.Screen name="foodInfo" component={FoodInfo} options={{title: 'Alimentos'}} />
                <Stack.Screen name="speakers" component={Speakers} options={{title: 'Ponentes'}} />
                <Stack.Screen name="groupSelector" component={GroupSelector} options={{title: 'Seleccionar Grupo'}} />
                <Stack.Screen name="agenda" component={Schedule} options={{title: 'Agenda'}} />
                <Stack.Screen name="hotel" component={HotelDetails} options={{title: 'Hotel'}} />
                <Stack.Screen name="transport" component={Transport} options={{title: 'Transportes'}} />
                <Stack.Screen name="health" component={HealthCare} options={{title: 'Emergencias'}} />
            </Stack.Navigator>
        </UserContextProvider>
    )
}

export default EventStack