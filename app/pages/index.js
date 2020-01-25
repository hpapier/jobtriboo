// @module import


// @local import
import { checkAuth } from '../utils/auth'
// import Navbar from '../components/Navbar';
// import Home from '../components/Home/Candidate'
import { getSampleData } from '../utils/query'
import { withTranslation } from '../components/i18n';
import HomeV2 from '../components/Home/V2/Candidate';
import NavbarV2 from '../components/Navbar/V2';
import Footer from '../components/Footer';


// @page
const App = ({ logInfo, url }) => {
  return (
    <div>
      {/* <Navbar logInfo={logInfo} /> */}
      {/* <Home data={sampleData} /> */}
      <NavbarV2 url={url} logInfo={logInfo} />
      <HomeV2 job={550} company={49} />
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


// @request
App.getInitialProps = async ctx => {
  const logInfo = await checkAuth(ctx);

  console.log(ctx)
  return {
    logInfo,
    url: ctx.req ? ctx.req.url : ctx.pathname,
    namespacesRequired: ['common']
  };
}


// @export
export default withTranslation('common')(App);