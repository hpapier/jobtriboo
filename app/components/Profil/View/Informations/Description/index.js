// @module import
// @local import
import { withTranslation } from '../../../../i18n';
import './index.css';
import { useState } from 'react';


// @component
const Description = ({ t, data }) => {
  const [description, setDescription] = useState(data);
  return (
    <div className='description-root'>
      <h2 className='description-title'>{t('description')}</h2>
      <div className='description-box'>
        <h3 className='description-box-label'>{t('descriptionBoxLabel')}</h3>
        <textarea
          className='description-box-input'
          placeholder={t('phDescription')}
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
      </div>
    </div>
  );
};


// @export
export default withTranslation('common')(Description);