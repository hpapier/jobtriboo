// import Navbar from '../components/Navbar';
// import Home from '../components/Home/Recruiter'

import { checkAuth } from '../utils/auth';
import { getSampleData } from '../utils/query';
import { withTranslation } from '../components/i18n';


import NavbarV2 from '../components/Navbar/V2';
import HomeRecruiter from '../components/Home/V2/Recruiter';
import Footer from '../components/Footer';


const App = ({ logInfo, url }) => {
  return (
    <div>
      {/* <Navbar logInfo={logInfo} />
      <Home data={sampleData} /> */}
      <NavbarV2 logInfo={logInfo} url={url} />
      <HomeRecruiter logInfo={logInfo} />
      <Footer />

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
}

App.getInitialProps = async ctx => {
  const logInfo = await checkAuth(ctx);
  // const sampleData = await getSampleData();
  return {
    // sampleData,
    logInfo,
    url: ctx.req ? ctx.req.url : ctx.pathname,
    namespacesRequired: ['common']
  };
}

export default withTranslation('common')(App);