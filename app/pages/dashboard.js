// @module import
// @local import
import Navbar from '../components/Navbar';
import { checkAuth } from '../utils/auth'
import DashboardComponent from '../components/Dashboard';


// @page
const Dashboard = ({ logInfo }) => {
  return (
    <div>
      <Navbar logInfo={logInfo} />
      <DashboardComponent />
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
Dashboard.getInitialProps = async (ctx) => {
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