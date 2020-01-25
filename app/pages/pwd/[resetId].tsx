// @module import
import React from 'react';


// @local import
import PwdReset from '../../components/Pwd/Reset';
// import { NextPageContext } from 'next';


// @page
const PwdRst = () => {
  return (
    <div>
      <PwdReset />
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


PwdRst.getInitialProps = ctx => {
  console.log(ctx);
  return {
    namespacesRequired: ['common']
  }
};


// @export
export default PwdRst;