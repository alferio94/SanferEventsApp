import { NavigationContainer } from "@react-navigation/native"
import { useContext } from "react"
import { View, ActivityIndicator, StyleSheet } from "react-native"
import AuthStack from "./AuthStack"
import { AuthContext } from "../context/AuthContext"
import AppStack from "./AppStack"


const AppNav = () => {
    const authCntx = useContext(AuthContext);

    // Mostrar loading screen mientras se inicializa la app
    if (!authCntx || authCntx.isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#ef3b42" />
            </View>
        );
    }

    return (
        <NavigationContainer>
            {authCntx.isAuthenticated && authCntx.user ? <AppStack /> : <AuthStack />}
        </NavigationContainer>
    )
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
});

export default AppNav