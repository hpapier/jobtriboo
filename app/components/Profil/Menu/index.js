// @module import
// @local import
import './index.css';
import MenuItem from './MenuItem';
import InformationsIcon from '../../../static/assets/informations_icon_grey.svg';
import MessagesIcon from '../../../static/assets/messages_icon_grey.svg';
import SettingsIcon from '../../../static/assets/settings_icon_grey.svg';
import { withTranslation } from '../../i18n';



// @component
const Menu = ({ section, switchSection, t }) => {
  return (
    <div className='profil-menu-root'>
      <div className='profil-menu-box'>
        <MenuItem label={t('informations')} icon={InformationsIcon} isActive={section === 'informations'} switchSection={() => switchSection('informations')} />
        <MenuItem label={t('messages')} icon={MessagesIcon} isActive={section === 'messages'} switchSection={() => switchSection('messages')} />
        <MenuItem label={t('settings')} icon={SettingsIcon} isActive={section === 'settings'} switchSection={() => switchSection('settings')} />
      </div>
    </div>
  );
};


// @export
export default withTranslation('common')(Menu);