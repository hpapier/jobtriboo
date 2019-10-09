import React, { useState, useEffect, useContext } from 'react'
import { withTranslation, i18n } from './i18n'

import { Button, FormControl, Select, MenuItem, withStyles } from '@material-ui/core'

// import { checkAuth } from '../utils/auth'
import ModalConnexion from '../store/container/modalConnexion'
import { languages } from '../utils/lang'
import { useRouter } from 'next/router'

import LangBtn from './language'
import { useCookies } from 'react-cookie'


/* Header style (need to move) */
const headerLayoutStyle = {
  // backgroundColor: '#fb9e91',
  // backgroundColor: '#90aeff',
  background: 'linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)',
  boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .30)',
  width: '100%',
  height: '60px',
  display: 'flex',
  justifyContent: 'space-between'
}

const headerBtnStyle = {
  borderLeft: "1px solid rgba(0, 0, 0, 0.05)",
  margin: "0px",
  borderRadius: 0,
  height: '100%',
  color: "white",
  padding: '0px 40px',
  // backgroundColor: '#87e5da'
  background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
  // boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)'
}

const headerLogo = {
  color: '#FFF',
  width: 300,
  height: '65px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: '2em',
  textTransform: 'uppercase',
  fontWeight: '600',
  // fontStyle: 'italic',
  textShadow: '2px 2px rgba(0, 0, 0, 0.2)'
}

/* Component */
const HeaderLayout = props => (
  <div style={headerLayoutStyle}>
    {props.children}
  </div>
);

const JobTribooLogo = () => {
  const router = useRouter();

  return (
    <div
      style={headerLogo}
      onClick={() => router.pathname !== '/' ? router.push('/') : null}
    >
      JobTriboo
    </div>
  );
}

const HeaderOnline = ({ t, setLoginState }) => {
  const [cookies, setCookies, removeCookies] = useCookies();
  const router = useRouter();

  const handleLogout = () => {
    console.log('LOGOUT')
    removeCookies('token');
    setLoginState(false);
  }

  return (
    <HeaderLayout>
      <div>
        <JobTribooLogo />
      </div>

      <div>
        <LangBtn />
        <Button style={headerBtnStyle} onClick={() => router.push('/dashboard')}>{t('dashboard')}</Button>
        <Button style={headerBtnStyle}>{t('settings')}</Button>
        <Button style={headerBtnStyle} onClick={handleLogout}>{t('logout')}</Button>
      </div>
    </HeaderLayout>
  );
}

const HeaderOffline = ({ t }) => {
  const [modalOpen, setModalOpenState] = useState(false);
  const [modalWindowLogin, setMWindowLogin] = useState(false);

  const openModalMechanism = (modalWindowState) => {
    setModalOpenState(true);
    setMWindowLogin(modalWindowState);
  }

  return (
    <HeaderLayout>
      <div>
        <JobTribooLogo />
      </div>

      <div>
        <LangBtn />
        <Button
          style={headerBtnStyle}
          onClick={() => openModalMechanism(true)}
        >
          {t('login')}
        </Button>
        <Button
          style={headerBtnStyle}
          onClick={() => openModalMechanism(false)}
        >
          {t('register')}
        </Button>
      </div>

      <ModalConnexion
        setModalOpenState={setModalOpenState}
        setMWindowLogin={setMWindowLogin}
        modalWindowLogin={modalWindowLogin}
        modalOpen={modalOpen}
      />
    </HeaderLayout>
  )
};

const Header = ({ isLoggedIn, t, setLoginState, loginState }) => {
  const [cookies] = useCookies();
  const router = useRouter();

  useEffect(() => {

    if (isLoggedIn !== undefined && cookies.token === undefined) {
      setLoginState(false);
      if (router.pathname === '/settings')
        router.push('/');
    }
    else if (isLoggedIn !== undefined && !loginState) {
      setLoginState(isLoggedIn);
      if (!isLoggedIn && router.pathname === '/settings')
        router.push('/');
    }

    console.log(isLoggedIn, loginState)
  });

  return (loginState ? <HeaderOnline t={t} setLoginState={setLoginState} /> : <HeaderOffline t={t} />);
}

export default withTranslation('common')(Header);