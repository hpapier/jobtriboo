// @module import
import React, { useState } from "react";


// @local import
import './index.css';
import Menu from '../Menu';
import View from './View';


// @component
const ProfilComponent = ({ logInfo }) => {
  const [section, setSection] = useState('informations');
  return (
    <div className='profilcp-root'>
      <Menu section={section} switchSection={setSection} logInfo={logInfo} />
      <View section={section} logInfo={logInfo} />
    </div>
  );
}


// @export
export default ProfilComponent;