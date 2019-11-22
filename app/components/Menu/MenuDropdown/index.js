// @module import
import { useState, useEffect, useRef } from 'react';


// @local import
import MenuItem from '../MenuItem';
import InformationsIcon from '../../../static/assets/informations_icon_grey.svg';
import MessagesIcon from '../../../static/assets/messages_icon_grey.svg';
import SettingsIcon from '../../../static/assets/settings_icon_grey.svg';

import CompaniesIcon from '../../../static/assets/companies_icon_grey.svg'
import AnnouncesIcon from '../../../static/assets/announces_icon_grey.svg'

import { withTranslation } from '../../i18n';
import './index.css';



// @component
const MenuDropdown = ({ section, switchSection, t, logInfo, menuState, setMenuState }) => {

  const rootRef = useRef(null);
  const menuStateRef = useRef(null);

  useEffect(() => {
    menuStateRef.current = menuState;
  });

  useEffect(() => {
    document.addEventListener('click', (e) => {
      let clickedOutside = true;

      e.path.forEach((item) => {
        if (!clickedOutside)
          return;

        if (item.className === 'menu-dropdown-root')
          clickedOutside = false;
      });

      if (clickedOutside && menuStateRef.current)
        setMenuState(false);
    });

    return () => { rootRef.current.removeEventListener('click', () => console.log('listener removed'))}
  }, []);

  return (
    <div className='menu-dropdown-root' ref={rootRef}>

        <button className='menu-dropdown-box-sw-btn' onClick={() => setMenuState(!menuState)}>
            <div className='menu-dropdown-box-sw-btn-line' style={{ display: !menuState ? 'block' : 'none' }}></div>
            <div className='menu-dropdown-box-sw-btn-line' style={{ display: !menuState ? 'block' : 'none' }}></div>
            <div className='menu-dropdown-box-sw-btn-line' style={{ display: !menuState ? 'block' : 'none' }}></div>

            <div className='menu-dropdown-box-sw-btn-line-rotated' id='md-rotation-1' style={{ display: menuState ? 'block' : 'none' }}></div>
            <div className='menu-dropdown-box-sw-btn-line-rotated' id='md-rotation-2' style={{ display: menuState ? 'block' : 'none' }}></div>
        </button>

      {
        menuState ?
          logInfo.userState === 'candidate' ?
          <div className='menu-dropdown-box'>
            <MenuItem label={t('informations')} icon={InformationsIcon} isActive={section === 'informations'} switchSection={() => switchSection('informations')} />
            <MenuItem label={t('messages')} icon={MessagesIcon} isActive={section === 'messages'} switchSection={() => switchSection('messages')} />
            <MenuItem label={t('settings')} icon={SettingsIcon} isActive={section === 'settings'} switchSection={() => switchSection('settings')} />
          </div> :
          <div className='menu-dropdown-box'>
            <MenuItem label={t('companies')} icon={CompaniesIcon} isActive={section === 'companies'} switchSection={() => switchSection('companies')} />
            <MenuItem label={t('announces')} icon={AnnouncesIcon} isActive={section === 'announces'} switchSection={() => switchSection('announces')} />
            <MenuItem label={t('messages')} icon={MessagesIcon} isActive={section === 'messages'} switchSection={() => switchSection('messages')} />
            <MenuItem label={t('settings')} icon={SettingsIcon} isActive={section === 'settings'} switchSection={() => switchSection('settings')} />
          </div>
        : null
      }
    </div>
  );
};


// @export
export default withTranslation('common')(MenuDropdown);