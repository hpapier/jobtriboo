import { request } from '../request';


/***
 * Get the offers with a query.
 * @param data JobsProps
***/

// @interface
interface JobsProps {
  offset: number
  jobtitle: string | null
  location: string | null
  categories: Array<string>
  salaryMin: number
  contractsType: Array<string>
}

// @Request
export const getJobs = async (data: JobsProps): Promise<Response> => {
  return await request('/api/jobs', { method: 'POST', body: { data }, headers: { 'Content-Type': 'application/json' }});
}





/**
 * Get the job for a particular ID.
 * @param publicId string
 */

// @Request
export const getJob = async (publicId: string) => {
  return await request(`/api/job/${publicId}`, { method: 'GET', headers: {} });
}