import { request } from '../request'

export const getCandidate = async publicId => {
  return await request(`/api/candidate/${publicId}`, { method: 'GET', headers: {} });
}