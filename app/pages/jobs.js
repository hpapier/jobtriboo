// @module imports
import React, { useContext } from 'react';


// @local imports
import { checkAuth } from "../utils/auth";
import Navbar from '../components/Navbar/V2';
import { getJobs } from '../utils/request/jobs';
import JobsComponent from '../components/Jobs/V2';


// @page
const Jobs = ({ logInfo, jobs, initialQueries }) => {
  return (
    <div>
      <Navbar logInfo={logInfo} />
      <JobsComponent count={jobs.count} offers={jobs.announces} initialQueries={initialQueries} />
      <style jsx global>{`
          body {
            padding: 0;
            margin: 0;
            background-color: #f7f9fc !important;
            font-family: Poppins, sans-serif !important;
          }
      `}</style>
    </div>
  );
};


// @request
Jobs.getInitialProps = async (ctx) => {
  console.log('---> CONTEXT <----')
  console.log(ctx);

  const logInfo = await checkAuth(ctx);
  const jobRequest = await getJobs({
    offset: 0,
    jobtitle: ctx.query.jobTitle !== undefined ? ctx.query.jobTitle : null,
    location: ctx.query.jobLocation !== undefined ? ctx.query.jobLocation : null,
    categories: [],
    salaryMin: 0,
    contractsType: []
  });

  return {
    logInfo,
    jobs: await jobRequest.json(),
    initialQueries: {
      jobTitle: ctx.query.jobTitle !== undefined ? ctx.query.jobTitle : null,
      jobLocation: ctx.query.jobLocation !== undefined ? ctx.query.jobLocation : null
    },
    namespacesRequired: ['common']
  }
}


// @export
export default Jobs;