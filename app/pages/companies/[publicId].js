// @module import 

// @local import
import { checkAuth } from '../../utils/auth';
import { getCompany } from '../../utils/request/companies';
import Navbar from '../../components/Navbar';
import CompanyComponent from '../../components/Company';


// @pages
const Company = ({ logInfo, company }) => {
  return (
    <div>
      <Navbar logInfo={logInfo} />
      <CompanyComponent data={company} />

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


Company.getInitialProps = async ctx => {
  const logInfo = await checkAuth(ctx);
  const fetchCompany = await getCompany(ctx.query.publicId);
  let company = null;

  if (fetchCompany.status === 200)
    company = await fetchCompany.json();

  if (company === null) {
    if (ctx.res) {
      ctx.res.writeHead(302, { Location: '/companies' })
      ctx.res.end()
    } else {
      document.location.pathname = '/companies'
    }
  }

  return {
    logInfo,
    company,
    namespacesRequired: ['common']
  }
}


// @export
export default Company;
