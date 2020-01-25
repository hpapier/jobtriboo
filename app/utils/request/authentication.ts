// @module import
import { request } from '../request';

export const loginAuthentication: (email: string, password: string) => Promise<Response> = async (email, password) => {
  return await request('/api/authentication', { method: 'POST', body: { email, password }, headers: { 'Content-Type': 'application/json' }});
}

export const registerAuthentication: (userState: string, firstname: string, lastname: string, email: string, phone: string, password: string) => Promise<Response>
  = async (userState, firstname, lastname, email, phone, password) => {
    console.log(userState, firstname, lastname, email, phone, password)
    return await request('/api/register', { method: 'POST', body: { userState, firstname, lastname, email, phone, password }, headers: { 'Content-Type': 'application/json' } });
  }