// @module imports
import React from 'react';


// @local imports
import { checkAuth } from "../utils/auth";
import Navbar from '../components/Navbar';
import { getJobs } from '../utils/request/jobs';
import JobsComponent from '../components/Jobs';


// @page
const Jobs = ({ logInfo, jobs }) => {
  return (
    <div>
      <Navbar logInfo={logInfo} />
      <JobsComponent data={jobs} />
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
Jobs.getInitialProps = async (ctx) => {
  const logInfo = await checkAuth(ctx);
  const jobRequest = await getJobs({ offset: 0, search: '', triboo: '', contractsType: { internship: false, cdd: false, cdi: false, contractor: false }, location: [], salary: { min: 0, max: 1000 }});
  const jobs = await jobRequest.json();

  return {
    logInfo,
    jobs,
    namespacesRequired: ['common']
  }
}


// @export
export default Jobs;