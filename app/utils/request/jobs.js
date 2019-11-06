import { request } from '../request';

export const getJobs = async data => {
  return await request('/api/jobs', { method: 'POST', body: { data }, headers: { 'Content-Type': 'application/json' }});
}

export const getJob = async publicId => {
  return await request(`/api/job/${publicId}`, { method: 'GET', headers: {} });
}