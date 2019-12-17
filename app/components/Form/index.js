// @module import
import { useRef, useEffect, useState } from 'react';


// @local import
import './index.css';
import GreyDropDownIcon from '../../static/assets/bottom_arrow_icon.svg'
import RemoveIconWhite from '../../static/assets/remove_icon_w.svg';
import { withTranslation } from '../i18n';



// @component: INPUT
export const Input = ({ width, margin, error, label, placeholder, value, setValue, formatErrorMsg, type, loading }) => {
  return (
    <div className='info-input-root' style={{ width: `${width}`, margin }}>
      <label className='info-input-label'>{label}</label>
      <input
        disabled={loading}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => setValue(e.target.value)}
        className={`info-input-element${error ? ` -input-error` : ``}`}
      />
      {
        error ?
        <div className='input-error-msg'>
          { error ? formatErrorMsg : '' }
        </div>
        : null
      }
    </div>
  );
};


// @component: SELECT
export const Select = ({ label, value, optionList, width, margin, loading, setValue }) => {
  const [listOpened, setListState] = useState(false);
  const isUnmounted = useRef(false);
  const currentValue = optionList.filter(item => item.value === value);

  useEffect(() => () => { isUnmounted.current = true }, []);

  const handeSetValue = nValue => {
    if (value === nValue)
      return;
    else {
      setValue(nValue);
      if (!isUnmounted.current)
        setListState(false);
    }
  }

  return (
    <div style={{ width: `${width}`, margin }} className='info-input-select-root'>
      <h2 className='info-input-label'>{label}</h2>
      <button
        type='button'
        className={`info-input-element ${`-select-element`}`}
        onClick={() => setListState(!listOpened)}
        disabled={loading}
      >
        {currentValue[0].label}
        <img src={GreyDropDownIcon} alt='dropdown-icon' className={listOpened ? `-dropdown-active` : ``} />
      </button>

      {
        listOpened && !loading ?
        <div style={{ width: `100%`, bottom: '-120px'}} className='info-input-select-list'>
          {
            optionList.map((item, index) =>
              <div
                className='info-input-select-list-item'
                onClick={() => handeSetValue(item.value)}
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


// @component: TEXTAREA
export const TextArea = ({ width, margin, label, value, setValue, placeholder, loading, error, errMsg }) => {
  return (
    <div className='text-area-root' style={{ width: `${width}`, margin }}>
      <h2 className='info-input-label'>{label}</h2>
      <textarea
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder={placeholder}
        disabled={loading}
        className={`text-area-element${error ? ` -input-error` : ``}`}
      >
      </textarea>
      { error ? <div className='input-error-msg'>{errMsg}</div> : null }
    </div>
  );
};


// @component: LIST_INPUT
const ListInputComp = ({ label = '', width, placeholder, objectList, addObjectList, removeObjectList, loading, error, instructionNeeded = false, t }) => {
  const [value, setValue] = useState('');

  const handleAdd = e => {
    e.preventDefault();
    if (value === '')
      return;

    addObjectList(value);
    setValue('');
  }

  return (
    <form onSubmit={handleAdd} style={{ width, position: 'relative' }}>
      <h2 className='info-input-label'>{label}</h2>
      <input
        className={`info-input-element${error ? ` -input-error` : ``}`}
        onChange={e => setValue(e.target.value)}
        placeholder={placeholder}
        value={value}
        disabled={loading}
        id='list-input-element'
      />
      {
        instructionNeeded && value.length > 0 &&
        <button type='submit' className='list-input-instruction'>
          {t('enter')}
        </button>
      }
      <div>
        {
          objectList.map((item, index) =>
            <div key={index} className='list-input-item'>
              {item}
              <button className='list-input-rmv-btn' type='button' onClick={() => removeObjectList(item)}>
                <img src={RemoveIconWhite} alt='remove-icon' />
              </button>
            </div>
            )
        }
      </div>
    </form>
  );
};


export const ListInput = withTranslation('common')(ListInputComp);