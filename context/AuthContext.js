import { createContext, useState } from "react";

export const AuthContext = createContext({
    user:null,
    login: (id) => {},
    logout: (id) => {}
});

function AuthContextProvider({children}){
    const [user, setUser] = useState(null);
    function login(userData){
        setUser(userData)
    }
    function logout(){
        setUser(null)
    }

    const value ={
        user:user,
        login:login,
        logout:logout
    }


    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}



export default AuthContextProvider