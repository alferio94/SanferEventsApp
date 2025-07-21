import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import { Ionicons } from "@expo/vector-icons";
import { GlobalStyles } from "../constants/styles";
import ProfileScreen from "../screens/ProfileScreen";
import NotificationsScreen from "../screens/NotificationsScreen";
import EventStack from "./EventNav";

const Tabs = createBottomTabNavigator();

const AppStack = () => {
  return (
    <Tabs.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: GlobalStyles.primary500 },
        headerTintColor: "#ffffff",
        headerTitle: "Sanfer Eventos",
        tabBarShowLabel: false,
        tabBarActiveTintColor: GlobalStyles.primary50,
        tabBarStyle: { backgroundColor: GlobalStyles.primary500 },
        tabBarInactiveTintColor: "white",
      }}
    >
      <Tabs.Screen
        name="home"
        component={EventStack}
        options={{
          headerShown: false,
          title: "Inicio",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-sharp" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        component={ProfileScreen}
        options={{
          title: "Inicio",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
      {/*  <Tabs.Screen name="notifications" component={NotificationsScreen} options={{title:'Inicio', tabBarIcon: ({ color, size }) => <Ionicons name='notifications' size={size} color={color} /> }} /> */}
    </Tabs.Navigator>
  );
};

export default AppStack;

