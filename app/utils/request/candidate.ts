import { request } from '../request'





/***
 *  Get the profil public page for a candidate.
***/
export const getCandidate = async publicId => {
  return await request(`/api/candidate/${publicId}`, { method: 'GET', headers: {} });
}





/***
 *  Add a qualification to candidate
***/

// Interface
interface QualificationProps {
  diplomaTitle: string,
  startingDate: string,
  endDate: string,
  inProgress: boolean,
  school: string
}

// Add Qualification Request
export const addQualification: (data: QualificationProps, token: string) => Promise<Response> = async (data, token) => {
  return await request('/api/candidate/qualification', { method: 'POST', body: { data }, headers: { 'Content-Type': 'application/json', 'Authorization': token } })
}





/***
 *  Remove a qualification to candidate
***/

// Remove Qualification Request
export const removeQualification: (id: string, token: string) => Promise<Response> = async (id, token) => {
  return await request('/api/candidate/qualification', { method: 'PUT', body: { id }, headers: { 'Content-Type': 'application/json', 'Authorization': token } })
}





/***
 *  Add an experience to candidate
***/

// Interface
interface ExperienceProps {
  jobTitle: string,
  startingDate: string,
  endDate: string,
  inProgress: boolean,
  company: string,
  description: string
}

// Add Experience Request
export const addExperience: (data: ExperienceProps, token: string) => Promise<Response> = async (data, token) => {
  return await request('/api/candidate/experience', { method: 'POST', body: { data }, headers: { 'Content-Type': 'application/json', 'Authorization': token } })
}





/***
 *  Remove an experience to candidate
***/

// Remove Experience Request
export const removeExperience: (id: string, token: string) => Promise<Response> = async (id, token) => {
  return await request('/api/candidate/experience', { method: 'PUT', body: { id }, headers: { 'Content-Type': 'application/json', 'Authorization': token } })
}





/***
 *  Add a skill to candidate
***/

// Add Skill Request
export const addSkill: (name: string, token: string) => Promise<Response> = async (name, token) => {
  return await request('/api/candidate/skill', { method: 'POST', body: { name }, headers: { 'Content-Type': 'application/json', 'Authorization': token } })
}





/***
 *  Remove a skill to candidate
***/

// Remove Skill Request
export const removeSkill: (id: string, token: string) => Promise<Response> = async (id, token) => {
  return await request('/api/candidate/skill', { method: 'PUT', body: { id }, headers: { 'Content-Type': 'application/json', 'Authorization': token } })
}





/***
 * Send an application for a job.
***/
export const applyToJob: (jobId: string, token: string) => Promise<Response> = async (jobId, token) => {
  return await request('/api/job/apply', { method: 'POST', body: { jobId }, headers: { Authorization: token, 'Content-Type': 'application/json' }})
}