// @module import
import { useRouter } from 'next/router';


// @local import
import MenuItem from '../MenuItem';
import InformationsIcon from '../../../static/assets/informations_icon_grey.svg';
import MessagesIcon from '../../../static/assets/messages_icon_grey.svg';
import SettingsIcon from '../../../static/assets/settings_icon_grey.svg';

import CompaniesIcon from '../../../static/assets/companies_icon_grey.svg'
import AnnouncesIcon from '../../../static/assets/announces_icon_grey.svg'

import ArrowIcon from '../../../static/assets/arrow-right-icon_white.svg';

import { withTranslation } from '../../i18n';
import './index.css';



// @component
const MenuBar = ({ section, switchSection, t, logInfo }) => {
  const router = useRouter();

  return (
    <div className='menu-bar-root'>
      <h1 id='mbr-logo' onClick={() => router.push('/')}>Jobtriboo</h1>
      <div className='mbr-line'></div>

      {
        logInfo.userState === 'candidate' ?
        <div className='menu-bar-box'>
          <MenuItem label={t('informations')} icon={InformationsIcon} isActive={section === 'informations'} switchSection={() => switchSection('informations')} />
          {/* <MenuItem label={t('messages')}     icon={MessagesIcon}     isActive={section === 'messages'}     switchSection={() => switchSection('messages')}     /> */}
          <MenuItem label={t('messages')}   icon={MessagesIcon}   isActive={section === 'messages'}   switchSection={() => null}   />
          {/* <MenuItem label={t('settings')}     icon={SettingsIcon}     isActive={section === 'settings'}     switchSection={() => switchSection('settings')}     /> */}
        </div> :
        <div className='menu-bar-box'>
          <MenuItem label={t('companies')}  icon={CompaniesIcon}  isActive={section === 'companies'}  switchSection={() => switchSection('companies')}  />
          <MenuItem label={t('announces')}  icon={AnnouncesIcon}  isActive={section === 'announces'}  switchSection={() => switchSection('announces')}  />
          {/* <MenuItem label={t('messages')}   icon={MessagesIcon}   isActive={section === 'messages'}   switchSection={() => switchSection('messages')}   /> */}
          <MenuItem label={t('messages')}   icon={MessagesIcon}   isActive={section === 'messages'}   switchSection={() => null}   />
          {/* <MenuItem label={t('settings')}   icon={SettingsIcon}   isActive={section === 'settings'}   switchSection={() => switchSection('settings')}   /> */}
        </div>
      }

      {
        logInfo.userState === 'candidate' ?
        <>
          <div className='mbr-line'></div>
          <button id='mbr-view-jobs' onClick={() => router.push('/jobs')}>
            <h4 id='mbrvj-txt'>{t('findAJob')}</h4>
            <img src={ArrowIcon} alt='' id='mbrvj-icon'/>
          </button>
        </> :
        null
      }
    </div>
  );
};


// @export
export default withTranslation('common')(MenuBar);