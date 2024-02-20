import { createContext, useState } from "react";

export const AuthContext = createContext({
    userToken:null,
    login: (id) => {},
    logout: (id) => {}
});

function AuthContextProvider({children}){
    const [userToken, setUserToken] = useState(null);
    function login(){
        setUserToken('213yu21r63128y3')
    }
    function logout(){
        setUserToken(null)
    }

    const value ={
        userToken:userToken,
        login:login
    }


    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/* function AuthContextProvider({children}){

    const [favoriteMeals, setFavoriteMEals] = useState('Text')

    function addFavorite(id){
        setFavoriteMEals((currentFavIds) => [...currentFavIds, id]);
    }

    function removeFavorite(id){
        setFavoriteMEals((currentFavIds) => currentFavIds.filter(mealId => mealId !== id ))
    }

    const value ={
        ids:favoriteMeals,
        addFavorite:addFavorite,
        removeFavorite:removeFavorite
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
} */

export default AuthContextProvider