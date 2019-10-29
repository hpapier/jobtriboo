// @module import
import { useState } from 'react';


// @local import
import './index.css';
import MenuDashboard from '../Menu/dashboard';
import View from './View';


// @component
const Dashboard = () => {
  const [section, setSection] = useState('companies');
  return (
    <div className='dashb-root'>
      <MenuDashboard section={section} switchSection={setSection} />
      <View section={section} />
    </div>
  );
}


// @export
export default Dashboard;