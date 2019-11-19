// @module import
import React, { useState } from "react";


// @local import
import './index.css';
import Menu from '../Menu/profil';
import View from './View';


// @component
const ProfilComponent = ({ logInfo }) => {
  const [section, setSection] = useState('informations');
  return (
    <div className='profilcp-root'>
      <Menu section={section} switchSection={setSection} />
      <View section={section} logInfo={logInfo} />
    </div>
  );
}


// @export
export default ProfilComponent;