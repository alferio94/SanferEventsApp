import axios from "axios";
const BACKEND_URL = 'https://eralfcomputer.online/api'


export async function login(userData){
    try {
        const response = await axios.post(
            `${BACKEND_URL}/users/login`,
            {
                "email":userData.email,
                "password":userData.password
              },
            );
            return response.data
    } catch (error) {
        return null
    }
    
}

export async function getEvents(userId){
    const response = await axios.get(
        `${BACKEND_URL}/events/`
    )
    return response.data
}
export async function getFood(eventId){
    const response = await axios.get(
        `${BACKEND_URL}/alimentos/evento/${eventId}`
    )
    return response.data.data
}
export async function getSpeakers(eventId){
    const response = await axios.get(
        `${BACKEND_URL}/speaker/${eventId}`
    )
    return response.data
}
export async function getAgenda(eventId){
    try {
        const response = await axios.get(
            `${BACKEND_URL}/agenda/app/${eventId}`
        )
        return response.data
    } catch (error) {
        console.log(error)
    }
    //return response.data
}
export async function getAgendaFiltered(eventId,groupId){
    try {
        const response = await axios.get(
            `${BACKEND_URL}/agenda/app/${eventId}?group=${groupId}`
        )
        return response.data
    } catch (error) {
        console.log(error)
    }
}
export async function getHotel(eventId){
    const response = await axios.get(
        `${BACKEND_URL}/hotel/${eventId}`
    )
    return response.data[0]
}
export async function getTransports(eventId){
    const response = await axios.get(
        `${BACKEND_URL}/transportes/evento/${eventId}`
    ) 
    return response.data.data
}
