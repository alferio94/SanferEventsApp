import { createContext, useState } from "react";

export const UserContext = createContext({
    events:[],
    fetchEvents: () => {}
});

function UserContextProvider({children}){
    const [events, setEvents] = useState([]);

    function fetchEvents(events){
        setEvents(events)
    }


    const value ={
        events:events,
        fetchEvents: fetchEvents
    }


    return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}



export default UserContextProvider