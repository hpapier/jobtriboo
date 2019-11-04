import { request } from '../request';

export const fetchSettings = async (status, token) => {
  return await request(`/api/${status}/settings`, { method: 'GET', headers: { 'Authorization': token }})
}

export const updateSetting = async (data, token) => {
  return await request('/api/recruiter/settings', { method: 'PUT', body: { data }, headers: { 'Authorization': token, 'Content-Type': 'application/json' }});
}