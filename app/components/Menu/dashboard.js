// @module import
// @local import
import './index.css';
import MenuItem from './MenuItem';
import CompaniesIcon from '../../static/assets/companies_icon_grey.svg'
import AnnouncesIcon from '../../static/assets/announces_icon_grey.svg'
import MessagesIcon from '../../static/assets/messages_icon_grey.svg';
import SettingsIcon from '../../static/assets/settings_icon_grey.svg';
import { withTranslation } from '../i18n';



// @component
const Menu = ({ section, switchSection, t }) => {
  return (
    <div className='menu-root'>
      <div className='menu-box'>
        <MenuItem label={t('companies')} icon={CompaniesIcon} isActive={section === 'companies'} switchSection={() => switchSection('companies')} />
        <MenuItem label={t('announces')} icon={AnnouncesIcon} isActive={section === 'announces'} switchSection={() => switchSection('announces')} />
        <MenuItem label={t('messages')} icon={MessagesIcon} isActive={section === 'messages'} switchSection={() => switchSection('messages')} />
        <MenuItem label={t('settings')} icon={SettingsIcon} isActive={section === 'settings'} switchSection={() => switchSection('settings')} />
      </div>
    </div>
  );
};


// @export
export default withTranslation('common')(Menu);