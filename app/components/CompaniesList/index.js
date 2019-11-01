// @module import
import { useState, useEffect, useRef } from 'react';


// @local import
import './index.css'
import DropdownIconGrey from '../../static/assets/bottom_arrow_icon.svg';
import { withTranslation } from '../i18n';
import { getRecruiterCompanies } from '../../utils/request/companies';


// @component
const CompaniesList = ({ t, token, rootStyle }) => {
  const [list, setList] = useState(['anonymous']);
  const [listOpened, setListOpened] = useState(false);
  const [selected, setSelected] = useState('anonymous');
  const [loading, setLoading] = useState(true);
  const isUnmounted = useRef(false);


  const fetCompaniesList = async () => {
    try {
      const res = await getRecruiterCompanies(token);
      if (res.status === 200) {
        const data = await res.json();
        if (!isUnmounted.current) {
          console.log(data);
          setList(data);
          setLoading(false);
        }
      } else
        throw res.status;
    } catch (e) {
      console.log(e);
    }
  }


  useEffect(() => {
    fetCompaniesList();
    return () => { isUnmounted.current = true };
  }, [])


  return (
    <div style={rootStyle} className='component-companies-list-root'>
      <div className='component-companies-list-subroot'>
        <button disabled={loading} className='component-companies-list-btn' onClick={() => setListOpened(!listOpened)}>
          {selected === 'anonymous' ? t('anonymous') : selected.name }
          <img src={DropdownIconGrey} alt='dropdown-icon' className={listOpened ? '-rotated' : ''} />
        </button>
        <div className='component-companies-list-box'>
          {
            listOpened ? 
            list.map((item, index) => {
              <div className='component-companies-list-box-item' key={index} onClick={() => setSelected(item)}>
                { (item === 'anonymous') ? t('anonymous') : item.name }
              </div>
            }) :
            null
          }
        </div>
      </div>
    </div>
  );
}


// @export
export default withTranslation('common')(CompaniesList);