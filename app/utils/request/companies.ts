import { request } from '../request';

export const getRecruiterCompanies = async token => {
  return await request('/api/recruiter/companies', { method: 'GET', headers: { 'Authorization': token }});
};


/**
 * Create new company for a recruiter
 */


// Interface
interface CompanyData {
  logo: {
    data: string,
    type: string
  },
  name: string,
  phone: string,
  email: string,
  country: string,
  city: string,
  description: string,
  category: string,
  employeesNumber: string,
  link: string,
  // NIF: string,
  // createdBy: string
}


// Creation Request:
export const createNewCompany = async (data: CompanyData, token: string) => {
  return await request('/api/recruiter/companies', { method: 'POST', body: { data }, headers: { 'Authorization': token, 'Content-Type': 'application/json' }});
};










export const deleteCompany = async (data: { logo: string, id: string }, token: string) => {
  return await request('/api/recruiter/companies', { method: 'DELETE', body: { data }, headers: { 'Authorization': token, 'Content-Type': 'application/json' }});
}



/**
 * Update company for a recruiter
 */

// Interface
interface UpdateCompanyData extends CompanyData {
  _id: string,
  logo: {
    data: string,
    type: string,
    new: boolean
  }
}

// Update Company Request:
export const updateCompany: (data: UpdateCompanyData, token: string) => Promise<Response> = async (data, token) => {
  return await request('/api/recruiter/companies', { method: 'PUT', body: { data }, headers: { 'Authorization': token, 'Content-Type': 'application/json' }});
}




/***
 * Get the companies with a query.
 * @param data CompanyQuery
***/

// @Interface
interface CompanyQuery {
  offset: number,
  companyName: string,
  companyLocation: string,
  categories: Array<string>,
  size: Array<string>
}

// @Request
export const getCompanies = async (data: CompanyQuery): Promise<Response> => {
  return await request('/api/companies', { method: 'POST', body: { data }, headers: { 'Content-Type': 'application/json' }});
}







/**
 * Get
 * @param name string
***/

// @Request
export const getCompany = async (name: string): Promise<Response> => await request(`/api/company/${name}`, { method: 'GET', headers: {} });