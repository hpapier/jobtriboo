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

      <style jsx global>{`
          body {
            padding: 0;
            margin: 0;
            background-color: #f2f3ff !important;
          }
      `}</style>
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
  else if (logInfo.userState === 'recruiter') {
    if (ctx.res) {
      ctx.res.writeHead(302, { Location: '/dashboard' })
      ctx.res.end()
    } else {
      document.location.pathname = '/dashboard'
    }
  }

  return {
    logInfo,
    namespacesRequired: ['common']
  }
}


// @export
export default Profil;