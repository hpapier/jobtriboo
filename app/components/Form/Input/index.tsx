// @module import
import React, { ChangeEvent, Dispatch, SetStateAction, FocusEvent } from 'react';


// @local import
import './index.css';
import Error from '../../Error';


// @interfaces
interface AppProps {
  placeholder: string,
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
  onBlurFn: (e: FocusEvent<HTMLInputElement>) => void,
  borderRadius?: string
}


// @component
const Input: (props: AppProps) => JSX.Element = ({ placeholder, label, type, changeFn, value, autocomplete, margin, error, disabled, errorValue, errorMessages, onBlurFn, borderRadius = null }) => {
  return (
    <div className='input-component-root' style={{ margin }}>
      <input
        style={{ borderRadius }}
        value={value}
        onChange={e => changeFn(e.target.value)}
        className={`icr-input${error ? ` --icr-error` : ``}`}
        type={type}
        placeholder={placeholder}
        autoComplete={autocomplete}
        disabled={disabled}
        onBlur={onBlurFn}
      />
      <label className='icr-label'>{label}</label>
      { error ? <Error margin='10px auto 0px auto' errorValue={errorValue} errorMessages={errorMessages} /> : null }
    </div>
  );
};


// @export
export default Input;