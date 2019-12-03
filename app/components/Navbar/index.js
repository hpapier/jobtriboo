// @module import
import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useCookies } from 'react-cookie'


// @local import
import Online from './Online'
import Offline from './Offline'


// @component
const Navbar = ({ logInfo }) => {
  console.log(logInfo);
  return (logInfo ? <Online userState={logInfo.userState} /> : <Offline />);
}


// @export
export default Navbar;