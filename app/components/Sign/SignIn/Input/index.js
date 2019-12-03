// @module import
import { useState } from 'react'
import { useRouter } from 'next/router';
import { useCookies } from 'react-cookie';


// @local import
import SignNavbar from '../../Navbar';
import './index.css';
import InLogo from '../../../../static/assets/in_w.svg';
import GmailLogo from '../../../../static/assets/gmail_w.svg';
import { request } from '../../../../utils/request';
import { handleInputEmail, handleInputText } from '../../../../utils/input';


// @component
const Input = ({ t }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState({ email: false, password: false, reqRes: 0 });
  const [cookies, setCookie, removeCookie] = useCookies();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const submit = async e => {
    e.preventDefault();

    /* Verification of the email and password input. */
    const CE = handleInputEmail(email);
    const CPW = handleInputText(password);

    if (!CE || !CPW) {
      setError({ ...error, email: !CE, password: !CPW });
      return;
    }

    setLoading(true);

    /* Request for authentication. */
    try {
      const res = await request('/api/authentication', {
        method: 'POST',
        body: { email, password },
        headers: { 'Content-Type': 'application/json' }
      });

      if (res.status === 200) {
        try {
          const data = await res.json();
          setCookie('token', data.token, { path: '/' });
          router.push(data.userState === 'candidate' ? '/profil' : '/dashboard');
        } catch (e) {
          console.log(e);
          setError({ email: false, password: false, reqRes: 500 });
          setLoading(false);
        }
      }
      else {
        setError({ email: false, password: false, reqRes: res.status });
        setLoading(false);
      }
    } catch (e) {
      setError({ email: false, password: false, reqRes: 500 });
      setLoading(false);
    }
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
              className={`signin-input-body-fields-email-input${error.email ? ` -input-error` : ``}`}
              placeholder={t('phEmail')}
              name='signin-email'
              autoComplete='email'
              onChange={e => setEmail(e.target.value)}
              value={email}
              type='email'
            />
            {error.email ? <div className='signin-msg-error'>{t('emptyOrInvalidFormatError')}</div> : null}
          </div>
          <div className='signin-input-body-fields-pwd'>
            <label className='signin-input-body-fields-pwd-label' htmlFor='signin-pwd'>{t('password')}</label>
            <input
              className={`signin-input-body-fields-pwd-input${error.email ? ` -input-error` : ``}`}
              placeholder={t('phPassword')}
              name='signin-pwd'
              autoComplete='new-password'
              onChange={e => setPassword(e.target.value)}
              value={password}
              type='password'
            />
            {error.password ? <div className='signin-msg-error'>{t('emptyOrTooLongError')}</div> : null}
          </div>
          <div className='signin-input-body-fields-btn'>
            <button disabled={loading} className='signin-input-body-fields-btn-login' type='submit'>{!loading ? t('login') : <div className='signin-loading-btn'></div>}</button>
            <button disabled={loading} className='signin-input-body-fields-btn-pwdFg' type='button'>{t('pwdForgotten')}</button>
          </div>

          { error.reqRes === 403 ? <div className='signin-input-error'>{t('badId')}</div> : null}  
          { error.reqRes === 500 ? <div className='signin-input-error'>{t('error500')}</div> : null}  

        </div>

        {/* <div className='signin-input-body-connect'>
          <span className='signin-input-body-connect-line'></span>
          <button className='signin-input-body-connect-linkedin'  type='button'>
            <div className='signin-input-body-connect-linkedin-ib'>
              <img src={InLogo} />
            </div>
            <p className='signin-input-body-connect-linkedin-tb'>
              {t('linkedinConnection')}
            </p>
          </button>
          <button className='signin-input-body-connect-google' type='button'>
            <div className='signin-input-body-connect-google-ib'>
              <img src={GmailLogo} />
            </div>
            <p className='signin-input-body-connect-google-tb'>
              {t('googleConnection')}
            </p>
          </button>
        </div> */}

        <div className='signin-input-body-out'>
          <span className='signin-input-body-out-line'></span>
          <div className='signin-input-body-out-tb'>
            <p className='signin-input-body-out-nvRg'>{t('neverRegistered')}</p>
            <button type='button' className='signin-input-body-out-register' onClick={() => router.push('/signup')}>
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