// @module import
import { useCookies } from 'react-cookie'
import { useRouter } from 'next/router'
import { Button } from '@material-ui/core'


// @local import
import Layout from '../Layout'
import Logo from '../Logo'
import LangButton from '../LangButton'

// @component
const Online = ({ t, setLoginState }) => {
  const [_, __, removeCookies] = useCookies();
  const router = useRouter();

  const handleLogout = () => {
    console.log('- LOGOUT -');
    removeCookies('token');
    setLoginState(false);
  }

  return (
    <Layout>
      <div>
        <Logo />
      </div>

      <div>
        <LangButton />
        <Button onClick={() => router.push('/dashboard')}>{t('dashboard')}</Button>
        <Button onClick={handleLogout}>{t('logout')}</Button>
      </div>
    </Layout>
  );
}


// @export
export default Online;