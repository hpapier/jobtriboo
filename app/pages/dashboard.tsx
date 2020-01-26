// @module import
import { NextPageContext, NextPage } from 'next';


// @local import
import { checkAuth } from '../utils/auth'
import DashboardComponent from '../components/Dashboard/V2';
import Head from 'next/head';


// @page
const Dashboard = ({ logInfo }) => {
  return (
    <div>
      <Head>
        <script src="https://js.stripe.com/v3/"></script>
        <link rel="stylesheet" href="/static/styles/MyCardElement.css" />
        {/* <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBj8ShCN6Y0-YtKPtlR6bwxcHvXjaGiOds&libraries=places"></script> */}
      </Head>

      <DashboardComponent logInfo={logInfo} />
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
Dashboard.getInitialProps = async (ctx: NextPageContext) => {
  const logInfo = await checkAuth(ctx);

  if (!logInfo) {
    if (ctx.res) {
      ctx.res.writeHead(302, { Location: '/' })
      ctx.res.end()
    } else {
      document.location.pathname = '/'
    }
  }
  else if (logInfo.userState === 'candidate') {
    if (ctx.res) {
      ctx.res.writeHead(302, { Location: '/profil' })
      ctx.res.end()
    } else {
      document.location.pathname = '/profil'
    }
  }

  return {
    logInfo,
    namespacesRequired: ['common']
  };
}


// export
export default Dashboard;