import { request } from './request';

export const getSampleData = async () => {
  try {
    const response = await request('/api/sample');
    const data = response.json();
    return data;
  } catch (e) {
    console.log('° GET SAMPLE DATA ERROR:')
    console.log(e);
    return [];
  }
};