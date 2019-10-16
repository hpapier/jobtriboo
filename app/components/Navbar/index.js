// @module import
import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useCookies } from 'react-cookie'


// @local import
import { withTranslation } from '../i18n'
import Online from './Online'
import Offline from './Offline'


// @component
const Navbar = ({ logInfo, t }) => {
  console.log(logInfo);
  return (logInfo ? <Online t={t} userState={logInfo.userState} /> : <Offline t={t} />);
}


// @export
export default withTranslation('common')(Navbar);