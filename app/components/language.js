import React, { useState, useEffect } from 'react'
import { languages } from '../utils/lang'
import { i18n } from './i18n'
import { FormControl, Select, MenuItem } from '@material-ui/core'
import { useCookies } from 'react-cookie'



const languageBtnStyle = {
  width: 80
}

const languageItemStyle = {
  'selected': {
    backgroundColor: 'red'
  }
}

const LangBtn = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  const [cookies, setCookies, removeCookies] = useCookies(['next-i18next']);
  const prefLang = cookies['next-i18next'] === undefined ? 'en' : cookies['next-i18next'];

  useEffect(() => {
    setSelectedLanguage(prefLang);
  }, []);

  const languagesSwitch = e => {
    i18n.changeLanguage(e.target.value);
    setSelectedLanguage(e.target.value);
  }

  return (
    <FormControl style={languageBtnStyle}>
      <Select
        value={selectedLanguage}
        style={{ color: '#fff', textTransform: 'uppercase', height: '60px' }}
        onChange={languagesSwitch}
        variant="filled"
      >
        { languages.map((item, index) => <MenuItem key={index} value={item}>{item}</MenuItem>)}
      </Select>
    </FormControl>
  );
};

export default LangBtn;