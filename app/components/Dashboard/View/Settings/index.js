// @module import
import { useEffect, useState, useRef } from 'react';
import { useCookies } from 'react-cookie';


// @local import
import { withTranslation } from '../../../i18n';
import { fetchSettings, updateSetting } from '../../../../utils/request/settings';
import { fetchCards, deleteCard } from '../../../../utils/request/card';
import Cards from '../../../Card';
import CheckBox from '../../../CheckBox';
import RemoveIconGrey from '../../../../static/assets/remove_icon_grey.svg';
import './index.css';


// @component
const Settings = ({ t }) => {

  /* Settings state. */
  const [settings, setSettings] = useState({});
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [settingsError, setSettingsError] = useState(false);


  /* Cards state. */
  const [cards, setCards] = useState([]);
  const [cardsLoading, setCardsLoading] = useState(true);
  const [cardsError, setCardsError] = useState(false);
  const [cardsView, setCardsView] = useState('list');


  /* Component and user informations. */
  const [cookies, _, __] = useCookies();
  const isUnmounted = useRef(false);


  /* Fetching settings front mechanism */
  const getSettings = async () => {
    if (!isUnmounted.current) {
      setSettingsLoading(true);
      setSettingsError(false);
    }

    try {

      const res = await fetchSettings('recruiter', cookies.token);
      if (res.status === 200) {
        const data = await res.json();
        if (!isUnmounted.current) {
          setSettings(data);
          setSettingsLoading(false);
        }
      }
      else
        throw res.status;

    } catch (e) {

      console.log(e);
      if (!isUnmounted.current) {
        setSettingsError(true);
        setSettingsLoading(false);
      }

    }
  }


  /* Fetching cards front mechanism */
  const getCards = async () => {
    if (!isUnmounted.current) {
      setCardsLoading(true);
      setCardsError(false);
    }

    try {

      const res = await fetchCards(cookies.token);
      if (res.status === 200) {
        const data = await res.json();
        if (!isUnmounted.current) {
          setCards(data);
          setCardsLoading(false);
        }
      }
      else
        throw res.status;

    } catch (e) {

      console.log(e);
      if (!isUnmounted.current) {
        setCardsError(true);
        setCardsLoading(false);
      }

    }
  }


  const convertMonthStringToIntFormated = month => {
    let number = 1;

    (month === 'january')   ? number === 1  : null;
    (month === 'february')  ? number === 2  : null;
    (month === 'march')     ? number === 3  : null;
    (month === 'april')     ? number === 4  : null;
    (month === 'may')       ? number === 5  : null;
    (month === 'june')      ? number === 6  : null;
    (month === 'july')      ? number === 7  : null;
    (month === 'august')    ? number === 8  : null;
    (month === 'september') ? number === 9  : null;
    (month === 'october')   ? number === 10 : null;
    (month === 'november')  ? number === 11 : null;
    (month === 'december')  ? number === 12 : null;

    return (number < 10 ? '0' + number : number);
  };


  /* Fetch recruiter settings and cards info on component mount. */
  useEffect(() => {
    getSettings();
    getCards();
    return () => { isUnmounted.current = true }
  }, []);


  const handleDeleteCard = async item => {
    try {
      const res = await deleteCard(item, cookies.token);
      if (res.status === 204)
        setCards(cards.filter(el => el._id !== item._id));
      else
        throw res.status;
    } catch (e) {
      console.log(e);
    }
  }


  const handleNewCard = ndata => {
    setCards([ ...cards, ndata]);
    setCardsView('list');
  }


  /* Display informations. */
  return (
    <div className='settings-root'>
      <div className='settings-box'>
        <h2 className='settings-label'>{t('settings')}</h2>
        <div className='settings-cb-box'>
          {
            settingsLoading ?
            <div className='settings-loading'></div> :
            <div>
              <CheckBox
                label={t('emailOnMsg')}
                request={async nvalue => await updateSetting({ ...settings, emailOnMsg: nvalue }, cookies.token)}
                checked={settings.emailOnMsg}
                setCheckState={nvalue => setSettings({ ...settings, emailOnMsg: nvalue })}
              />
            </div>
          }
        </div>
      </div>

      {/* <div className='settings-box'>
        <div className='settings-box-head'>
          <h2 className='settings-label'>{t('cards')}</h2>
          <button className='settings-cards-add-btn' onClick={() => setCardsView(cardsView === 'add' ? 'list' : 'add')}>
            { cardsView === 'add' ? t('cancel') : t('createNewCard') }
            <img src={RemoveIconGrey} alt='icon' className={cardsView !== 'add' ? 'icon-add' : 'icon-remove'} />
          </button>
        </div>
        {
          cardsLoading ?
          <div className='settings-loading'></div> :
            cardsView === 'add' ?
            <div className='add-card-view-box'>
              <Cards setCard={ndata => handleNewCard(ndata)} selectedCard={null} error={null} strictMode={true} />
            </div> :
              cards.length === 0 ?
              <div className='settings-empty-txt'>{t('noCardsCreatedYet')}</div> :
              <div className='settings-cards-list-box'>
                {
                  cards.map((item, index) =>
                    <div key={index} className='settings-cards-item'>
                      <button className='delete-cards-btn' onClick={() => handleDeleteCard(item)}>
                        <img src={RemoveIconGrey} alt='removeIcon' />
                      </button>
                      <p style={{ fontSize: '1.2em', marginTop: '20px' }} className='settings-cards-item-text'>{item.alias}</p>
                      <p style={{ marginTop: '5px', opacity: 0.5 }} className='settings-cards-item-text'>{item.number}</p>
                      <div style={{ marginTop: '15px' }} className='settings-cards-item-subbox'>
                        <p className='settings-cards-item-text'>{item.fullName}</p>
                        <p className='settings-cards-item-text'>{convertMonthStringToIntFormated(item.month)}/{item.year}</p>
                      </div>
                    </div>
                  )
                }
              </div>
        }
      </div> */}
    </div>
  );
};


// @export
export default withTranslation('common')(Settings);