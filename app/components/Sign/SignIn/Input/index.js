// @module import
import { useState } from 'react'


// @local import
import SignNavbar from '../../Navbar';
import './index.css'
import InLogo from '../../../../static/assets/in_w.svg'
import GmailLogo from '../../../../static/assets/gmail_w.svg'
import { request } from '../../../../utils/request'
import { useRouter } from 'next/router';


// @component
const Input = ({ t }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(200);

  const router = useRouter();

  const submit = async e => {
    e.preventDefault();

    if (email === '' || password === '')
      return;

    const res = await request('/api/authentication', {
      method: 'POST',
      body: { email, password },
      headers: { 'Content-Type': 'application/json' }
    });

    if (res.status === 200)
      console.log(res.status);
    else
      setError(res.status);
  }

  return (
    <div className='signin-input-root'>
      <SignNavbar />

      <form onSubmit={submit} className='signin-input-body'>
        <div className='signin-input-body-fields'>
          <h1 className='signin-input-body-fields-title'>{t('signinTitle')}</h1>
          <div className='signin-input-body-fields-email'>
            <label className='signin-input-body-fields-email-label' htmlFor='signin-email'>{t('email')}</label>
            <input
              className='signin-input-body-fields-email-input'
              placeholder={t('phEmail')}
              name='signin-email'
              autoComplete='email'
              onChange={e => setEmail(e.target.value)}
              value={email}
              type='email'
            />
          </div>
          <div className='signin-input-body-fields-pwd'>
            <label className='signin-input-body-fields-pwd-label' htmlFor='signin-pwd'>{t('password')}</label>
            <input
              className='signin-input-body-fields-pwd-input'
              placeholder={t('phPassword')}
              name='signin-pwd'
              autoComplete='new-password'
              onChange={e => setPassword(e.target.value)}
              value={password}
              type='password'
            />
          </div>
          <div className='signin-input-body-fields-btn'>
            <button className='signin-input-body-fields-btn-login' type='submit'>{t('login')}</button>
            <button className='signin-input-body-fields-btn-pwdFg'>{t('pwdForgotten')}</button>
          </div>
            
          { error !== 200 ?
              error === 403 ?
              <div className='signin-input-error'>{t('badId')}</div>
              : <div className='signin-input-error'>{t('error500')}</div>
            : null
          }
        </div>

        <div className='signin-input-body-connect'>
          <span className='signin-input-body-connect-line'></span>
          <button className='signin-input-body-connect-linkedin'>
            <div className='signin-input-body-connect-linkedin-ib'>
              <img src={InLogo} />
            </div>
            <p className='signin-input-body-connect-linkedin-tb'>
              {t('linkedinConnection')}
            </p>
          </button>
          <button className='signin-input-body-connect-google'>
            <div className='signin-input-body-connect-google-ib'>
              <img src={GmailLogo} />
            </div>
            <p className='signin-input-body-connect-google-tb'>
              {t('googleConnection')}
            </p>
          </button>
        </div>

        <div className='signin-input-body-out'>
          <span className='signin-input-body-out-line'></span>
          <div className='signin-input-body-out-tb'>
            <p className='signin-input-body-out-nvRg'>
              {t('neverRegistered')}
            </p>
            <button className='signin-input-body-out-register' onClick={() => router.push('/signup')}>
              {t('register')}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}


// @export
export default Input;