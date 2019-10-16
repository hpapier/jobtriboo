// @module import
import React, { useState } from "react";


// @local import
import './index.css';
import Menu from './Menu';
import View from './View';


// @component
const ProfilComponent = () => {
  const [section, setSection] = useState('informations');
  return (
    <div className='profilcp-root'>
      <Menu section={section} switchSection={setSection} />
      <View section={section} />
    </div>
  );
}


// @export
export default ProfilComponent;