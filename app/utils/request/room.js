import { request } from '../request'

export const getRoomData = async (state, roomId, token, offset) => {
  return await request(`/api/room/${state}/${roomId}/${offset}`, { method: 'GET', headers: { 'Authorization': token }});
}

export const roomAcceptation = async (roomId, token) => {
  return await request(`/api/room/recruiter/${roomId}/accept`, { method: 'PUT', body: {}, headers: { 'Authorization': token }});
}