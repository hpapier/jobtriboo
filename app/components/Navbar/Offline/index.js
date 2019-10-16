// @module import
import { useRouter } from 'next/router';


// @local import
import LangButton from '../LangButton';
import Layout from '../Layout';
import Logo from '../Logo';
import Feather from '../../../static/assets/feather_icon.svg';
import Arrow from '../../../static/assets/arrow_icon_0.svg';
import './index.css';


// @component
const Offline = ({ t }) => {
  const router = useRouter();
  return (
    <Layout>
      <div className='navbar-offline-logo'>
        <Logo/>
      </div>

      <div className='navbar-offline-rbox'>
        <LangButton />

        {
          router.pathname === '/recruiter' ?
          (<button className='navbar-offline-rbox-text' onClick={() => router.push('/signin')}>
            {t('pricing')}
          </button>)
          : null
        }

        <button className='navbar-offline-rbox-text' onClick={() => router.push('/signin')}>
          {t('login')}
        </button>

        <button className='navbar-offline-rbox-signup' onClick={() => router.push('/signup')}>
          {t('register')}
          <img src={Feather} />
        </button>

        <button className='navbar-offline-rbox-personna' onClick={() => router.push(router.pathname === '/recruiter' ? '/' : '/recruiter')}>
          { (router.pathname === '/recruiter') ? t('candidate') : t('recruiter') }
          <img src={Arrow} />
        </button>
      </div>
    </Layout>
  )
};


// @export
export default Offline;