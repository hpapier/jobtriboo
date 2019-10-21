import fetch from 'isomorphic-unfetch'

const serverURL= "http://localhost:3001";

export const request = async (path, options = null) => {
  try {
    if (options === null)
      return await fetch(serverURL + path);

    const response = await fetch(
      serverURL + path,
      {
        method: options.method,
        body: (options.method !== 'GET') ? JSON.stringify(options.body) : null,
        headers: options.headers
      }
    );
      
    return response;
  } catch (e) {
    throw e;
  }
}