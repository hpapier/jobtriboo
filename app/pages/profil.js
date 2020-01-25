// @module imports
import React from 'react';


// @local imports
import { checkAuth } from "../utils/auth";
// import Navbar from '../components/Navbar';
// import ProfilComponent from '../components/Profil'
import NavbarV2 from '../components/Navbar/V2';
import ProfilComponent from '../components/Profil/V2'


// @page
const Profil = ({ logInfo }) => {
  return (
    <div>
      <ProfilComponent logInfo={logInfo} />

      <style jsx global>{`
          body {
            padding: 0;
            margin: 0;
            background-color: #f7f8fc !important;
            font-family: Poppins, sans-serif !important;
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