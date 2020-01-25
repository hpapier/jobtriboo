import { request } from '../request';

export const postAnnounce = async (data, token) => {
  return await request('/api/recruiter/announces', { method: 'POST', body: { data }, headers: { 'Authorization': token, 'Content-type': 'application/json' }});
}


/**
 * Get the announce for a particular recruiter.
 * @param token string
 */

export const getRecruiterAnnounces: (token: string) => Promise<Response> = async token => {
  return await request('/api/recruiter/announces', { method: 'GET', headers: { 'Authorization': token }});
}



/**
 * Delete an announce.
 * @param id string
 * @param token string
 */

export const deleteAnnounce = async (id: string, token: string) => {
  return await request('/api/recruiter/announces', { method: 'DELETE', body: { id }, headers: { 'Authorization': token, 'Content-type': 'application/json' }});
}




export const apply = async (data, token) => {
  return await request('/api/candidate/apply', { method: 'POST', body: { data }, headers: { 'Authorization': token, 'Content-Type': 'application/json' }});
}

export const getPaymentIntent = async (token: string, coupon: string) => {
  return await request('/api/recruiter/announce/intent', { method: 'POST', body: { coupon }, headers: { 'Authorization': token, 'Content-Type': 'application/json' }})
}

export const getPaymentMethod = async (data, token) => {
  return await request('/api/recruiter/announce/paymentMethod', { method: 'POST', body: { data }, headers: { 'Authorization': token, 'Content-Type': 'application/json' }})
}

