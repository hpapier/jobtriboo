// @module import
// @local import
import { withTranslation } from '../../../../i18n';
import './index.css';
import ImportIcon from '../../../../../static/assets/import_icon_w.svg';


// @component
const ProfilPicture = ({ link, t }) => {
  return (
    <div className='pp-root'>
      <h2 className='pp-title'>{t('picture')}</h2>
      <div className='pp-box'>
        { link !== '' ? <img className='pp-img' src={link} alt='profil-picture' /> : <div className='pp-img'></div>}
        <div className='pp-tbox'>
          <h3 className='pp-tbox-title'>{t('profilPictureBoxTitle')}</h3>
          <p className='pp-tbox-desc'>{t('profilPictureBoxDescription')}</p>
          <div className='pp-tbox-btn'>
            <button className='pp-tbox-btn-import'>
              <img className='pp-tbox-btn-import-icon' src={ImportIcon} alt='import' />{t('import')}
            </button>
            <div className='pp-tbox-btn-txt'>
              <p className='pp-tbox-btn-txt-info'>{t('pictureFormat')}</p>
              <p className='pp-tbox-btn-txt-info'>{t('weight')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


// @export
export default withTranslation('common')(ProfilPicture);