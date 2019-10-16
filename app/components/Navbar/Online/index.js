// @module import
import { useCookies } from 'react-cookie'
import { useRouter } from 'next/router'
import { Button } from '@material-ui/core'


// @local import
import Layout from '../Layout'
import Logo from '../Logo'
import LangButton from '../LangButton'

// @component
const Online = ({ t, setLoginState, userState }) => {
  const [_, __, removeCookies] = useCookies();
  const router = useRouter();

  const handleLogout = () => {
    // console.log('- LOGOUT -');
    removeCookies('token');
    router.push('/');
  }

  return (
    <Layout>
      <div>
        <Logo />
        <button onClick={() => router.push('/jobs')}>{t('jobs')}</button>
        <button onClick={() => router.push('/company')}>{t('companies')}</button>
        <button onClick={() => router.push(userState === 'recruiter' ? '/dashboard' : '/profil')}>
          {userState === 'recruiter' ? t('dashboard') : t('profil')}
        </button>
      </div>

      <div>
        <LangButton />
        <Button onClick={handleLogout}>{t('logout')}</Button>
      </div>
    </Layout>
  );
}


// @export
export default Online;