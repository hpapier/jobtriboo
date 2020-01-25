// @module import
import React, { useState } from 'react';


// @local import
import './index.css';
import Menu from '../../Menu';
import Companies from './Companies';
import Announces from './Announces';


// @interface
interface ComponentProps {
  logInfo: {
    userState: string,
    loggedIn: boolean,
    userId: string
  }
}


// @component
const Dashboard: (props: ComponentProps) => JSX.Element = ({ logInfo }) => {
  console.log(logInfo)
  const [section, setSection] = useState('companies');

  return (
    <div id='dashboard-root'>
      <Menu logInfo={logInfo} section={section} switchSection={setSection} />

      <div id='dr-pages'>
        { section === 'companies' ? <Companies /> : null }
        { section === 'announces' ? <Announces /> : null }
      </div>
    </div>
  );
}


// @export
export default Dashboard;
