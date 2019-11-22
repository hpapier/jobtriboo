// @module import
import { useState } from 'react';


// @local import
import './index.css';
import { withTranslation } from '../i18n';
import MenuBar from './MenuBar';
import MenuDropdown from './MenuDropdown';



// @component
const Menu = ({ section, switchSection, t, logInfo }) => {

  const [menuState, setMenuState] = useState(false);

  return (
    <div className='menu-comp-root'>
      <MenuDropdown section={section} switchSection={switchSection} logInfo={logInfo} setMenuState={setMenuState} menuState={menuState} />
      <MenuBar section={section} switchSection={switchSection} logInfo={logInfo} />
    </div>
  );
};


// @export
export default withTranslation('common')(Menu);