// @module imports
import React, { useEffect } from 'react';
import { useRouter } from 'next/router';


// @local imports
import { checkAuth } from "../utils/auth";
import Navbar from '../store/container/navbar'


// @page
const Profil = ({ isLogged }) => {
  return (
    <div>
      <Navbar isLoggedIn={isLogged} />
      Profil page
    </div>
  );
};


// @request
Profil.getInitialProps = async (ctx) => {
  const isLogged = await checkAuth(ctx);
  
  if (!isLogged) {
    if (ctx.res) {
      ctx.res.writeHead(302, { Location: '/' })
      ctx.res.end()
    } else {
      document.location.pathname = '/'
    }
  }

  return {
    isLogged,
    namespacesRequired: ['common']
  }
}


// @export
export default Profil;