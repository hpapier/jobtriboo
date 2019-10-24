// @module import
import { useState } from 'react';
import { useCookies } from 'react-cookie';


// @local import
import { withTranslation } from '../../../../i18n';
import './index.css';
import { candidateDescriptionUpdate } from '../../../../../utils/request/informations'


// @component
const Description = ({ t, data, updateDesc }) => {
  const [description, setDescription] = useState(data);
  const [descState, setDescState] = useState('');
  const [cookies, _, __] = useCookies();

  const handleUpdate = async e => {
    if (description === data)
      return;

    try {
      const res = await candidateDescriptionUpdate(description, cookies.token);
      if (res.status === 200)
        updateDesc(description);
      else
        throw res.status;
    } catch (e) {
      console.log(e);
    }
    
  }

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
          onBlur={e => handleUpdate(e)}
        />
      </div>
    </div>
  );
};


// @export
export default withTranslation('common')(Description);