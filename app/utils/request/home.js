import { request } from '../request';

export const subscribeToNewspaper = async email => {
  return await request('/api/nws/subscription', { method: 'POST', body: { email }, headers: { 'Content-Type': 'application/json' }});
}