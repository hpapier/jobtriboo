// @module import
// @local import
import Logo from '../../Navbar/Logo';
import LangButton from '../../Navbar/LangButton';
import './index.css';


// @component
const SignNavbar = () => {
  return (
    <div className='sign-navbar'>
      <Logo />
      <LangButton />
    </div>
  );
}


// @export
export default SignNavbar;