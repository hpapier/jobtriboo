import { request } from '../request';

export const getRooms = async (userStatus, token) => {
  return await request(`/api/${userStatus}/rooms`, { method: 'GET', headers: { 'Authorization': token }});
}

export const postMessage = async (data, token, userState) => {
  return await request(`/api/room/${userState}/message`, { method: 'PUT', body: { data }, headers: { 'Authorization': token, 'Content-Type': 'application/json' }});
}