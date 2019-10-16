// @module imports
import React from 'react';


// @local imports
import { checkAuth } from "../utils/auth";
import Navbar from '../components/Navbar';
import ProfilComponent from '../components/Profil'


// @page
const Profil = ({ logInfo }) => {
  return (
    <div>
      <Navbar logInfo={logInfo} />
      <ProfilComponent />

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