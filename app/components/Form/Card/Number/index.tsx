// @module import
import React, { ChangeEvent, Dispatch, SetStateAction, FocusEvent, useState } from 'react';
import { CardElement } from 'react-stripe-elements';



// @local import
import './index.css';
import Error from '../../../Error';


// @interfaces
interface AppProps {
  // placeholder: string,
  label: string,
  type: string,
  changeFn: Dispatch<SetStateAction<string>>,
  value: string,
  autocomplete: string,
  margin: string,
  error: boolean,
  disabled: boolean,
  errorValue: string,
  errorMessages: Object,
  onBlurFn: (e: FocusEvent<HTMLInputElement>) => void
}


// @component
const CardNumberInput: (props: AppProps) => JSX.Element = ({ label, type, changeFn, value, autocomplete, margin, error, disabled, errorValue, errorMessages, onBlurFn }) => {
  const [isFocused, setFocus] = useState(false);

  return (
    <div className={`input-card-number-component-root${isFocused ? ` --icncr-focused` : ``}`} style={{ margin }}>
      {/* <input
        value={value}
        onChange={e => (e.target.value.match(/^\d{0,16}$/) !== null) ? changeFn(e.target.value) : null}
        className={`icncr-input${error ? ` --icncr-error` : ``}`}
        type='text'
        placeholder='4242 4242 4242 4242'
        autoComplete='cc-number'
        disabled={disabled}
        onBlur={onBlurFn}
      /> */}

      <CardElement hidePostalCode onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} />
      <label className='icncr-label'>{label}</label>
      { error ? <Error margin='10px auto 0px auto' errorValue={errorValue} errorMessages={errorMessages} /> : null }
    </div>
  );
};


// @export
export default CardNumberInput;