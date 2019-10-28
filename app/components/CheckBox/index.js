// @module import
import { useRef, useState } from 'react';


// @local import
import './index.css';
import CheckIcon from '../../static/assets/check-icon-white.svg';


// @component
const CheckBox = ({ label, request, checked, setCheckState }) => {
  const [loading, setLoading] = useState(false);
  const isUnmounted = useRef(false);

  const handleClick = async value => {
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
    <div className='checkbox-root'>
      <button disabled={loading} className={`checkbox-btn${checked ? ` -checked` : ``}`} onClick={() => handleClick(!checked)}>
        { checked ? <img src={CheckIcon} /> : null }
      </button>
      <p className='checkbox-label'>{label}</p>
    </div>
  );
};


// @export
export default CheckBox;