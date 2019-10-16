// @module imports
import React, { useEffect } from 'react';
import { useRouter } from 'next/router';


// @local imports
import { checkAuth } from "../utils/auth";
import Navbar from '../components/Navbar';


// @page
const Profil = ({ logInfo }) => {
  return (
    <div>
      <Navbar logInfo={logInfo} />
      Profil page
    </div>
  );
};


// @request
Profil.getInitialProps = async (ctx) => {
  const logInfo = await checkAuth(ctx);

  if (!logInfo) {
    if (ctx.res) {
      ctx.res.writeHead(302, { Location: '/' })
      ctx.res.end()
    } else {
      document.location.pathname = '/'
    }
  }

  return {
    logInfo,
    namespacesRequired: ['common']
  }
}


// @export
export default Profil;