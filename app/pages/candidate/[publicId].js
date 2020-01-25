// @module import

// @local import
import { checkAuth } from '../../utils/auth';
import { getCandidate } from '../../utils/request/candidate';
import Navbar from '../../components/Navbar/V2';
import CandidateComponent from '../../components/Candidate';


// @pages
const Candidate = ({ logInfo, candidate }) => {
  return (
    <div>
      <Navbar logInfo={logInfo} />
      <CandidateComponent data={candidate} />

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
};


Candidate.getInitialProps = async ctx => {
  const logInfo = await checkAuth(ctx);
  const fetchCandidate = await getCandidate(ctx.query.publicId);

  let candidate = null;

  if (fetchCandidate.status === 200)
    candidate = await fetchCandidate.json();

  if (candidate === null) {
    if (ctx.res) {
      ctx.res.writeHead(302, { Location: '/' })
      ctx.res.end()
    } else {
      document.location.pathname = '/'
    }
  }

  return {
    logInfo,
    candidate,
    namespacesRequired: ['common']
  }
}


// @export
export default Candidate;
