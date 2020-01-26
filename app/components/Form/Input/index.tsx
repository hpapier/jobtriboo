// @module import
import React, { Dispatch, SetStateAction, FocusEvent, useState, useRef, useEffect } from 'react';


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
  onFocusBottomMsg?: string
}


// @component
const Input: (props: AppProps) => JSX.Element = ({ placeholder, label, type, changeFn, value, autocomplete, margin, error, disabled, errorValue, errorMessages, onBlurFn, borderRadius = null, onFocusBottomMsg = null}) => {
  const [focused, setFocused] = useState<boolean>(false);
  const isUnmounted           = useRef<boolean>(false);

  const handleOnBlur = (e: FocusEvent<HTMLInputElement>) => {
    if (onFocusBottomMsg !== null)
      if (!isUnmounted.current) setFocused(false);

    onBlurFn(e);
  }

  useEffect(() => {
    () => { isUnmounted.current = true; }
  }, []);

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
        onBlur={handleOnBlur}
        onFocus={() => setFocused(true)}
      />
      <label className='icr-label'>{label}</label>
      { onFocusBottomMsg !== null && focused && <p className='icr-bottom-msg'>{onFocusBottomMsg}</p>}
      { error ? <Error margin='10px auto 0px auto' errorValue={errorValue} errorMessages={errorMessages} /> : null }
    </div>
  );
};


// @export
export default Input;