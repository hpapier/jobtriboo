import React, { useState } from 'react'

import { Button, TextField, Card, CardContent } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add';
import ClearIcon from '@material-ui/icons/Clear';

import Navbar from '../components/Navbar';
import { checkAuth } from '../utils/auth'

const DashboardBody = () => {
  const [ announceToolStatus, setAnnounceToolStatus ] = useState(false);
  const [ company, setCompany ] = useState('');
  const [ title, setTitle ] = useState('');
  const [ description, setDescription ] = useState('');
  const [ minSalary, setMinSalary ] = useState(20);
  const [ maxSalary, setMaxSalary ] = useState(100);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', margin: 'auto' }}>
      <div style={{ width: 500, display: 'flex', justifyContent: 'space-between', marginTop: 50 }}>
        <h3>No announces yet</h3>
        <Button
          variant='contained'
          style={{ backgroundColor: announceToolStatus ? '#ff4d4d' : '#4ecca3' }}
          onClick={() => setAnnounceToolStatus(!announceToolStatus)}
        >
          Create new announce
          { !announceToolStatus ? <AddIcon /> : <ClearIcon />}
        </Button>
      </div>

      {
        announceToolStatus ?
        <Card style={{ marginTop: 30, width: 1000 }}>
          <CardContent>
            <h2 style={{ margin: 5 }}>Post an announce</h2>
            <div>
              <TextField
                variant="filled"
                label="Company"
                onChange={e => setCompany(e.target.value)}
                value={company}
                style={{ margin: 5 }}
              />

              <TextField
                variant="filled"
                label="Job Title"
                onChange={e => setTitle(e.target.value)}
                value={title}
                style={{ margin: 5 }}
              />

            </div>
            <div>
              <TextField
                variant="filled"
                label="Job Description"
                multiline
                onChange={e => setDescription(e.target.value)}
                value={description}
                style={{ margin: 5 }}
              />
              <TextField
                variant="filled"
                label="Minimum Salary"
                type="number"
                onChange={e => e.target.value <= 15 ? setMinSalary(15) : setMinSalary(e.target.value)}
                value={minSalary}
                style={{ margin: 5 }}
              />
              <TextField
                variant="filled"
                label="Maximum Salary"
                type="number"
                onChange={e => e.target.value <= minSalary ? setMaxSalary(minSalary) : setMaxSalary(e.target.value)}
                value={maxSalary}
                style={{ margin: 5 }}
              />
            </div>
          </CardContent>
        </Card> :
        null
      }
    </div>
  );
};

const Dashboard = ({ logInfo }) => {
  return (
    <div>
      <Navbar logInfo={logInfo} />
      <DashboardBody />
    </div>
  );
};

Dashboard.getInitialProps = async (ctx) => {
  const logInfo = await checkAuth(ctx);
  //.. get current announces
  return {
    logInfo,
    namespacesRequired: ['common']
  };
}

export default Dashboard;