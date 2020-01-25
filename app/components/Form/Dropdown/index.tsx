// @module import
import React, { useState, useEffect, useRef } from 'react';


// @local import
import './index.css';
import Error from '../../Error';
const ArrowDownIcon = require('../../../static/assets/bottom_arrow_icon.svg') as string;


// @interface
interface ComponentProps {
  list: Array<{ label: string, value: string }>,
  placeholder: string,
  label: string,
  currentValue: { value: string, label: string },
  changeValue: (n: { value: string, label: string }) => void,
  disabled: boolean,
  error: boolean,
  errorValue: string,
  errorMessages: object,
  margin: string
}


// @component
const Dropdown: (props: ComponentProps) => JSX.Element = ({ list, placeholder, label, currentValue, changeValue, disabled, error, errorValue, errorMessages, margin }) => {
  const [opened, setOpenState] = useState(false);
  const isUnmounted            = useRef(false);
  const rootElement            = useRef(null);
  const openRef                = useRef(false);

  // Handle the selection of an item.
  const handleListClick = (item: { value: string, label: string }) => {
    if (!isUnmounted.current)
      setOpenState(false);

    changeValue(item);
  }


  // Didmount / Unmount function
  useEffect(() => {

    // Handle the click outside the component.
    document.addEventListener('click', (event: MouseEvent) => {
      const target = event.target as HTMLInputElement;
      if (rootElement.current !== null && !rootElement.current.contains(target) && openRef.current)
        if (!isUnmounted.current)
          setOpenState(false);
    });

    // Change the unmounted ref to true on component unmount.
    return () => { isUnmounted.current = true; }

  }, []);


  // Rendering function
  return (
    <div className='component-dropdown-root' style={{ margin }} ref={ref => rootElement.current = ref}>

      <button type='button' className={`cdr-element${error ? ` --cdr-el-error` : ``}`} onClick={() => { openRef.current = !opened; setOpenState(!opened); }}>
        <p className={`cdre-value${currentValue.value === '' ? ` --cdre-placeholder-style` : `` }`}>{currentValue.value !== '' ? currentValue.label : placeholder}</p>
        <img className='cdre-icon' src={ArrowDownIcon} alt='arrow-down' />
      </button>
      <label className={`cdr-label${error ? ` --cdr-lab-error` : ``}`}>{label}</label>

      {
        opened ?
        <div className='cdr-list'>
          { list.map((item, index) => <div key={index} className={`cdrl-item${index === list.length - 1 ? ` --cdrl-item-last-element` : ``}`} onClick={() => handleListClick(item)}>{item.label}</div>)}
        </div> :
        null
      }

      { error ? <Error margin='10px auto 0px auto' errorValue={errorValue} errorMessages={errorMessages} /> : null }
    </div>
  );
};


// @export
export default Dropdown;