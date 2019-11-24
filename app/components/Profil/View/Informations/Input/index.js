// @module import
import { useEffect, useState, useRef } from 'react';
import { useCookies } from 'react-cookie';


// @local import
import './index.css';
import RemoveIcon from '../../../../../static/assets/remove_icon_w.svg';
import SearchIcon from '../../../../../static/assets/search_icon_grey.svg';
import WhiteDropDownIcon from '../../../../../static/assets/dropdown_icon_w.svg';
import GreyDropDownIcon from '../../../../../static/assets/bottom_arrow_icon.svg';
// import GreyImportIcon from '../../../../../static/assets/import_icon_grey.svg';
import { withTranslation } from '../../../../i18n';



// @component INPUT
const Input = ({ label, placeholder, data, token, updateReq: { req, endpoint }, updateData, checkFormat = null, formatErrorMsg, type }) => {
  const [value, setValue] = useState(data);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const isUnmounted = useRef(false);
  const [cookies, setCookie, __] = useCookies();

  useEffect(() => () => { isUnmounted.current = true; }, []);

  const handleUpdate = async () => {
    if (value === data) {
      if (!isUnmounted.current)
        setError(null);

      return;
    }
    else if (value === '') {
      if (!isUnmounted.current) {
        setValue(data);
        if (error !== null)
          setError(null);
      }
      return;
    } else if (checkFormat !== null && !checkFormat(value)) {
      if (!isUnmounted.current) {
        setLoading(false);
        setError('formatError');
      }
      return;
    }

    try {
      if (!isUnmounted.current) {
        setLoading(true);
        if (error !== null)
          setError(null);
      }

      const res = await req(endpoint, value, token);

      if (res.status === 200) {
        if (endpoint === '/email') {
          const rdata = await res.json();
          setCookie('token', data.token, { path: '/' });
        }

        if (!isUnmounted.current)
          updateData(value);
      }
      else if (res.status === 401 && endpoint === '/email') {
        if (!isUnmounted.current)
          setError('formatError');
      }
      else
        throw 'unauthorized';

      if (!isUnmounted.current)
        setLoading(false);

    } catch (e) {
      console.log(e);
      if (!isUnmounted.current) {
        setError(500);
        setLoading(false);
      }
    }
  }

  return (
    <div className='info-input-root'>
      <div style={{ display: 'flex' }}>
        <label className='info-input-label'>{label}</label>
        { loading ? <div className='input-loading-box'></div> : null }
      </div>
      <input
        disabled={loading}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => setValue(e.target.value)}
        className={`info-input-element${error ? ` -input-error` : ``}`}
        onBlur={handleUpdate}
      />
      {
        error !== null ?
        <div className='input-error-msg'>
          { error === 'formatError' ? {formatErrorMsg} : '' }
          { error === 500 ? t('error500') : '' }
        </div>
        : null
      } 
    </div>
  );
};




// @component INPUT-PHONE
const InputPhoneComponent = ({ t, label, prefixData, prefixPlaceholder, prefixUpdateData, prefixCheck, phoneData, phonePlaceholder, phoneUpdateData, phoneCheck, updateReq: { req, endpoint }, formatErrorMsg }) => {
  const [prefixValue, setPrefixValue] = useState(prefixData);
  const [phoneValue, setPhoneValue] = useState(phoneData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(0);
  const isUnmounted = useRef(false);
  const [cookies, _, __] = useCookies();

  useEffect(() => () => { isUnmounted.current = true; }, []);

  const checkHandler = (value, initialValue) => {
    if (value === initialValue)
      return false;
    else if (value === '')
      return false;

    return true;
  }

  const errorSelector = (err, newErr) => {
    if (newErr === 'prefixFormatError') {
      if (err === 'phoneFormatError') return 'ppFormatError';
      else if (err === 'ppFormatError') return 'ppFormatError';
      else return 'prefixFormatError';
    } else if (newErr === 'phoneFormatError') {
      if (err === 'prefixFormatError') return 'ppFormatError';
      else if (err === 'ppFormatError') return 'ppFormatError';
      else return 'phoneFormatError';
    }

    return null;
  }

  const handleUpdate = async (element) => {
    if (element === 'prefix') {
      if (!checkHandler(prefixValue, prefixData)) {
        if (!isUnmounted.current) {
          if (error === 'prefixFormatError')
            setError(null);
          else if (error === 'ppFormatError')
            setError('phoneFormatError');
          setPrefixValue(prefixData);
        }
        return;
      }

      if (!prefixCheck(prefixValue)) {
        if (!isUnmounted.current)
          setError(errorSelector(error, 'prefixFormatError'));
        return;
      }
    } else {
      if (!checkHandler(phoneValue, phoneData)) {
        if (!isUnmounted.current) {
          if (error === 'phoneFormatError')
            setError(null);
          else if (error === 'ppFormatError')
            setError('prefixFormatError');
          setPhoneValue(phoneData);
        }
        return;
      }

      if (!phoneCheck(phoneValue)) {
        if (!isUnmounted.current)
          setError(errorSelector(error, 'phoneFormatError'));
        return;
      }
    }


    try {
      if (!isUnmounted.current) {
        setLoading(element);
      }

      const res = await req(element === 'prefix' ? endpoint.prefix : endpoint.phone, element === 'prefix' ? prefixValue : phoneValue, cookies.token);

      if (res.status === 200) {
        if (!isUnmounted.current) {
          if (element === 'prefix')
            prefixUpdateData(prefixValue);
          else
            phoneUpdateData(phoneValue);

          setLoading(false);
        }
      }
      else
        throw res.status;

    } catch (e) {
      console.log(e);
      if (!isUnmounted.current) {
        setError(500);
        setLoading(false);
      }
    }
  }

  return (
    <div className='info-input-root'>
      <div style={{ display: 'flex' }}>
        <label className='info-input-label'>{label}</label>
        { loading ? <div className='input-loading-box'></div> : null }
      </div>
      <div className='info-input-box'>
        <input
          type='text'
          disabled={loading === 'prefix'}
          className={`info-input-element -prefix${error === 'prefixFormatError' || error === 'ppFormatError' ? ` -input-error`: ``}`}
          placeholder={prefixPlaceholder}
          value={prefixValue}
          onChange={e => setPrefixValue(e.target.value)}
          onBlur={() => handleUpdate('prefix')}
        />
        <input
          type='text'
          disabled={loading === 'phone'}
          className={`info-input-element -phone${error === 'phoneFormatError' || error === 'ppFormatError' ? ` -input-error`: ``}`}
          placeholder={phonePlaceholder}
          value={phoneValue}
          onChange={e => setPhoneValue(e.target.value)}
          onBlur={() => handleUpdate('phone')}
        />
      </div>
      {
        error !== null ?
        <div className='input-error-msg'>
          { (error === 'ppFormatError' || error === 'prefixFormatError' || error === 'phoneFormatError') ? formatErrorMsg : '' }
          { (error === 500) ? t('error500') : '' }
        </div> :
        null
      }
    </div>
  );
};


export const InputPhone = withTranslation('common')(InputPhoneComponent);




// @component INPUT-SKILLS
const InputSkillsComponent = ({ t, token, loadSkillsFn, requestFn, currentSkills, updateData, label }) => {
  const xpList = [0.5, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
  const [xpListOpened, setXpListState] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const isUnmounted = useRef(false);

  useEffect(() => () => { isUnmounted.current = true }, []);


  // Add Skill
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (inputValue === '' || (currentSkills.filter(item => item.name === inputValue).length > 0)) {
      if (error !== null && !isUnmounted.current)
        setError(null);
      return;
    }

    const ndata = { name: inputValue, xp: 0.5 };
    try {
      if (!isUnmounted.current) {
        setLoading(true);
        setError(null);
      }

      const res = await requestFn('/skills/add', ndata, token);

      if (res.status === 200) {

        const rdata = await res.json();
        let narrayData = currentSkills.map(item => item);
        narrayData.push(rdata);

        if (!isUnmounted.current) {
          updateData(narrayData);
          setInputValue('');
          setLoading(false);
        }

      }
      else
        throw res.status;

    } catch (e) {
      console.log(e);
      if (!isUnmounted.current) {
        setError(500);
        setLoading(false);
      }
    }
  }


  // Remove Skill
  const handleRemove = async item => {
    if (!isUnmounted.current) {
      if (error !== null)
        setError(null);
      setLoading(true);
    }

    try {
      const res = await requestFn('/skills/remove', item, token);
      if (res.status === 200) {
        const nData = currentSkills.filter(fitem => fitem._id !== item._id);

        if (!isUnmounted.current) {
          setLoading(false);
          updateData(nData);
        }
      }
      else
        throw res.status;

    } catch (e) {
      console.log(e);
      if (!isUnmounted.current) {
        setLoading(false);
        setError(500);
      }
    }
  }


  // Update Skill Xp
  const handleUpdate = async (item, nXp) => {
    if (item.xp === nXp) {
      if (error !== null && !isUnmounted.current)
        setError(null);
      return;
    }

    try {
      if (!isUnmounted.current) {
        setLoading(true);
        setError(null);
      }

      const nItem = { ...item, updatedXp: nXp };
      const res = await requestFn('/skills/update', nItem, token);

      if (res.status === 200) {
        const nData = await res.json();

        if (!isUnmounted.current) {
          updateData(nData);
          setXpListState(null);
          setLoading(false);
        }
      }
      else
        throw res.status;

    } catch (e) {
      console.log(e);
      if (!isUnmounted.current) {
        setError(500);
        setXpListState(null);
        setLoading(false);
      }
    }
  }

  return (
    <div className='info-input-skills-root'>
      <div style={{ display: 'flex' }}>
        <h2 className='info-input-label'>{label}</h2>
        { loading ? <div style={{ margin: '10px 10px'}} className='input-loading-box'></div> : null }
      </div>
      <form onSubmit={e => handleSubmit(e)} className='info-input-skill-form'>
        <img src={SearchIcon} alt='search' className='info-input-skill-form-img' />
        <input value={inputValue} type='text' placeholder={t('phSearch')} className='info-input-skill-form-input' onChange={e => setInputValue(e.target.value)} />
      </form>
      {
        error === 500 ?
        <div className='input-error-msg'>
          {t('error500')}
        </div> :
        null
      }
      {
        currentSkills.map((item, index) => (
          <div key={index} className='info-input-skill-item'>
            <div className='info-input-skill-item-box'>
              <div className='info-input-skill-item-box-txt'>{item.name}</div>
              <button className='info-input-skill-item-box-icon' onClick={() => handleRemove(item)}>
                <img src={RemoveIcon} alt='remove-icon' />
              </button>
            </div>

            <button
              type='button'
              className='info-input-skill-item-btn'
              onClick={() => setXpListState(xpListOpened === index ? null : index)}
            >
              {item.xp < 1 ? `< 1 ` : item.xp } {item.xp > 1 ? t('years') : t('year')}
              <img src={WhiteDropDownIcon} alt='dropdown-icon' className={ xpListOpened === index ? `-dropdown-active` : `` } />
            </button>

            {
              xpListOpened === index ?
              <div className='info-input-select-list'>
                { xpList.map((itemXp, index) => (
                    <div
                      className='info-input-select-list-item'
                      value={itemXp}
                      key={index}
                      onClick={() => handleUpdate(item, itemXp)}
                    >
                      {itemXp < 1 ? `< 1 ` : itemXp } {itemXp > 1 ? t('years') : t('year')}
                    </div>
                  ))
                }
              </div> :
              null
            }
          </div>
          )
        )
      }
    </div>
  );
};

export const InputSkills = withTranslation('common')(InputSkillsComponent);




// @component INPUT-SELECT
export const InputSelectComponent = ({ currentData, updateData, updateReq: {req, endpoint, token}, list, label, width, margin, t }) => {
  const [listOpened, setListState] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const isUnmounted = useRef(false);
  const currentValue = list.filter(item => item.value === currentData);

  useEffect(() => () => { isUnmounted.current = true }, []);

  const handleUpdate = async ndata => {
    if (currentData === ndata) {
      if (!isUnmounted.current) {
        if (error !== null)
          setError(null);
        setListState(false);
      }
      return;
    }

    try {
      if (!isUnmounted.current) {
        setLoading(true);
        if (error !== null)
          setError(null);
      }

      const res = await req(endpoint, ndata, token);

      if (res.status === 200) {
        if (!isUnmounted.current) {
          setListState(false);
          updateData(ndata);
          setLoading(false);
        }
      }
      else
        throw res.status;

    } catch (e) {
      console.log(e);
      if (!isUnmounted.current) {
        setError(500);
        setLoading(false);
      }
    }
  }

  return (
    <div style={{ width, margin }} className='info-input-select-root'>
      <div style={{ display: 'flex' }}>
        <h2 style={{ margin: '5px 10px 5px 10px'}} className='info-input-label'>{label}</h2>
        { loading ? <div style={{ margin: '5px 0px 0px 0px'}} className='input-loading-box'></div> : null }
      </div>

      <button className={`info-input-element ${`-select-element`}`} onClick={() => setListState(!listOpened)}>
        {(currentValue.length > 0) ? currentValue[0].label : ''}
        <img src={GreyDropDownIcon} alt='dropdown-icon' className={listOpened ? `-dropdown-active` : ``} />
      </button>
      {
        error === 500 ?
        <div className='input-error-msg'>
          {t('error500')}
        </div> :
        null
      }

      {
        listOpened ?
        <div style={{ bottom: '-120px'}} className='info-input-select-list'>
          {
            list.map((item, index) =>
              <div
                className='info-input-select-list-item'
                onClick={() => handleUpdate(item.value)}
                key={index}
              >
                {item.label}
              </div>)
          }
        </div> :
        null
      }

    </div>
  );
}


export const InputSelect = withTranslation('common')(InputSelectComponent);


// export const InputCv = ({ margin, label, cvTitle, updateFn }) => {
//   return (
//     <div style={{ margin }} className='info-input-root'>
//       <label className='info-input-label'>{label}</label>
//       <div className='info-input-element -cv-element'>
//         {cvTitle}
//         <button className='info-input-icon'>
//           <img className='info-input-icon-el' src={GreyImportIcon} />
//         </button>
//       </div>
//   </div>
//   );
// }


// @export
export default withTranslation('common')(Input);