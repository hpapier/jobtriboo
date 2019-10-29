import { request } from '../request';

export const getRecruiterCompanies = async token => {
  return await request('/api/recruiter/companies', { method: 'GET', headers: { 'Authorization': token }});
};

export const createNewCompany = async (data, token) => {
  return await request('/api/recruiter/companies', { method: 'POST', body: { data }, headers: { 'Authorization': token, 'Content-Type': 'application/json' }});
};