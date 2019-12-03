import fetch from 'isomorphic-unfetch'
import { Cookies } from 'react-cookie'
import { serverURL } from './config';

const cookie = new Cookies();

export const checkAuth = async ctx => {
  let token = null;

  // Server Side
  if (ctx.req) {
    console.log('-> SERVER SIDE AUTH.');

    let tk = null;
    if (ctx.req.headers.cookie)
      tk = ctx.req.headers.cookie.match(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/);

    console.log('tk: ', tk);

    if (tk === null || tk === undefined)
      return false;

    token = tk[1];
  }

  // Client Side
  else {
    console.log('-> CLIENT SIDE AUTH.')
    token = cookie.get('token');
    console.log('Token: ', token);

    if (token === null || token === undefined)
      return false;
  }

  try {
    const res = await fetch(serverURL + "/api/auth", { method: "GET", headers: { "Authorization": token }});

    if (res.status === 200) {
      try {
        const data = await res.json();
        return { loggedIn: true, userState: data.userState, userId: data.userId };
      } catch (e) {
        return false;
      }
    }
    else
      return false;

  } catch (e) {
    console.log('==> CHEK AUTH ERROR <==');
    console.log(e);
    return false;
  }
};