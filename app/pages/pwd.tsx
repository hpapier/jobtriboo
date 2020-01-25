// @module import
import React from 'react';


// @local import
import PwdForgot from '../components/Pwd/Forgot';


// @page
const Pwd = () => {
  return (
    <div>
      <PwdForgot />
      <style jsx global>{`
        body {
          padding: 0;
          margin: 0;
          background-color: #fff !important;
          font-family: Poppins, sans-serif !important;
        }
      `}</style>
    </div>
  );
};


Pwd.getInitialProps = ctx => {
  return {
    namespacesRequired: ['common']
  }
};


// @export
export default Pwd;