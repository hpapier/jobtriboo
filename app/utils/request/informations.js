import { request } from '../request';


export const candidateProfilPictureUpdate = async (picture, type, token) => {
  return await request('/api/profil/picture', { method: 'PUT', body: { picture, type }, headers: { 'Authorization': token, 'Content-Type': 'application/json' }});
}

export const candidateDescriptionUpdate = async (description, token) => {
  return await request('/api/profil/description', { method: 'PUT', body: { description }, headers: { 'Authorization': token, 'Content-Type': 'application/json' }});
}

export const candidateInformationUpdate = async (endpoint, data, token) => {
  console.log(endpoint, data, token)
  return await request('/api/profil' + endpoint, { method: 'PUT', body: { data }, headers: { 'Authorization': token, 'Content-Type': 'application/json' }});
}

export const getCandidateSettings = async token => {
  return await request('/api/candidate/settings', { method: 'GET', headers: { 'Authorization': token }});
}

export const getCandidateInfo = async token => {
  return await request('/api/candidate/info', { method: 'GET', headers: { 'Authorization': token }});
}