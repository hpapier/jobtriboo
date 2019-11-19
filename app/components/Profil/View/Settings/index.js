// @module import
import { useState, useEffect, useRef } from 'react';
import { useCookies } from 'react-cookie';


// @local import
import './index.css';
import { withTranslation } from '../../../i18n';
import CheckBox from '../../../CheckBox';
import { candidateInformationUpdate, getCandidateSettings } from '../../../../utils/request/informations';


// @component
const Settings = ({ t }) => {
  const [loading, setLoading] = useState(true);
  const [loadingError, setLoadingError] = useState(false);
  const [cb, setCb] = useState({});
  const isUnmounted = useRef(false);
  const [cookies, _, __] = useCookies();

  const handleSetCb = ndata => {
    if (!isUnmounted.current)
      setCb({ ...cb, emailOnMsg: ndata });
  };

  const handleGetSettings = async () => {
    if (!isUnmounted.current)
      setLoading(true);

    try {
      const res = await getCandidateSettings(cookies.token);
      if (res.status === 200) {
        const rdata = await res.json();
        console.log(rdata);
        if (!isUnmounted.current) {
          setCb(rdata);
          setLoading(false);
        }
      }
      else 
        throw res.status;
    } catch (e) {
      console.log('-> Settings Component:');
      console.log(e);
      if (!isUnmounted.current) {
        setLoadingError(true)
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    handleGetSettings();
    return () => { isUnmounted.current = true; }
  }, []);

  return (
    <div className='profil-settings-root'>
      <div>
        {
          loading ?
          <div className='settings-loading'>loading</div> :
          <div>
            <CheckBox
              label={t('emailOnMsg')}
              request={ndata => candidateInformationUpdate('/settings', { ...cb, emailOnMsg: ndata }, cookies.token)}
              checked={cb.emailOnMsg}
              setCheckState={ndata => handleSetCb(ndata)}
            />
          </div>
        }
      </div>
    </div>
  );
}


// @export
export default withTranslation('common')(Settings);