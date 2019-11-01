// @module import
import { useState, useEffect, useRef } from 'react';


// @local import
import { withTranslation } from '../../../i18n';
import AddIconGrey from '../../../../static/assets/remove_icon_grey.svg'
import NewAnnounces from './NewAnnounces';
import AnnounceItem from './AnnounceItem';
import './index.css';


// @component
const Announces = ({ t }) => {
  const [view, setView] = useState('list');
  const [announces, setAnnounces] = useState([]);
  const isUnmounted = useRef(false);

  const handleGetAnnounces = async () => {

    try {
      const res = await getAnnounces(cookies.token);
    } catch (e) {

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
            { announces.map(item => <AnnounceItem data={item} />) }
          </div>
        ) :
        null
      }

      {
        view === 'new' ?
        (
          <div className='announces-box'>
            <h2 className='announces-title'>{t('newAnnounces')}</h2>
            <NewAnnounces />
          </div>
        ) :
        null
      }
    </div>
  );
};


// @export
export default withTranslation('common')(Announces);