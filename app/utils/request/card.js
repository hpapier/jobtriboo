import { request } from '../request';

export const addNewCard = async (data, token) => {
  return await request('/api/recruiter/cards', { method: 'POST', body: { data }, headers: { 'Authorization': token, 'Content-Type': 'application/json' }});
}

export const getCards = async token => {
  return await request('/api/recruiter/cards', { method: 'GET', headers: { 'Authorization': token }});
}