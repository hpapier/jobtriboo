import { request } from '../request';


export const candidateProfilPictureUpdate = async (picture, type, token) => {
  return await request('/api/profil/picture', { method: 'PUT', body: { picture, type }, headers: { 'Authorization': token, 'Content-Type': 'application/json' }});
}

// export const candidateDescriptionUpdate = async ({ description, token }) => {}