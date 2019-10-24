// @module import
import { useEffect, useState, useRef } from 'react';
import { withTranslation } from '../../../../i18n';


// @local import
import './index.css';
import RemoveIcon from '../../../../../static/assets/remove_icon_w.svg';
import SearchIcon from '../../../../../static/assets/search_icon_grey.svg';
import WhiteDropDownIcon from '../../../../../static/assets/dropdown_icon_w.svg';
import GreyDropDownIcon from '../../../../../static/assets/bottom_arrow_icon.svg';
import GreyImportIcon from '../../../../../static/assets/import_icon_grey.svg';
import { useCookies } from 'react-cookie';



// @component
const Input = ({ label, placeholder, data, token, updateReq: { req, endpoint }, updateData, type }) => {
  const [value, setValue] = useState(data);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const isUnmounted = useRef(false);
  const [cookies, setCookie, __] = useCookies();


  useEffect(() => {
    isUnmounted.current = false;
    return () => { isUnmounted.current = true; }
  }, []);


  const handleUpdate = async () => {
    if (value === data)
      return;
    else if (value === '') {
      setValue(data);
      return;
    }

    try {
      if (!isUnmounted.current)
        setLoading(true);

      const res = await req(endpoint, value, token);

      
      if (res.status === 200) {
        if (endpoint === '/email') {
          const rdata = await res.json();
          console.log(cookies.token);
          setCookie('token', rdata.token);
        }

        if (!isUnmounted.current) {
          updateData(value);
          setLoading(false);
        }

      }
      else
        throw res.status;

    } catch (e) {
      console.log(e);
      if (!isUnmounted.current)
        setError(500);
    }
  }

  return (
    <div className='info-input-root'>
      <label className='info-input-label'>{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => setValue(e.target.value)}
        className='info-input-element'
        onBlur={handleUpdate}
      />
    </div>
  );
};

export const InputPhone = ({ label, prefixData, prefixPlaceholder, prefixUpdateData, phoneData, phonePlaceholder, phoneUpdateData, updateReq: { req, endpoint } }) => {
  const [prefixValue, setPrefixValue] = useState(prefixData);
  const [phoneValue, setPhoneValue] = useState(phoneData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(0);
  const isUnmounted = useRef(false);
  const [cookies, _, __] = useCookies();

  useEffect(() => {
    isUnmounted.current = false;
    return () => { isUnmounted.current = true; }
  }, []);

  const checkHandler = (value, initialValue) => {
    console.log(value, initialValue);
    if (value === initialValue)
      return false;
    else if (value === '') {
      return false;
    }

    return true;
  }

  const handleUpdate = async (element) => {

    console.log(element)

    if (element === 'prefix') {
      if (!checkHandler(prefixValue, prefixData)) {
        setPrefixValue(prefixData);
        return;
      }
    } else {
      if (!checkHandler(phoneValue, phoneData)) {
        setPhoneValue(phoneData);
        return;
      }
    }

    try {
      if (!isUnmounted.current)
        setLoading(element);

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
      if (!isUnmounted.current)
        setError(500);
    }
  }

  return (
    <div className='info-input-root'>
      <label className='info-input-label'>{label}</label>
      <div className='info-input-box'>
        <input
          type='text'
          className='info-input-element -prefix'
          placeholder={prefixPlaceholder}
          value={prefixValue}
          onChange={e => setPrefixValue(e.target.value)}
          onBlur={() => handleUpdate('prefix')}
        />
        <input
          type='text'
          className='info-input-element -phone'
          placeholder={phonePlaceholder}
          value={phoneValue}
          onChange={e => setPhoneValue(e.target.value)}
          onBlur={() => handleUpdate('phone')}
        />
      </div>
    </div>
  );
};

const InputSkillsComponent = ({ t, token, loadSkillsFn, requestFn, currentSkills, updateData, label }) => {
  const xpList = [0.5, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
  const [xpListOpened, setXpListState] = useState(null);
  const [addLoading, setAddLoading] = useState(false);
  const [error, setError] = useState(0);
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (inputValue === '' || (currentSkills.filter(item => item.name === inputValue).length > 0))
      return;
    
    const ndata = { name: inputValue, xp: 0.5 };
    try {
      setAddLoading(true);
      const res = await requestFn('/skills/add', ndata, token);

      if (res.status === 200) {
        const rdata = await res.json();
        let narrayData = currentSkills.map(item => item);
        narrayData.push(rdata);
        updateData(narrayData);
        setInputValue('');
        if (error !== 0) setError(0);
        setAddLoading(false);
        return;
      } else {
        setError(res.status);
        setAddLoading(true);
      }

    } catch (e) {
      console.log(e);
      setError(500);
      setAddLoading(false);
    }
  }

  const handleRemove = async item => {
    console.log('-> remove')

    try {
      const res = await requestFn('/skills/remove', item, token);
      if (res.status === 200) {
        const nData = currentSkills.filter(fitem => fitem._id !== item._id);
        updateData(nData);
      }
      else
        throw res.status;
    } catch (e) {
      console.log(e);
    }
  }

  const handleUpdate = async (item, nXp) => {
    console.log('-> update');

    if (item.xp === nXp)
      return;

    try {
      const nItem = { ...item, updatedXp: nXp };
      const res = await requestFn('/skills/update', nItem, token);
      if (res.status === 200) {
        const nData = await res.json();
        updateData(nData);
        setXpListState(null);
      }
      else
        throw res.status;
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div className='info-input-skills-root'>
      <h2 className='info-input-label'>{label}</h2>
      <form onSubmit={e => handleSubmit(e)} className='info-input-skill-form'>
        <img src={SearchIcon} alt='search' className='info-input-skill-form-img' />
        <input value={inputValue} type='text' placeholder={t('phSearch')} className='info-input-skill-form-input' onChange={e => setInputValue(e.target.value)} />
      </form>
      {
        currentSkills.map((item, index) => (
          <div key={index} className='info-input-skill-item'>
            <div className='info-input-skill-item-box'>
              {item.name}
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


export const InputSelect = ({ currentData, updateData, updateReq: {req, endpoint, token}, list, label, width, margin }) => {
  const [listOpened, setListState] = useState(false);
  const [error, setError] = useState(0);
  const [loading, setLoading] = useState(false);
  const currentValue = list.filter(item => item.value === currentData);

  const handleUpdate = async ndata => {
    if (currentData === ndata) {
      setListState(false);
      return;
    }

    try {
      setLoading(true);
      const res = await req(endpoint, ndata, token);
      if (res.status === 200) {
        setListState(false);
        updateData(ndata);
      } else {
        setError(res.status);
      }
      setLoading(false);
    } catch (e) {
      console.log(e);
      setError(500);
      setLoading(false);
    }
  }

  return (
    <div style={{ width: `${width}px`, margin }} className='info-input-select-root'>
      <div className='info-input-label'>{label}</div>

      <button className={`info-input-element ${`-select-element`}`} onClick={() => setListState(!listOpened)}>
        {(currentValue.length > 0) ? currentValue[0].label : ''}
        <img src={GreyDropDownIcon} alt='dropdown-icon' className={listOpened ? `-dropdown-active` : ``} />
      </button>

      {
        listOpened ?
        <div style={{ width: `${width}px`, bottom: '-100px'}} className='info-input-select-list'>
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


export const InputCv = ({ margin, label, cvTitle, updateFn }) => {
  return (
    <div style={{ margin }} className='info-input-root'>
      <label className='info-input-label'>{label}</label>
      <div className='info-input-element -cv-element'>
        {cvTitle}
        <button className='info-input-icon'>
          <img className='info-input-icon-el' src={GreyImportIcon} />
        </button>
      </div>
  </div>
  );
}

// @export
export default Input;