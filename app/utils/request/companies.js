import { request } from '../request';

export const getRecruiterCompanies = async token => {
  return await request('/api/recruiter/companies', { method: 'GET', headers: { 'Authorization': token }});
};

export const createNewCompany = async (data, token) => {
  return await request('/api/recruiter/companies', { method: 'POST', body: { data }, headers: { 'Authorization': token, 'Content-Type': 'application/json' }});
};

export const deleteCompany = async (data, token) => {
  return await request('/api/recruiter/companies', { method: 'DELETE', body: { data }, headers: { 'Authorization': token, 'Content-Type': 'application/json' }});
}

export const updateCompany = async (data, token) => {
  return await request('/api/recruiter/companies', { method: 'PUT', body: { data }, headers: { 'Authorization': token, 'Content-Type': 'application/json' }});
}

export const getCompanies = async data => {
  return await request('/api/companies', { method: 'POST', body: { data }, headers: { 'Content-Type': 'application/json' }});
}