// @module import
import React, { useState } from 'react';


// @local import
import './index.css';
import Informations from './Informations';
// import Messages from '../Messages';
// import Settings from '../Settings';
import Menu from '../../Menu';


// @interface
interface ComponentProps {
  logInfo: Object
}


// @component
const Profil: (props: ComponentProps) => JSX.Element = ({ logInfo })  => {
  console.log(logInfo);

  const [pageState, setPageState] = useState('informations');

  return (
    <div id='profil-root'>
      <Menu section={pageState} switchSection={setPageState} logInfo={logInfo} />

      <div id='pr-pages'>
        { pageState === 'informations' ? <Informations />  : null }
        {/* { pageState === 'messages'     ? <Messages />      : null }
        { pageState === 'settings'     ? <Settings />      : null } */}
      </div>
    </div>
  );
}


// @export
export default Profil;