// @module import
import React from 'react'
import { useRouter } from 'next/router'


// @local import
import style from './style'
import Logo from '../../../static/assets/jb_logo.svg'


/* @component */
const NavbarLogo = () => {
  const router = useRouter();
 
  return (
    <div
      style={style}
      onClick={() => router.pathname !== '/' ? router.push('/') : null}
    >
      <img src={Logo} />
    </div>
  );
}


/* @export */
export default NavbarLogo;