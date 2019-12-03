// @module import
import { useState } from 'react'
import { useRouter } from 'next/router'

// @local import
import SignNavbar from '../../Navbar';
import './index.css';
import InLogo from '../../../../static/assets/in_w.svg';
import GmailLogo from '../../../../static/assets/gmail_w.svg';
import { request } from '../../../../utils/request';
import { handleInputText, handleInputEmail, handleInputPrefix, handleInputNumber } from '../../../../utils/input';
import { useCookies } from 'react-cookie';


// @component
const Input = ({ t }) => {
  const [userState, setUserState] = useState('candidate');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [prefixPhoneNumber, setPrefixPhoneNumber] = useState('+33');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState({
    firstName: false,
    lastName: false,
    email: false,
    password: false,
    prefixPhoneNumber: false,
    phoneNumber: false,
    reqRes: 0
  });
  const [loading, setLoading] = useState(false);
  const [cookies, setCookie, removeCookie] = useCookies();
  const router = useRouter();

  const submit = async e => {
    e.preventDefault();
    console.log('submition');

    const CFN = handleInputText(firstName);
    const CLN = handleInputText(lastName);
    const CE  = handleInputEmail(email);
    const CPW = handleInputText(password);
    const CPPN = handleInputPrefix(prefixPhoneNumber);
    const CPN = handleInputNumber(phoneNumber);

    if (!CFN || !CLN || !CE || !CPW || !CPPN || !CPN) {
      setError({
        firstName: !CFN,
        lastName: !CLN,
        email: !CE,
        password: !CPW,
        prefixPhoneNumber: !CPPN,
        phoneNumber: !CPN,
        reqRes: 0
      });
      return;
    } else {
      setError({
        firstName: false,
        lastName: false,
        email: false,
        password: false,
        prefixPhoneNumber: false,
        phoneNumber: false,
        reqRes: 0
      })
    }

    /* If all fields are valid, make the request. */
    try {
      setLoading(true);

      /* POST request */
      const res = await request('/api/register', {
        method: 'POST',
        body: { userState, firstName, lastName, email, password, prefixPhoneNumber, phoneNumber },
        headers: { 'Content-Type': 'application/json' }
      });

      /* Handling response (Receive 200 + msg on error caused by an invalid email, and 201 on account creation success) */
      if (res.status === 200) {
        setLoading(false);
        setError({ ...error, email: true });
      }
      else if (res.status === 201) {
        // Check the response and correctly handle them.
        try {
          const data = await res.json();

          setCookie('token', data.token, { path: '/' });

          if (data.userState === 'candidate')
            router.push('/profil');
          else if (data.userState === 'recruiter')
            router.push('/dashboard');

        } catch (e) {
          setLoading(false);
          setError({ ...error, reqRes: 500 });
        }
      } else {
        setLoading(false);
        setError({ ...error, reqRes: res.status });
      }
    } catch (e) {
      console.log('What happen: ', e);
      setLoading(false);
      setError({ ...error, reqRes: 500 });
    }

  }

  return (
    <div className='signup-input-root'>
      <SignNavbar />

      <form onSubmit={submit} className='signup-input-body'>
        <div className='signup-input-body-fields'>
          <h1 className='signup-input-body-fields-title'>{t('signupTitle')}</h1>

          <div className='signup-input-body-fields-us'>
            <div
              onClick={() => useState !== 'candidate' ? setUserState('candidate') : null}
              className={userState === 'candidate' ? 'signup-input-body-fields-us-active' : 'signup-input-body-fields-us-inactive'}
            >
              {t('candidate')}
            </div>
            <div
              onClick={() => useState !== 'recruiter' ? setUserState('recruiter') : null}
              className={userState === 'recruiter' ? 'signup-input-body-fields-us-active' : 'signup-input-body-fields-us-inactive'}  
            >
              {t('recruiter')}
            </div>
          </div>

          <div className='signup-input-body-fields-ib'>
            <label className='signup-input-body-fields-ib-label' htmlFor='signup-firstName'>{t('firstName')}</label>
            <input
              className={`signup-input-body-fields-ib-input${error.firstName ? ` -input-error` : ``}`}
              placeholder={t('phFirstName')}
              name='signup-firstName'
              autoComplete='first-name'
              onChange={e => setFirstName(e.target.value)}
              value={firstName}
              type='text'
            />
            {error.firstName ? <div className='signup-msg-error'>{t('emptyOrTooLongError')}</div> : null}
          </div>

          <div className='signup-input-body-fields-ib'>
            <label className='signup-input-body-fields-ib-label' htmlFor='signup-lastName'>{t('lastName')}</label>
            <input
              className={`signup-input-body-fields-ib-input${error.lastName ? ` -input-error` : ``}`}
              placeholder={t('phLastName')}
              name='signup-lastName'
              autoComplete='last-name'
              onChange={e => setLastName(e.target.value)}
              value={lastName}
              type='text'
            />
            {error.lastName ? <div className='signup-msg-error'>{t('emptyOrTooLongError')}</div> : null}
          </div>

          <div className='signup-input-body-fields-ib'>
            <label className='signup-input-body-fields-ib-label' htmlFor='signup-email'>{t('email')}</label>
            <input
              className={`signup-input-body-fields-ib-input${error.email ? ` -input-error` : ``}`}
              placeholder={t('phEmail')}
              name='signup-email'
              autoComplete='email'
              onChange={e => setEmail(e.target.value)}
              value={email}
              type='email'
            />
            {error.email ? <div className='signup-msg-error'>{t('emailError')}</div> : null}
          </div>

          <div className='signup-input-body-fields-ib'>
            <label className='signup-input-body-fields-ib-label' htmlFor='signup-password'>{t('password')}</label>
            <input
              className={`signup-input-body-fields-ib-input${error.password ? ` -input-error` : ``}`}
              placeholder={t('phPassword')}
              name='signup-password'
              autoComplete='password'
              onChange={e => setPassword(e.target.value)}
              value={password}
              type='password'
            />
            {error.password ? <div className='signup-msg-error'>{t('emptyOrTooLongError')}</div> : null}
          </div>

          <div className='signup-input-body-fields-ib'>
            <label className='signup-input-body-fields-ib-label' htmlFor='signup-phoneNumber'>{t('phoneNumber')}</label>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%'}}>
              <input
                className={`signup-input-body-fields-ib-input -prefix-phone-number${error.prefixPhoneNumber ? ` -input-error` : ``}`}
                placeholder='+33'
                name='signup-prefix-phoneNumber'
                autoComplete='prefix'
                onChange={e => setPrefixPhoneNumber(e.target.value)}
                value={prefixPhoneNumber}
                type='text'
              />
              <input
                className={`signup-input-body-fields-ib-input -phone-number${error.phoneNumber ? ` -input-error` : ``}`}
                placeholder={t('phPhoneNumber')}
                name='signup-phoneNumber'
                autoComplete='phone-number'
                onChange={e => setPhoneNumber(e.target.value)}
                value={phoneNumber}
                type='text'
              />
            </div>
            {error.prefixPhoneNumber || error.phoneNumber ? <div className='signup-msg-error'>{t('emptyOrInvalidFormatError')}</div> : null}
          </div>

          <div className='signup-input-body-fields-btn'>
            <button disabled={loading} className='signup-input-body-fields-btn-login' type='submit'>
              { loading ? <div className='signup-input-body-fields-btn-login-loading'></div> : t('validate')}
            </button>
            {/* <button className='signup-input-body-fields-btn-pwdFg'>Accept the C.G.U</button> */}
          </div>

          { error.reqRes === 403 ? <div className='signup-input-error'>{t('badId')}</div> : null}
          { error.reqRes === 500 ? <div className='signup-input-error'>{t('error500')}</div> : null}

        </div>

        {/* <div className='signup-input-body-connect'>
          <span className='signup-input-body-connect-line'></span>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%'}}>
            <button type='button' className='signup-input-body-connect-linkedin-ib'>
                <img src={InLogo} />
            </button>
            <button type='button' className='signup-input-body-connect-google-ib'>
                <img src={GmailLogo} />
            </button>
          </div>
        </div> */}

        <div className='signup-input-body-out'>
          <span className='signup-input-body-out-line'></span>
          <div className='signup-input-body-out-tb'>
            <p className='signup-input-body-out-nvRg'>
              {t('alreadyAnAccount')}
            </p>
            <button onClick={() => router.push('/signin')} type='button' className='signup-input-body-out-register'>
              {t('login')}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}


// @export
export default Input;