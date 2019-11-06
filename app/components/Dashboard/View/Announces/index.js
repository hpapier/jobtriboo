// @module import
import { useState, useEffect, useRef } from 'react';
import { useCookies } from 'react-cookie';


// @local import
import { withTranslation } from '../../../i18n';
import AddIconGrey from '../../../../static/assets/remove_icon_grey.svg'
import NewAnnounces from './NewAnnounces';
import AnnounceItem from './AnnounceItem';
import { getRecruiterAnnounces } from '../../../../utils/request/announces';
import './index.css';


// @component
const Announces = ({ t }) => {
  const [view, setView] = useState('list');
  const [announces, setAnnounces] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);
  const [cookies, _, __] = useCookies();
  const isUnmounted = useRef(false);

  const handleGetAnnounces = async () => {
    if (!isUnmounted.current)
      setLoading(true);

    try {
      const res = await getRecruiterAnnounces(cookies.token);
      if (res.status === 200) {
        const data = await res.json();
        if (!isUnmounted.current) {
          setAnnounces(data);
          setLoading(false);
          setError(null);
        }
      } else
        throw res.status;
    } catch (e) {
      console.log(e);
      if (!isUnmounted.current) {
        setLoading(false);
        setError(500);
      }
    }
  }


  useEffect(() => {
    isUnmounted.current = false;
    handleGetAnnounces();
    return () => { isUnmounted.current = true };
  }, []);


  return (
    <div className='announces-root'>
      {
        view === 'list' ?
        (
          <div className='announces-box'>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <h2 className='announces-title'>{t('myAnnounces')} ({announces.length})</h2>
              <button className='announces-create-btn' onClick={() => setView('new')}>
                {t('createAnnounces')}
                <img src={AddIconGrey} className='announces-create-btn-icon' alt='plus-icon' />
              </button>
            </div>
            {
              announces.length === 0 ?
              <div className='announces-empty'>{t('noAnnouncesYet')}</div> :
              announces.map((item, index) => 
                <AnnounceItem
                  data={item}
                  key={index}
                  updateData={ddata => {
                    const ndata = announces.filter(item => item._id !== ddata);
                    setAnnounces(ndata);
                  }}
                />
              ) 
            }
            { error !== null ? <div className='announces-box-error-msg'>{t('error500')}</div> : null }
            { loading ? <div className='announces-loading'></div> : null }
          </div>
        ) :
        null
      }

      {
        view === 'new' ?
        (
          <div className='announces-box'>
            <h2 className='announces-title'>{t('newAnnounces')}</h2>
            <NewAnnounces changeView={() => setView('list')} addAnnounce={newAnnounce => setAnnounces([...announces, newAnnounce])} />
          </div>
        ) :
        null
      }
    </div>
  );
};


// @export
export default withTranslation('common')(Announces);