// @module imports
import React from 'react';


// @local imports
import { checkAuth } from '../utils/auth';
import Navbar from '../components/Navbar/V2';
import { getCompanies } from '../utils/request/companies';
import CompaniesComponent from '../components/Companies/V2';


// @page
const Companies = ({ logInfo, companies }) => {
  return (
    <div>
      <Navbar logInfo={logInfo} />
      <CompaniesComponent count={companies.count} companies={companies.data} />

      <style jsx global>{`
          body {
            padding: 0;
            margin: 0;
            background-color: #f7f9fc !important;
            font-family: Poppins, sans-serif !important;
          }
      `}</style>
    </div>
  );
};


// @request
Companies.getInitialProps = async (ctx) => {
  const logInfo = await checkAuth(ctx);
  const companiesRes = await getCompanies({
    offset: 0,
    companyName: '',
    companyLocation: '',
    categories: [],
    size: []
  });

  return {
    logInfo,
    companies:  await companiesRes.json(),
    namespacesRequired: ['common']
  }
}


// @export
export default Companies;