import Header from '../store/container/header'
import { checkAuth } from '../utils/auth'

const Jobs = ({ isLoggedIn }) => {
  return (
    <div>
      <Header isLoggedIn={isLoggedIn} />
      <h1>JOBS PAGE</h1>
    </div>
  );
}

Jobs.getInitialProps = async ctx => {
  const isLoggedIn = await checkAuth(ctx);
  return {
    isLoggedIn,
    namespacesRequired: ['common']
  };
}
export default Jobs;