import axios from 'axios'
import { getToken } from './auth'

const withHeaders = () => {
  return {
    headers: { Authorization: `Bearer ${getToken()}` }
  }
}

export const getAllPlants = () => {
  return axios.get('/api/plants')
}

export const getSinglePlant = id => {
  return axios.get(`/api/plants/${id}`)
}

export const newPlant = formData => {
  return axios.post('/api/plants', formData, withHeaders())
}

export const editPlant = (id, formData) => {
  return axios.put(`/api/plants/${id}`, formData, withHeaders())
}

export const deletePlant = id => {
  return axios.delete(`/api/plants/${id}`, withHeaders())
}

export const registerUser = formData => {
  return axios.post(`/api/register`, formData)
}

export const loginUser = formData => {
  return axios.post(`/api/login`, formData)
}

export const getTrefleData = query => {
  return axios.post('/api/trefle', {search: query} )
}
export const getPortfolio = () => {
  return axios.get('/api/profile', withHeaders())
}

export const getPublicPortfolio = id => {
  return axios.get(`/api/profile/${id}`)
}

export const makeOffer = (id, plantId, offerData) => {
  return axios.post(`/api/offer/${id}/${plantId}`, offerData, withHeaders())
}

export const respondOffer = (id, plantid, decision, offered, offerData) => {
  return axios.post(`/api/response/${id}/${plantid}/${decision}/${offered}`, offerData, withHeaders())
}

export const finishTrade = (userid, offerid, plantid, userplantid) => {
  return axios.delete(`/api/finish/${userid}/${offerid}/${plantid}/${userplantid}`, withHeaders())
}

export const getAllChats = () => {
  return axios.get(`/api/chat`, withHeaders())
}

export const createChat = (receiverid, message) => {
  return axios.post(`/api/chat/${receiverid}`, message, withHeaders())
}

export const sendMessage = (chatid, message) => {
  return axios.post(`/api/chat/message/${chatid}`, message, withHeaders())
}

export const addLikes = (id) => {
  //* When we send a post request for the like we need to send the body PlantId
  return axios.post(`/api/likes`, {plantId: id}, withHeaders())
}

export const addComment = ( commentData, plantId ) => {
    return axios.post(`/api/plants/${plantId}/comments`, commentData, withHeaders())
}

export const deleteComment = ( plantId, commentId ) => {
  return axios.delete(`/api/plants/${plantId}/comments/${commentId}`, withHeaders())
}

export const getPhoto = (searchTerm) => {
  console.log(searchTerm)
  return axios.post('/api/photo', {searchquery: searchTerm})
}

export const getSummary = (plantName) => {
  return axios.post('/api/summary', {searchTerm: plantName})
}



//is?