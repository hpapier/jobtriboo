// @module import
import React, { useState, useEffect, useRef } from 'react';
import { WithTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useCookies } from 'react-cookie';


// @local import
import { withTranslation } from '../../i18n';
import './index.css';
import Lang from '../LangButton';


// @interface
interface AppProps extends WithTranslation {
  url: string,
  logInfo: any
}


// @component
const Navbar = ({ url, logInfo, t }: AppProps ) => {

  // General state management.
  const router                                = useRouter();
  const isUnmounted                           = useRef<boolean>(false);
  const [_, __, removeCookies]                = useCookies();
  const [mobileMenuState, setMobileMenuState] = useState<boolean>(false);


  // Handle the logout action.
  const handleLogout = () => {
    removeCookies('token', { path: '/' });
    router.push('/');
  }


  // Component Didmount/Unmount function.
  useEffect(() => {
    // Detect the click outside for the mobile box.
    const element = document.getElementsByClassName('nbs-mobile-box')[0];
    document.addEventListener('click', e => {
      if (window.innerWidth > 800)
        return;

      const target: any = e.target;
      let isClickedOutside: boolean = true;

      element.childNodes.forEach((item: any) => {
        if (item.className === target.className)
          isClickedOutside = false;
      });

      if (isClickedOutside)
        isClickedOutside =
          element.className !== target.className &&
          target.className !== 'nbs-btn-menu'
          && target.className !== 'nbsbm-line --nbsbml-mid-active'
          && target.className !== 'nbsbm-line --nbsbml-top-active'
          && target.className !== 'nbsbm-line'
          && target.className !== 'nbs-btn-menu --nbsbm-active';

      if (isClickedOutside && window.innerWidth <= 800)
        if (!isUnmounted.current) setMobileMenuState(false);
    });

    return () => { isUnmounted.current = true };
  }, []);


  // Rendering function.
  return (
    <div className={`navbar-root${(url === 'jobs' || url === 'companies') ? ` --home-out` : ``}`}>
      <div className='nr-box'>
        <h1 id='nrb-logo' onClick={() => router.push('/')}>Jobtriboo</h1>

        <div className='nrb-menu' onClick={() => router.push('/jobs')}>
          <h2 className={`nrbm-txt${url === 'jobs' ? ` --nr-selected` : ``}`}>{t('jobs')}</h2>
          {url === 'jobs' ? <div className='nrbm-border'></div> : null}
        </div>

        <div className='nrb-menu' onClick={() => router.push('/companies')}>
          <h2 className={`nrbm-txt${url === 'companies' ? ` --nr-selected` : ``}`}>{t('companies')}</h2>
          {url === 'companies' ? <div className='nrbm-border'></div> : null}
        </div>

        {
          logInfo ?
          <>
            <div className='nrb-menu' onClick={() => router.push(logInfo.userState === 'candidate' ? '/profil' : '/dashboard')}>
              <h2 className={`nrbm-txt`}>{t(logInfo.userState === 'candidate' ? 'profil' : 'dashboard')}</h2>
              {/* {url === 'companies' ? <div className='nrbm-border'></div> : null} */}
            </div>
          </> :
          null
        }
      </div>

      <div className='nr-box --nr-box-right'>
        <Lang />

        {
          !logInfo ?
          <>
            <h2 className='nrbm-txt' onClick={() => router.push('/signin')}>{t('login')}</h2>
            <button
              className={`nr-register-btn${(url === 'jobs' || url === 'companies') ? ` --home-out-register` : ``}`}
              onClick={() => router.push('/signup')}
            >
              {t('register')}
            </button>
            <button
              onClick={() => router.push(url === '/recruiter' ? '/' : '/recruiter')}
              className={`nr-recruiter-btn${(url === 'jobs' || url === 'companies') ? ` --home-out-recruiter` : ``}`}
            >
              { url === '/recruiter' ? t('candidate') : t('recruiter')}
            </button>
          </> :
          <>
            <button className={`nr-logout-btn${(url === 'jobs' || url === 'companies') ? ` --home-out-logout` : ``}`} onClick={handleLogout}>
              {t('logout')}
            </button>
          </>
        }

      </div>


      {/* Mobile section */}
      <div className='nr-box-small'>
        <Lang />

        {/* Mobile menu btn */}
        <button
          className={`nbs-btn-menu${mobileMenuState ? ` --nbsbm-active` : ``}`}
          onClick={() => setMobileMenuState(!mobileMenuState)}
        >
          <div className={`nbsbm-line${mobileMenuState ? ` --nbsbml-top-active` : ``}`}></div>
          <div className={`nbsbm-line${mobileMenuState ? ` --nbsbml-mid-active` : ``}`}></div>
          { !mobileMenuState && <div className='nbsbm-line'></div>}
        </button>

        {/* Mobile menu box */}
        <div className='nbs-mobile-box' style={{ display: mobileMenuState ? 'flex' : 'none' }}>
        {
          !logInfo ?
          <>
            <button className='nbsmb-btn' onClick={() => router.push('/signin')}>{t('login')}</button>
            <button className='nbsmb-btn' onClick={() => router.push('/signup')}>{t('register')}</button>
            <button style={{ borderBottom: '1px solid rgba(0, 0, 0, 0)' }} onClick={() => router.push(url === '/recruiter' ? '/' : '/recruiter')} className='nbsmb-btn'>{ url === '/recruiter' ? t('candidate') : t('recruiter')}</button>
          </> :
          <>
            <button onClick={() => router.push('/jobs')} className='nbsmb-btn --nbsmbb-actions'>{t('jobs')}</button>
            <button onClick={() => router.push('/companies')} className='nbsmb-btn --nbsmbb-actions'>{t('companies')}</button>
            <button onClick={() => router.push('/companies')} className='nbsmb-btn --nbsmbb-actions'>{t(logInfo.userState === 'candidate' ? 'profil' : 'dashboard')}</button>
            <button style={{ borderBottom: '1px solid rgba(0, 0, 0, 0)' }} onClick={handleLogout} className='nbsmb-btn'>{t('logout')}</button>
          </>
        }
        </div>
      </div>
    </div>
  );
}


// @export
export default withTranslation('common')(Navbar);