// @module import
import { useCookies } from 'react-cookie';
import { useRouter } from 'next/router';


// @local import
import Layout from '../Layout';
import Logo from '../Logo';
import NavCandidate from './NavState/NavCandidate';
import NavRecruiter from './NavState/NavRecruiter';
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
          <button className={`sign-online-lb-mbtn${router.pathname === '/jobs' ? ` -active` : ``}`} onClick={() => { console.log('gotojobs'); router.push('/jobs')}}>{t('jobs')}</button>
          <button className={`sign-online-lb-mbtn${router.pathname === '/companies' ? ` -active` : ``}`} onClick={() => router.push('/companies')}>{t('companies')}</button>
          <button className={`sign-online-lb-mbtn${router.pathname === '/dashboard' || router.pathname === '/profil' ? ` -active` : ``}`} onClick={() => router.push(userState === 'recruiter' ? '/dashboard' : '/profil')}>
            {userState === 'recruiter' ? t('dashboard') : t('profil')}
          </button>
        </div>
      </div>

      <div>
        {
          userState ?
          <NavCandidate logout={handleLogout} t={t} /> :
          <NavRecruiter logout={handleLogout} t={t} />
        }
      </div>
    </Layout>
  );
}


// @export
export default Online;