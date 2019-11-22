// @module import
import React, { useState, useEffect } from 'react'
import { FormControl, Select, MenuItem } from '@material-ui/core'
import { useCookies } from 'react-cookie'
import { withStyles } from '@material-ui/core'

// @local import
import { languages } from '../../../utils/lang'
import { i18n } from '../../i18n'
import './index.css'
import BottomArrowIcon from '../../../static/assets/bottom_arrow_icon.svg'


// @component
const LangBtn = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [menuState, setMenuState] = useState(false);
  
  const [cookies, setCookies, removeCookies] = useCookies(['next-i18next']);
  const prefLang = cookies['next-i18next'] === undefined ? 'en' : cookies['next-i18next'];

  useEffect(() => {
    setSelectedLanguage(prefLang);
  }, []);

  const languagesSwitch = e => {
    if (e.target.value !== selectedLanguage) {
      i18n.changeLanguage(e.target.value);
      setSelectedLanguage(e.target.value);
      setMenuState(false);
    }
  }

  return (
    <div className="lang-btn-root">
      <button
        value={selectedLanguage}
        onClick={() => setMenuState(!menuState)}
        className='lang-btn-select'
      >
        {selectedLanguage}
        <img src={BottomArrowIcon} className={menuState ? ' --activated' : ''} />
      </button>

      <div className={menuState ? "lang-btn-menu" : "--disable" }>
        {
          languages.map((item, index) => 
            <button
              key={index}
              value={item}
              onClick={languagesSwitch}
              className={selectedLanguage === item ? "lang-btn-menu-item-selected" : "lang-btn-menu-item"}
            >
              {item}
            </button>)
        }
      </div>
    </div>
  );
};

export default LangBtn;