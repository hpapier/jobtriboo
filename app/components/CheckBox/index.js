// @module import
import { useRef, useState } from 'react';


// @local import
import './index.css';
import CheckIcon from '../../static/assets/check-icon-white.svg';


// @component
const CheckBox = ({ label, margin = '0px 0px 0px 20px', size = null, request = null, checked, setCheckState, disabled = false }) => {
  const [loading, setLoading] = useState(false);
  const isUnmounted = useRef(false);

  const handleClick = async value => {
    if (disabled)
      return;

    if (request === null) {
      setCheckState(value);
      return;
    }

    if (!isUnmounted.current)
      setLoading(true);

    try {
      const res = await request(!checked);
      if (res.status === 200) {
        if (!isUnmounted.current) {
          setLoading(false);
          setCheckState(value);
        }
      }
      else
        throw res.status;
    } catch (e) {
      console.log('-> CheckBox Component (ERROR):');
      console.log(e);
      if (!isUnmounted.current)
        setLoading(false);
    }
  }

  return (
    <div className={`checkbox-root${disabled ? ` -disabled` : ``}`} style={{ margin }}>
      { size !== null ? 
        <button style={{ width: size.width, height: size.height }} disabled={loading || disabled} className={`checkbox-btn${checked ? ` -checked` : ``}`} onClick={() => handleClick(!checked)}>
          { checked ? <img src={CheckIcon} /> : null }
        </button> :
        <button disabled={loading || disabled} className={`checkbox-btn${checked ? ` -checked` : ``}`} onClick={() => handleClick(!checked)}>
          { checked ? <img src={CheckIcon} /> : null }
        </button>
      }
      <p className='checkbox-label'>{label}</p>
    </div>
  );
};


// @export
export default CheckBox;