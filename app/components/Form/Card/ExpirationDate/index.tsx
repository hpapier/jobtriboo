// @module import
import React, { Dispatch, SetStateAction, FocusEvent, useState, useRef, useEffect } from 'react';
import { WithTranslation } from 'next-i18next';


// @local import
import './index.css';
import Error from '../../../Error';
import { withTranslation } from '../../../i18n';


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
const ExpirationDate: (props: ComponentProps) => JSX.Element = ({ t, label, value, margin, error, disabled, errorValue, errorMessages, onBlurFn, resetFn = () => {}, resetNeeded = false, maxYear = false, minYear = false, currentBtn = false, currentBtnState = false, setCurrentBtnState = null }) => {
  // const dateConverted = new Date(value || Date.now());

  // const [day, setDay]           = useState(value !== null ? `${dateConverted.getDate()}` : '');
  const [month, setMonth]       = useState('');
  const [year, setYear]         = useState('');

  const [isFocused, setFocused] = useState({ month: false, year: false });
  const focusRef                = useRef({ month: false, year: false });
  const isUnmounted             = useRef(false);

  const [genError, setGenError] = useState(null);


  // Handle the user input value.
  const handleChange = (value: string, type: string) => {
    if (type === 'month' || type === 'year') {
      if (value.match(/^\d{0,2}$/) !== null)
        type === 'month' ? setMonth(value) : setYear(value);
    }

    // if (type === 'year') {
    //   if (value.match(/^\d{0,4}$/) !== null)
    //     setYear(value)
    // }
  }


  // Check the date validity
  const dateVerification: () => boolean = () => {
    if (maxYear && parseInt(year) > maxYear)
      return false;

    if (minYear && parseInt(year) < minYear)
      return false;

    if (parseInt(month) > 12 || parseInt(month) === 0)
      return false;

    const currentYear = parseInt(new Date().getFullYear().toString().match(/^[0-9][0-9]([0-9][0-9])$/)[1]);
    if (currentYear === parseInt(year) && parseInt(month) < (new Date().getMonth() + 1))
      return false;

    // const verifiedDate = new Date(year + '-' + month + '-' + day);
    // if (verifiedDate.toDateString() !== 'Invalid Date')
    //   return true;

    return true;
  }


  // Check Input Errors
  const handleInputErrors = () => {
    if (month === '' || year === '') {
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
      // if (type === 'day') {
      //   if (!focusRef.current.month && !focusRef.current.year) {
      //     if (handleInputErrors())
      //       return;

      //     onBlurFn(e, new Date(year + '-' + month + '-' + day).toDateString());
      //   }
      // }

      if (type === 'month') {
        if (!focusRef.current.year) {
          if (handleInputErrors())
            return;

          onBlurFn(e, `${month}-${year}`);
        }
      }

      if (type === 'year') {
        if (!focusRef.current.month) {
          if (handleInputErrors())
            return;

          onBlurFn(e, `${month}-${year}`);
        }
      }
    }, 100);
  }


  // Handle the unmount mechanism
  useEffect(() => () => { isUnmounted.current = true; }, []);


  // Reset all value if the value props is reset.
  // useEffect(() => {
  //   if (resetNeeded) {
  //     if (value === null) {
  //       if (day !== '')
  //         if (!isUnmounted.current)
  //           setDay('');

  //       if (day !== '')
  //         if (!isUnmounted.current)
  //           setMonth('');

  //       if (day !== '')
  //         if (!isUnmounted.current)
  //           setYear('');

  //       setGenError(null);
  //     }
  //     resetFn(false);
  //   }
  // }, [resetNeeded]);


  // Rendering function.
  return (
    <div style={{ position: 'relative' }}>
      <div className={`expiration-date-input-component-root${isFocused.month || isFocused.year ? ` --edicr-focus-active` : ``}${(error || genError !== null) && !currentBtnState ? ` --edicr-error` : ``}${disabled ? ` --edicr-disabled`: ``}`} style={{ margin }}>
        {/* <input
          className='edicr-element'
          type='text'
          placeholder='jj'
          value={day}
          onChange={e => handleChange(e.target.value, 'day')}
          onFocus={() => { setFocused({ ...isFocused, day: true }); focusRef.current.day = true; }}
          onBlur={e => handleBlur(e, 'day')}
          disabled={disabled}
        />
        <p className='edicr-txt'>/</p> */}
        <input
          className='edicr-element'
          type='text'
          placeholder='mm'
          value={month}
          autoComplete='cc-exp-month'
          onChange={e => handleChange(e.target.value, 'month')}
          onFocus={() => { setFocused({ ...isFocused, month: true }); focusRef.current.month = true; }}
          onBlur={e => handleBlur(e, 'month')}
          disabled={disabled}
        />
        <p className='edicr-txt'>/</p>
        <input
          className='edicr-element'
          type='text'
          placeholder='yy'
          value={year}
          autoComplete='cc-exp-year'
          onChange={e => handleChange(e.target.value, 'year')}
          onFocus={() => { setFocused({ ...isFocused, year: true }); focusRef.current.year = true; }}
          onBlur={e => handleBlur(e, 'year')}
          disabled={disabled}
        />
        <label className='edicr-label'>{label}</label>
      </div>
      {
        currentBtn ?
        <div className='edicr-current'>
          <p className='edicr-current-txt'>{t('current')}</p>
          <div className={`edicr-current-btn${currentBtnState ? ` --edicrcb-active` : ``}`}>
            <button className={`edicrcb-btn${currentBtnState ? ` --edicrcbb-active` : ``}`} type='button' onClick={() => setCurrentBtnState(!currentBtnState)}></button>
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
export default withTranslation('common')(ExpirationDate);