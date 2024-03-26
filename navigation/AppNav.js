import { NavigationContainer } from "@react-navigation/native"
import { useContext } from "react"
import AuthStack from "./AuthStack"
import { AuthContext } from "../context/AuthContext"
import AppStack from "./AppStack"


const AppNav = () => {
    const authCntx = useContext(AuthContext);
    return (
        <NavigationContainer>
            {authCntx.user ? <AppStack /> : <AuthStack />}
        </NavigationContainer>
    )
}

export default AppNav