import { checkAuth } from '../../utils/auth';
import { getJob } from '../../utils/request/jobs';
import Navbar from '../../components/Navbar';
import JobComponent from '../../components/Job';


const Job = ({ job, logInfo }) => {

  return (
    <div>
      <Navbar logInfo={logInfo} />
      <JobComponent data={job} logInfo={logInfo} />

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

Job.getInitialProps = async (ctx) => {
  const logInfo = await checkAuth(ctx);
  const fetchJob = await getJob(ctx.query.publicId);
  let job = null;

  if (fetchJob.status === 200) {
    job = await fetchJob.json();
    console.log(job);
  }

  if (job === null) {
    if (ctx.res) {
      ctx.res.writeHead(302, { Location: '/jobs' })
      ctx.res.end()
    } else {
      document.location.pathname = '/jobs'
    }
  }

  return {
    logInfo,
    job,
    namespacesRequired: ['common']
  }
}

export default Job;