// @module import
import React, { Dispatch, SetStateAction, useEffect } from 'react';


// @local import
import './index.css';


// @interface
interface AppProps {
  label: string,
  check: Dispatch<SetStateAction<boolean>>,
  isChecked: boolean,
  defaultChecked?: boolean
}


// @component
const Checkbox: (props: AppProps) => JSX.Element = ({ label, check, isChecked, defaultChecked = true }) => {
  // console.log(isChecked);

  return (
    <label className='checkbox-component-root'>
      <input className='ccr-input' type='checkbox' onClick={() => check(isChecked)} defaultChecked={defaultChecked} />
      <div className='ccr-input-element'>
        { isChecked ? <span className='ccrie-arrow' dangerouslySetInnerHTML={{ __html: '&#10004;' }} /> : null }
      </div>
      <span className='ccr-label' dangerouslySetInnerHTML={{ __html: label }}></span>
    </label>
  );
};


// @export
export default Checkbox;