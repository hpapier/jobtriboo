// @module import
import React, { Dispatch, SetStateAction, FocusEvent, useState, useRef, useEffect } from 'react';
import { WithTranslation } from 'next-i18next';


// @local import
import './index.css';
import Error from '../../Error';
import { withTranslation } from '../../i18n';


// @interface
interface ComponentProps extends WithTranslation {
  label: string,
  value: string,
  margin: string,
  error: boolean,
  disabled: boolean,
  errorValue: string,
  errorMessages: Object,
  onBlurFn: (e: FocusEvent<HTMLInputElement>, dateValue: string) => void,
  resetFn?: Dispatch<SetStateAction<boolean>>,
  resetNeeded?: boolean,
  maxYear?: number,
  minYear?: number,
  currentBtn?: boolean,
  currentBtnState?: boolean,
  setCurrentBtnState?: Dispatch<SetStateAction<boolean>>
}


// @component
const DateInput: (props: ComponentProps) => JSX.Element = ({ t, label, value, margin, error, disabled, errorValue, errorMessages, onBlurFn, resetFn = () => {}, resetNeeded = false, maxYear = false, minYear = false, currentBtn = false, currentBtnState = false, setCurrentBtnState = null }) => {
  const dateConverted = new Date(value || Date.now());

  const [day, setDay]           = useState(value !== null ? `${dateConverted.getDate()}` : '');
  const [month, setMonth]       = useState(value !== null ? `${dateConverted.getMonth() + 1}` : '');
  const [year, setYear]         = useState(value !== null ? `${dateConverted.getFullYear()}` : '');

  const [isFocused, setFocused] = useState({ day: false, month: false, year: false });
  const focusRef                = useRef({ day: false, month: false, year: false });
  const isUnmounted             = useRef(false);

  const [genError, setGenError] = useState(null);


  // Handle the user input value.
  const handleChange = (value: string, type: string) => {
    if (type === 'day' || type === 'month') {
      if (value.match(/^\d{0,2}$/) !== null)
        type === 'day' ? setDay(value) : setMonth(value);
    }

    if (type === 'year') {
      if (value.match(/^\d{0,4}$/) !== null)
        setYear(value)
    }
  }


  // Check the date validity
  const dateVerification: () => boolean = () => {
    if (maxYear && parseInt(year) > maxYear)
      return false;

    if (minYear && parseInt(year) < minYear)
      return false;

    const verifiedDate = new Date(year + '-' + month + '-' + day);
    if (verifiedDate.toDateString() !== 'Invalid Date')
      return true;

    return false;
  }


  // Check Input Errors
  const handleInputErrors = () => {
    if (day === '' || month === '' || year === '') {
      if(!isUnmounted.current)
        setGenError('invalidDate');
      return true;
    }

    if (!dateVerification()) {
      if (!isUnmounted.current)
        setGenError('invalidDate');
      return true;
    }

    if (!isUnmounted.current)
      setGenError(null);

    return false;
  }


  // Verify the focusness of the entire element.
  const handleBlur = (e: FocusEvent<HTMLInputElement>, type: string) => {
    if (!isUnmounted.current)
      setFocused({ ...isFocused, [type]: false });

    focusRef.current[type] = false;

    setTimeout(() => {
      if (type === 'day') {
        if (!focusRef.current.month && !focusRef.current.year) {
          if (handleInputErrors())
            return;

          onBlurFn(e, new Date(year + '-' + month + '-' + day).toDateString());
        }
      }

      if (type === 'month') {
        if (!focusRef.current.day && !focusRef.current.year) {
          if (handleInputErrors())
            return;

          onBlurFn(e, new Date(year + '-' + month + '-' + day).toDateString());
        }
      }

      if (type === 'year') {
        if (!focusRef.current.day && !focusRef.current.month) {
          if (handleInputErrors())
            return;

          onBlurFn(e, new Date(year + '-' + month + '-' + day).toDateString());
        }
      }
    }, 100);
  }


  // Handle the unmount mechanism
  useEffect(() => () => { isUnmounted.current = true; }, []);


  // Reset all value if the value props is reset.
  useEffect(() => {
    if (resetNeeded) {
      if (value === null) {
        if (day !== '')
          if (!isUnmounted.current)
            setDay('');

        if (day !== '')
          if (!isUnmounted.current)
            setMonth('');

        if (day !== '')
          if (!isUnmounted.current)
            setYear('');

        setGenError(null);
      }
      resetFn(false);
    }
  }, [resetNeeded]);


  // Rendering function.
  return (
    <div style={{ position: 'relative' }}>
      <div className={`date-input-component-root${isFocused.day || isFocused.month || isFocused.year ? ` --dicr-focus-active` : ``}${(error || genError !== null) && !currentBtnState ? ` --dicr-error` : ``}${disabled ? ` --dicr-disabled`: ``}`} style={{ margin }}>
        <input
          className='dicr-element'
          type='text'
          placeholder='jj'
          value={day}
          onChange={e => handleChange(e.target.value, 'day')}
          onFocus={() => { setFocused({ ...isFocused, day: true }); focusRef.current.day = true; }}
          onBlur={e => handleBlur(e, 'day')}
          disabled={disabled}
        />
        <p className='dicr-txt'>/</p>
        <input
          className='dicr-element'
          type='text'
          placeholder='mm'
          value={month}
          onChange={e => handleChange(e.target.value, 'month')}
          onFocus={() => { setFocused({ ...isFocused, month: true }); focusRef.current.month = true; }}
          onBlur={e => handleBlur(e, 'month')}
          disabled={disabled}
        />
        <p className='dicr-txt'>/</p>
        <input
          className='dicr-element'
          type='text'
          placeholder='yyyy'
          value={year}
          onChange={e => handleChange(e.target.value, 'year')}
          onFocus={() => { setFocused({ ...isFocused, year: true }); focusRef.current.year = true; }}
          onBlur={e => handleBlur(e, 'year')}
          disabled={disabled}
        />
        <label className='dicr-label'>{label}</label>
      </div>
      {
        currentBtn ?
        <div className='dicr-current'>
          <p className='dicr-current-txt'>{t('current')}</p>
          <div className={`dicr-current-btn${currentBtnState ? ` --dicrcb-active` : ``}`}>
            <button className={`dicrcb-btn${currentBtnState ? ` --dicrcbb-active` : ``}`} type='button' onClick={() => setCurrentBtnState(!currentBtnState)}></button>
          </div>
        </div>:
        null
      }
      { error && genError === null && !currentBtnState ? <Error margin='10px auto 0px auto' errorValue={errorValue} errorMessages={errorMessages} /> : null }
      { genError !== null && !currentBtnState ? <Error margin='10px auto 0px auto' errorValue={genError} errorMessages={{ 'invalidDate': t('invalidDate') }} /> : null }
    </div>
  );
}


// @export
export default withTranslation('common')(DateInput);