import Navbar from '../store/container/navbar'
import Home from '../components/homeRecruiter'

import { checkAuth } from '../utils/auth'
import { getSampleData } from '../utils/query'
import { withTranslation } from '../components/i18n'

const App = ({ isLoggedIn, sampleData }) => {
  return (
    <div>
      <Navbar isLoggedIn={isLoggedIn} />
      <Home data={sampleData} />

      <style jsx global>{`
          body {
            padding: 0;
            margin: 0;
          }
      `}</style>
    </div>
  );
}

App.getInitialProps = async ctx => {
  const isLoggedIn = await checkAuth(ctx);
  const sampleData = await getSampleData();
  return {
    sampleData,
    isLoggedIn,
    namespacesRequired: ['common']
  };
}

export default withTranslation('common')(App);