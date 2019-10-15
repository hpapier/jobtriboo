import Navbar from '../store/container/navbar'
import { checkAuth } from '../utils/auth'

const Jobs = ({ isLoggedIn }) => {
  return (
    <div>
      <Navbar isLoggedIn={isLoggedIn} />
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