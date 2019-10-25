// @module import
import { useState, useEffect, useRef } from 'react';
import { useCookies } from 'react-cookie';


// @local import
import { withTranslation } from '../../../../i18n';
import './index.css';
import { candidateDescriptionUpdate } from '../../../../../utils/request/informations'


// @component
const Description = ({ t, data, updateDesc }) => {
  const [description, setDescription] = useState(data);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const isUnmounted = useRef(false);
  const [cookies, _, __] = useCookies();

  const handleUpdate = async e => {
    if (description === data) {
      if (!isUnmounted.current && error !== null)
        setError(null)

      return;
    } 

    if (description.length >= 1000) {
      setError('formatError');
      return;
    }

    try {
      if (!isUnmounted.current) {
        setLoading(true);
        if (error !== null)
          setError(null);
      }

      const res = await candidateDescriptionUpdate(description, cookies.token);

      if (res.status === 200)
        updateDesc(description);
      else
        throw 'Unauthorized';

      if (!isUnmounted.current)
        setLoading(false);
    } catch (e) {
      console.log(e);
      if (!isUnmounted.current) {
        setLoading(false);
        setError(500);
      }
    }
    
  }

  useEffect(() => () => { isUnmounted.current = true }, []);

  return (
    <div className='description-root'>
      <h2 className='description-title'>{t('description')}</h2>
      <div className='description-box'>
        <div className='desc-label-box'>
          <h3 className='description-box-label'>{t('descriptionBoxLabel')}</h3>
          { loading ? <div className='desc-loading-el'></div> : null }
        </div>
        <textarea
          disabled={loading}
          className={`description-box-input ${error !== null ? ` -input-error`: ``}`}
          placeholder={t('phDescription')}
          value={description}
          onChange={e => setDescription(e.target.value)}
          onBlur={e => handleUpdate(e)}
        />
        {
          !error !== null ?
          <div className='description-box-error'>
            { error === 'formatError' ? t('tooLong') : '' }
            { error === 500 ? t('error500') : '' }
          </div> :
          null
        }
      </div>
    </div>
  );
};


// @export
export default withTranslation('common')(Description);