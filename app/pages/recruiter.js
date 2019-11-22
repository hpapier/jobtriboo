import Navbar from '../components/Navbar';
import Home from '../components/Home/Recruiter'

import { checkAuth } from '../utils/auth'
import { getSampleData } from '../utils/query'
import { withTranslation } from '../components/i18n'

const App = ({ logInfo, sampleData }) => {
  return (
    <div>
      <Navbar logInfo={logInfo} />
      <Home data={sampleData} />

      <style jsx global>{`
          body {
            padding: 0;
            margin: 0;
            background-color: #f2f3ff !important;
          }
      `}</style>
    </div>
  );
}

App.getInitialProps = async ctx => {
  const logInfo = await checkAuth(ctx);
  const sampleData = await getSampleData();
  return {
    sampleData,
    logInfo,
    namespacesRequired: ['common']
  };
}

export default withTranslation('common')(App);