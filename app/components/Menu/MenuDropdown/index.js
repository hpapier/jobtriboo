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
  const isUnmounted = useRef(false);

  useEffect(() => {
    menuStateRef.current = menuState;
  });

  useEffect(() => {
    const element = document.getElementsByClassName('menu-dropdown-root')[0];
    document.addEventListener('click', e => {
      if (window.innerWidth > 800)
        return;

      const target = e.target;
      let isClickedOutside = true;

      element.childNodes.forEach(item => {
        if (item.className === target.className)
          isClickedOutside = false;
      });

      if (isClickedOutside)
        isClickedOutside =
          element.className !== target.className &&
          target.className !== 'menu-dropdown-box-sw-btn-line-rotated' &&
          target.className !== 'menu-dropdown-box-sw-btn-line';

      if (isClickedOutside && window.innerWidth <= 800)
        if (!isUnmounted.current) setMenuState(false);
    });

    // document.addEventListener('click', e => {
    //   let clickedOutside = true;

    //   e.path.forEach(item => {
    //     if (!clickedOutside)
    //       return;

    //     if (item.className === 'menu-dropdown-root')
    //       clickedOutside = false;
    //   });

    //   if (clickedOutside && menuStateRef.current)
    //     setMenuState(false);
    // });

    return () => {
      document.removeEventListener('click', () => console.log('listener removed'))
      isUnmounted.current = true;
    }
  }, []);

  const handleSwitch = to => {
    if (menuStateRef.current)
      setMenuState(false);

    switchSection(to);
  }

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
            <MenuItem label={t('informations')} icon={InformationsIcon} isActive={section === 'informations'} switchSection={() => handleSwitch('informations')} />
            {/* <MenuItem label={t('messages')} icon={MessagesIcon} isActive={section === 'messages'} switchSection={() => handleSwitch('messages')} /> */}
            <MenuItem label={t('messages')} icon={MessagesIcon} isActive={section === 'messages'} switchSection={() => {}} />
            {/* <MenuItem label={t('settings')} icon={SettingsIcon} isActive={section === 'settings'} switchSection={() => handleSwitch('settings')} /> */}
          </div> :
          <div className='menu-dropdown-box'>
            <MenuItem label={t('companies')} icon={CompaniesIcon} isActive={section === 'companies'} switchSection={() => handleSwitch('companies')} />
            <MenuItem label={t('announces')} icon={AnnouncesIcon} isActive={section === 'announces'} switchSection={() => handleSwitch('announces')} />
            {/* <MenuItem label={t('messages')} icon={MessagesIcon} isActive={section === 'messages'} switchSection={() => handleSwitch('messages')} /> */}
            <MenuItem label={t('messages')} icon={MessagesIcon} isActive={section === 'messages'} switchSection={() => {}} />
            {/* <MenuItem label={t('settings')} icon={SettingsIcon} isActive={section === 'settings'} switchSection={() => handleSwitch('settings')} /> */}
          </div>
        : null
      }
    </div>
  );
};


// @export
export default withTranslation('common')(MenuDropdown);