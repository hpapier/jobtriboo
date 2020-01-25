// @module import
import React, { Dispatch, SetStateAction, FocusEvent } from 'react';


// @local import
import './index.css';
import Error from '../../Error';


// @interface
interface ComponentProps {
  label: string,
  placeholder: string,
  margin: string,
  changeFn: Dispatch<SetStateAction<string>>,
  value: string,
  onBlurFn: (e: FocusEvent<HTMLTextAreaElement>) => void,
  error: boolean,
  errorValue: string,
  errorMessages: Object,
  loading: boolean
}


// @component
const TextArea: (props: ComponentProps) => JSX.Element = ({ label, placeholder , margin, changeFn, value, onBlurFn, error, errorValue, errorMessages, loading }) => {
  return (
    <div className='textarea-component-root' style={{ margin }}>
      <textarea
        className={`tcr-element${error ? ` --tcr-error`: ``}`}
        placeholder={placeholder}
        onChange={e => changeFn(e.target.value)}
        value={value || ''}
        onBlur={onBlurFn}
        disabled={loading}
      ></textarea>
      <p className='tcr-label'>{label}</p>
      { error ? <Error margin='10px auto 0px auto' errorValue={errorValue} errorMessages={errorMessages} /> : null }
    </div>
  );
}


// @export
export default TextArea;