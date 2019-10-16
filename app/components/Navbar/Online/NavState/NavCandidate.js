// @module import
// @local import
import './index.css';
import LangButton from '../../LangButton';


// @component
const NavCandidate = ({ logout, t }) => {
  return (
    <div className='nav-state-root'>
      <LangButton />
      <button className='nav-state-logout' onClick={logout}>{t('logout')}</button>
    </div>
  );
};


// @export
export default NavCandidate;