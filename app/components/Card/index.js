// @module import
import { useState, useEffect, useRef } from 'react';
import { useCookies } from 'react-cookie';


// @local import
import './index.css';
import DropdownIconGrey from '../../static/assets/bottom_arrow_icon.svg';
import { withTranslation } from '../i18n';
import { addNewCard, fetchCards } from '../../utils/request/card';
import { handleInputInt, handleInputMonth, handleInputText } from '../../utils/input';


// @component
const Card = ({ t, setCard, selectedCard, error, strictMode = false, width = '100%'}) => {

  // View, Unmounted, Cookies: State
  const [vstate, setVstate] = useState(true);
  const [cookies, _, __] = useCookies();
  const isUnmounted = useRef(false);

  // Add Card: State
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState({
    alias: false,
    number: false,
    fullName: false,
    CVC: false
  });
  const [addErrorReq, setAddErrorReq] = useState(null);

  const [alias, setAlias] = useState('');
  const [number, setNumber] = useState('');
  const [fullName, setFullName] = useState('');
  const [CVC, setCVC] = useState('');

  const [list, setList] = useState([]);

  const [monthOpened, setMonthOpened] = useState(false);
  const [yearOpened, setYearOpened] = useState(false);
  const [year, setYear] = useState(null);
  const [month, setMonth] = useState(null);
  const [listOpened, setListOpened] = useState(false);


  const listMonth = [
    { value: 'january', label: t('january') },
    { value: 'february', label: t('february') },
    { value: 'march', label: t('march') },
    { value: 'april', label: t('april') },
    { value: 'may', label: t('may') },
    { value: 'june', label: t('june') },
    { value: 'july', label: t('july') },
    { value: 'august', label: t('august') },
    { value: 'september', label: t('september') },
    { value: 'october', label: t('october') },
    { value: 'november', label: t('november') },
    { value: 'december', label: t('december') }
  ];

  const yearList = () => {
    let yearArray = [];
    for (let i = 2019; i < 2050; i++)
      yearArray.push(i);

    return yearArray;
  }

  const handleYearSelection = value => {
    setYear(value);
    setYearOpened(false);
  }

  const handleMonthSelection = value => {
    setMonth(value);
    setMonthOpened(false);
  }

  const newCardCheckInput = () => {
    let NOE = {
      alias: false,
      number: false,
      fullName: false,
      month: false,
      year: false,
      CVC: false
    };

    (!handleInputText(alias)) ? NOE.alias = true : null ;
    (!handleInputInt(number, 10000000000000000000, 1000000000)) ? NOE.number = true : null ;
    (!handleInputText(fullName)) ? NOE.fullName = true : null ;
    (!handleInputInt(CVC, 999, 100)) ? NOE.CVC = true : null ;
    (!handleInputMonth(month)) ? NOE.month = true : null ;
    (year !== null && year > 2018) ? null : NOE.year = true;

    if (NOE.alias || NOE.number || NOE.fullName || NOE.month || NOE.year || NOE.CVC) {
      if (!isUnmounted.current)
        setAddError(NOE);

      return false;
    }

    return true;
  }

  const handleChangeVState = (value) => {
    if (listOpened)
      !isUnmounted.current ? setListOpened(false) : null;
    if (monthOpened)
      !isUnmounted.current ? setMonthOpened(false) : null;
    if (yearOpened)
      !isUnmounted.current ? setYearOpened(false) : null;

    setVstate(value);
    return;
  }

  const handleAddNewCard = async e => {
    e.preventDefault();

    // Need to check all the new card input before sending..
    if (!newCardCheckInput())
      return;

    if (!isUnmounted.current) {
      setAddLoading(true);
      setAddError({ alias: false, number: false, fullName: false, month: false, year: false, CVC: false })
      setAddErrorReq(null);
    }

    try {
      const res = await addNewCard({ alias, number, fullName, month, year, CVC }, cookies.token);
      if (res.status === 200) {
        const rdata = await res.json();

        if (rdata.state === 'alreadyExist') {
          if (!isUnmounted.current)
            setAddErrorReq('CARD_EXIST');
        }
        else if (rdata.state === 'created') {
          if (!isUnmounted.current) {
            setCard(rdata.data[rdata.data.length - 1]);
            !strictMode ? setVstate('card') : null;
          }
        } else
          throw res.status;

        if (!isUnmounted.current) {
          setAddLoading(false);
        }
      }
    } catch (e) {
      console.log(e);
      if (!isUnmounted.current) {
        setAddLoading(false);
        setAddError(500);
      }
    }

    return;
  }


  const handleCardSelection = item => {
    setCard(item);
    setListOpened(false);
  }


  const getMonthLabel = () => {
    const m = listMonth.filter(item => month === item.value);
    return m[0].label;
  }


  const handleGettingCards = async () => {
    try {
      const res = await fetchCards(cookies.token);
      if (res.status === 200) {
        const rdata = await res.json();
        setList(rdata);
      }
      else
        throw res.status;

    } catch (e) {
      console.log(e)
    }
  }


  useEffect(() => {
    handleGettingCards();
    return () => { isUnmounted.current = true };
  }, []);


  return (
    <div className='card-root' style={{ width }}>
      {
        !strictMode ?
        <div className='card-label-box'>
          <h2 className='card-label'>{t('card')}</h2>
          <button disabled={addLoading && !vstate} className='card-view-btn' onClick={() => handleChangeVState(!vstate)}>{vstate ? t('newCard') : t('cancel')}</button>
        </div> :
        null
      }

      {
        vstate && !strictMode

        ?

        <div className='card-box'>
          <button type='button' className={`card-btn-select ${error ? `-input-error` : ``}`} onClick={() => setListOpened(!listOpened)}>
            {selectedCard === null ? t('phCard') : selectedCard.alias}
            <img src={DropdownIconGrey} alt='dropdown-icon' className={listOpened ? '-rotated' : ''} />
          </button>
          {
            listOpened ?
            <div className='card-input-list'>
              {list.length === 0 ? <div className='card-empty-list'>{t('listCardEmpty')}</div> : null }
              {list.map((item, index) => <div key={index} className='card-input-list-item' onClick={() => handleCardSelection(item)}>{item.alias}</div>)}
            </div> :
            null
          }
        </div>

        :

        <form className='card-box' onSubmit={handleAddNewCard} className='card-input-form'>
          <input
            autoComplete='new-alias'
            className={`card-input ${addError.alias ? ` -input-error` : ``}`}
            type='text'
            placeholder={t('phCardAlias')}
            value={alias}
            onChange={e => setAlias(e.target.value)}
            disabled={addLoading}
          />
          <input
            autoComplete='new-number'
            className={`card-input ${addError.number ? ` -input-error` : ``}`}
            type='text'
            placeholder={t('phCardNumber')}
            value={number}
            onChange={e => setNumber(e.target.value)}
            disabled={addLoading}
          />
          <input
            autoComplete='new-full-name'
            className={`card-input ${addError.fullName ? ` -input-error` : ``}`}
            type='text'
            placeholder={t('phCardFullName')}
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            disabled={addLoading}
          />

          <div className='card-date-box'>

            <div className='card-date-box-mid'>
              <button disabled={addLoading} type='button' className={`card-btn-select ${addError.alias ? ` -input-error` : ``}`} onClick={() => setMonthOpened(!monthOpened)}>
                {month === null ? t('cardMonth') : getMonthLabel()}
                <img src={DropdownIconGrey} alt='dropdown-icon' className={monthOpened ? '-rotated' : ''} />
              </button>
              {monthOpened ? <div className='card-input-list'>{listMonth.map((item, index) => <div key={index} className='card-input-list-item' onClick={() => handleMonthSelection(item.value)}>{item.label}</div>)}</div> : null}
            </div>

            <div className='card-date-box-mid'>
              <button disabled={addLoading} type='button' className={`card-btn-select ${addError.alias ? ` -input-error` : ``}`} onClick={() => setYearOpened(!yearOpened)}>
                {year === null ? t('cardYear') : year}
                <img src={DropdownIconGrey} alt='dropdown-icon' className={yearOpened ? '-rotated' : ''}/>
              </button>
              { yearOpened ? <div className='card-input-list'>{yearList().map((item, index) => <div key={index}className='card-input-list-item'  onClick={() => handleYearSelection(item)}>{item}</div>)}</div> : null }
            </div>

          </div>

          <input
            className={`card-input ${addError.CVC ? ` -input-error` : ``}`}
            type='password'
            autoComplete='new-password'
            placeholder={t('CVC')}
            value={CVC}
            onChange={e => setCVC(e.target.value)}
            disabled={addLoading}
          />

          <button
            type='submit'
            className='card-add-btn'
            disabled={addLoading}
          >
            {t('add')}
          </button>
          { addErrorReq === '500' ? <div className='card-add-error-msg'>{t('error500')}</div> : null }
          { addErrorReq === 'CARD_EXIST' ? <div className='card-add-error-msg'>{t('cardAlreadyExist')}</div> : null }
        </form>
      }

    </div>
  );
}


// @export
export default withTranslation('common')(Card);