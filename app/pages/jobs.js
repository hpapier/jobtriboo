import Navbar from '../components/Navbar';
import { checkAuth } from '../utils/auth'

const Jobs = ({ logInfo }) => {
  return (
    <div>
      <Navbar logInfo={logInfo} />
      <h1>JOBS PAGE</h1>
    </div>
  );
}

Jobs.getInitialProps = async ctx => {
  const logInfo = await checkAuth(ctx);
  return {
    logInfo,
    namespacesRequired: ['common']
  };
}
export default Jobs;