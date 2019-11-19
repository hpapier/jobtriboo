import { request } from '../request';

export const postAnnounce = async (data, token) => {
  return await request('/api/recruiter/announces', { method: 'POST', body: { data }, headers: { 'Authorization': token, 'Content-type': 'application/json' }});
}

export const getRecruiterAnnounces = async token => {
  return await request('/api/recruiter/announces', { method: 'GET', headers: { 'Authorization': token }});
}

export const deleteAnnounce = async (data, token) => {
  return await request('/api/recruiter/announces', { method: 'DELETE', body: { data }, headers: { 'Authorization': token, 'Content-type': 'application/json' }});
}

export const apply = async (data, token) => {
  return await request('/api/candidate/apply', { method: 'POST', body: { data }, headers: { 'Authorization': token, 'Content-Type': 'application/json' }});
}