import axios from "axios";
const BACKEND_URL = 'https://sanfer.capitanpharma.com/api'


//! Se puede encapsular las peticiones en un solo archivo de expor con factory functions 

export async function login(userData){
    const response = await axios.post(
        `${BACKEND_URL}/login-app`,
        userData,
        );
    return response.data.data
}

export async function getEvents(userId){
    const response = await axios.get(
        `${BACKEND_URL}/usuarioEventos/${userId}`
    )
    return response.data.data
}
export async function getFood(eventId){
    const response = await axios.get(
        `${BACKEND_URL}/alimentos/evento/${eventId}`
    )
    return response.data.data
}
export async function getSpeakers(eventId){
    const response = await axios.get(
        `${BACKEND_URL}/ponentes/evento/${eventId}`
    )
    return response.data.data
}
export async function getAgenda(eventId,userId){
    const response = await axios.get(
        `${BACKEND_URL}/agenda/evento/${eventId}/usuario/${userId}`
    )
    return response.data.data
}
export async function getHotel(eventId){
    const response = await axios.get(
        `${BACKEND_URL}/hoteles/evento/${eventId}`
    )
    return response.data.data[0]
}
export async function getTransports(eventId){
    const response = await axios.get(
        `${BACKEND_URL}/transportes/evento/${eventId}`
    )
    return response.data.data
}
