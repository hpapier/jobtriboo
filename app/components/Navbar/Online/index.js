// @module import
import { useCookies } from 'react-cookie';
import { useRouter } from 'next/router';


// @local import
import Layout from '../Layout';
import Logo from '../Logo';
import LangButton from '../LangButton';
import AnnounceIcon from '../../../static/assets/announces_icon_grey.svg';
import CompaniesIcon from '../../../static/assets/companies_icon_grey.svg';
import ProfilIcon from '../../../static/assets/profil_icon_g.svg';
import ArrowIcon from '../../../static/assets/arrow_icon_0.svg';
import './index.css';


// @component
const Online = ({ t, setLoginState, userState }) => {
  const [_, __, removeCookies] = useCookies();
  const router = useRouter();

  const handleLogout = () => {
    removeCookies('token', { path: '/' });
    router.push('/');
  }

  return (
    <Layout>
      <div className='sign-online-lb'>
        <div className='sign-online-logo'>
          <Logo />
        </div>

        <div className='sign-online-lb-m'>
          <button className={`sign-online-lb-mbtn${router.pathname === '/jobs' ? ` -navbar-element-active` : ``}`} onClick={() => { console.log('gotojobs'); router.push('/jobs')}}>
            <div className='sign-online-lb-label'>{t('jobs')}</div>
            <img className='sign-online-lb-icon' src={AnnounceIcon} />
          </button>

          <button className={`sign-online-lb-mbtn${router.pathname === '/companies' ? ` -navbar-element-active` : ``}`} onClick={() => router.push('/companies')}>
            <div className='sign-online-lb-label'>{t('companies')}</div>
            <img className='sign-online-lb-icon' src={CompaniesIcon} />
          </button>
          
          <button className={`sign-online-lb-mbtn${router.pathname === '/dashboard' || router.pathname === '/profil' ? ` -navbar-element-active` : ``}`} onClick={() => router.push(userState === 'recruiter' ? '/dashboard' : '/profil')}>
            <div className='sign-online-lb-label'>{userState === 'recruiter' ? t('dashboard') : t('profil')}</div>
            <img className='sign-online-lb-icon' src={ProfilIcon} />
          </button>
        </div>
      </div>

      <div className='nav-state-root'>
        <LangButton />
        <button className='nav-state-logout' onClick={handleLogout}>
          <div className='sign-online-lb-label'>{t('logout')}</div>
          <img className='sign-online-lb-icon' src={ArrowIcon} />
        </button>
      </div>
    </Layout>
  );
}


// @export
export default Online;