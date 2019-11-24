// @module import
import { useState } from 'react';


// @local import
import './index.css';
import MenuDashboard from '../Menu';
import View from './View';


// @component
const Dashboard = ({ logInfo }) => {
  const [section, setSection] = useState('companies');

  return (
    <div className='dashb-root'>
      <MenuDashboard section={section} switchSection={setSection} logInfo={logInfo} />
      <View logInfo={logInfo} section={section} />
    </div>
  );
}


// @export
export default Dashboard;