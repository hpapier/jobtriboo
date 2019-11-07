// @module imports
import React from 'react';


// @local imports
import { checkAuth } from '../utils/auth';
import Navbar from '../components/Navbar';
import { getCompanies } from '../utils/request/companies';
import CompaniesComponent from '../components/Companies';


// @page
const Companies = ({ logInfo, companies }) => {
  return (
    <div>
      <Navbar logInfo={logInfo} />
      <CompaniesComponent data={companies} />

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
  const companiesRes = await getCompanies({ offset: 0, search: '', triboo: '', country: [], size: [] });
  let companies = [];
  if (companiesRes.status === 200)
    companies = await companiesRes.json();

  return {
    logInfo,
    companies,
    namespacesRequired: ['common']
  }
}


// @export
export default Companies;