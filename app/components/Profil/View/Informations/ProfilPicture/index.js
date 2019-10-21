// @module import
import { useState } from 'react';
import { useCookies } from 'react-cookie';


// @local import
import { withTranslation } from '../../../../i18n';
import ImportIcon from '../../../../../static/assets/import_icon_w.svg';
import './index.css';
import { candidateProfilPictureUpdate } from '../../../../../utils/request/informations';


// @component
const ProfilPicture = ({ link, t, updateLink }) => {
  const [cookies, _, __] = useCookies();
  const [sizeError, setSizeError] = useState(false);

  const handleChange = e => {
    const file = e.target.files[0];

    if (file.size > 2000000) {
      setSizeError(true);
      return;
    }

    setSizeError(false);
    const freader = new FileReader();

    freader.onload = async function(evt) {
      const res = await candidateProfilPictureUpdate(evt.target.result, file.type.replace(/^image\//, ''), cookies.token);
      const { path } = await res.json();
      updateLink(path);
    }

    freader.readAsDataURL(file);
  }

  return (
    <div className='pp-root'>
      <h2 className='pp-title'>{t('picture')}</h2>
      <div className='pp-box'>
        { link !== '' ? <img className='pp-img' src={`http://localhost:3001${link}`} alt='profil-picture' /> : <div className='pp-img'></div>}
        <div className='pp-tbox'>
          <h3 className='pp-tbox-title'>{t('profilPictureBoxTitle')}</h3>
          <p className='pp-tbox-desc'>{t('profilPictureBoxDescription')}</p>
          <div className='pp-tbox-btn'>
            <label className='pp-tbox-btn-import' htmlFor='pp-input-file'>
              <img className='pp-tbox-btn-import-icon' src={ImportIcon} alt='import' />{t('import')}
            </label>
            <input type='file' id='pp-input-file' style={{ display: 'none' }} accept='image/png, image/jpeg' onChange={e => handleChange(e)} />

            <div className='pp-tbox-btn-txt'>
              <p className='pp-tbox-btn-txt-info'>{t('pictureFormat')}</p>
              <p className='pp-tbox-btn-txt-info'>{t('weight')}</p>
            </div>
          </div>
          { sizeError ? <div className='pp-tbox-msg-error'>{t('ppSizeError')}</div> : null }
        </div>
      </div>
    </div>
  );
};


// @export
export default withTranslation('common')(ProfilPicture);