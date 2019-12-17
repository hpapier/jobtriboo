// @module import
import { useRouter } from 'next/router';


// @local import
import LangButton from '../LangButton';
import Layout from '../Layout';
import Logo from '../Logo';
import Feather from '../../../static/assets/feather_icon.svg';
import Arrow from '../../../static/assets/arrow_icon_0.svg';

import AnnounceIcon from '../../../static/assets/announces_icon_grey.svg';
import CompaniesIcon from '../../../static/assets/companies_icon_grey.svg';

import { withTranslation } from '../../i18n';
import './index.css';
import '../Online/index.css'

// @component
const Offline = ({ t }) => {
  const router = useRouter();
  return (
    <Layout>
      <div style={{ display: 'flex' }}>
        <div className='navbar-offline-logo'>
          <Logo/>
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
        </div>
      </div>


      <div className='navbar-offline-rbox'>
        <LangButton />

        {/* {
          router.pathname === '/recruiter' ?
          (<button className='navbar-offline-rbox-text' id='navbar-offline-pricing-btn' onClick={() => console.log('go to pricing section')}>
            {t('pricing')}
          </button>)
          : null
        } */}

        <button className='navbar-offline-rbox-text' onClick={() => router.push('/signin')}>
          {t('login')}
        </button>

        <button className='navbar-offline-rbox-signup' onClick={() => router.push('/signup')}>
          {t('register')}
          <img className='navbar-offline-icon' src={Feather} />
        </button>

        <button className='navbar-offline-rbox-personna' onClick={() => router.push(router.pathname === '/recruiter' ? '/' : '/recruiter')}>
          { (router.pathname === '/recruiter') ? t('candidate') : t('recruiter') }
          <img className='navbar-offline-icon' src={Arrow} />
        </button>
      </div>
    </Layout>
  )
};


// @export
export default withTranslation('common')(Offline);