// @module imports
import React from 'react';


// @local imports
import { checkAuth } from "../utils/auth";
import Navbar from '../components/Navbar';


// @page
const Companies = ({ logInfo }) => {
  return (
    <div>
      <Navbar logInfo={logInfo} />
      Companies page

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
Companies.getInitialProps = async (ctx) => {
  const logInfo = await checkAuth(ctx);

  return {
    logInfo,
    namespacesRequired: ['common']
  }
}


// @export
export default Companies;