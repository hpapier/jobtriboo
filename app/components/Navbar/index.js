// @module import
import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useCookies } from 'react-cookie'


// @local import
import { withTranslation } from '../i18n'
import Online from './Online'
import Offline from './Offline'


// @component
const Navbar = ({ isLoggedIn, t, setLoginState, loginState }) => {
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
  });

  return (loginState ? <Online t={t} setLoginState={setLoginState} /> : <Offline t={t} />);
}


// @export
export default withTranslation('common')(Navbar);