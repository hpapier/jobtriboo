import fetch from 'isomorphic-unfetch'
import { Cookies } from 'react-cookie'

const cookie = new Cookies();
const serverUrl = "http://localhost:3001";

export const checkAuth = async ctx => {
  let token = null;

  // Server Side
  if (ctx.req) {
    console.log('-> SERVER SIDE AUTH.')
    const tk = ctx.req.headers.cookie.match(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/);
    console.log('tk: ', tk);

    if (tk === null)
      return false;

    token = tk[1];
  }
  // // Client Side 
  else {
    console.log('-> CLIENT SIDE AUTH.')
    token = cookie.get('token');
    console.log('Token: ', token);

    if (token === null)
      return false;
  }

  const res = await fetch(serverUrl + "/api/auth", { method: "GET", headers: { "Authorization": token }});
  if (res.status === 200)
    return true;

  return false;
};