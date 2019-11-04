import { request } from '../request';

export const addNewCard = async (data, token) => {
  return await request('/api/recruiter/cards', { method: 'POST', body: { data }, headers: { 'Authorization': token, 'Content-Type': 'application/json' }});
}

export const fetchCards = async token => {
  return await request('/api/recruiter/cards', { method: 'GET', headers: { 'Authorization': token }});
}

export const deleteCard = async (data, token) => {
  return await request('/api/recruiter/cards', { method: 'DELETE', body: { data }, headers: { 'Authorization': token, 'Content-Type': 'application/json' }});
}