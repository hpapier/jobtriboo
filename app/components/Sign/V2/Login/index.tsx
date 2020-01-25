// @module import
import React, { useState, FormEvent, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useCookies } from 'react-cookie';


// @local import
import './index.css';
import { withTranslation } from '../../../i18n';
import { loginAuthentication } from '../../../../utils/request/authentication';
import { handleInputEmail } from '../../../../utils/input';
import Input from '../../../Form/Input';
import Lang from '../../../Navbar/LangButton';
import Error from '../../../Error';
import Loading from '../../../Loading';


const IllustrationLogin = require('../../../../static/img/illustration-login.svg') as string;


// @component
const Login = ({ t }) => {

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState(null);
  const [loading, setLoading]   = useState(false);
  const [cookie, setCookie, _]  = useCookies();

  const router = useRouter();
  const isUnmounted = useRef(false);


  const handleSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void> = async e => {
    e.preventDefault();

    if (!isUnmounted.current) {
      setError(null);
      setLoading(true);
    }

    if (!handleInputEmail(email)) {
      if (!isUnmounted.current) {
        setError('badId');
        setLoading(false);
      }
      return;
    }

    try {
      const res = await loginAuthentication(email, password);

      if (res.status === 200) {
        const userInfo = await res.json();
        setCookie('token', userInfo.token, { path: '/' });
        router.push(userInfo.userState === 'candidate' ? '/profil' : '/dashboard');
      }
      else if (res.status === 403)
        setError('badId');

      if (!isUnmounted.current)
        setLoading(false);
    }
    catch (e) {
      if (!isUnmounted.current) {
        setError('500')
        setLoading(false);
      }
    }
  }

  useEffect(() => () => { isUnmounted.current = true }, []);


  return (
    <div id='login-root'>
      <div id='lr-nav'>
        <h1 id='lrn-logo' onClick={() => router.push('/')}>Jobtriboo</h1>

        <div id='lrn-lang'>
          <Lang />
        </div>
      </div>


      <div id='lr-input'>
        <h1 id='lri-title' dangerouslySetInnerHTML={{ __html: t('loginTitle') }}></h1>
        <h3 id='lri-subtitle'>{t('loginSubtitle')}</h3>

        <form id='lri-form' onSubmit={handleSubmit}>
          <Input
            disabled={loading}
            value={email}
            error={error}
            errorValue={''}
            errorMessages={{}}
            changeFn={setEmail}
            type='email'
            placeholder={t('phEmail')}
            label={t('email')}
            autocomplete='email'
            margin='20px 0px'
            onBlurFn={e => {}} />
          <Input
            disabled={loading}
            value={password}
            error={error}
            errorValue={''}
            errorMessages={{}}
            changeFn={setPassword}
            type='password'
            placeholder={t('phPassword')}
            label={t('password')}
            autocomplete='current-password'
            margin='20px 0px 10px 0px'
            onBlurFn={e => {}} />
          <button id='lrif-pwd' type='button' onClick={() => router.push('/pwd')}>{t('pwdForgotten')}</button>

          <div id='lrif-bbox'>
            <div id='lrifb-txt'>
              <p id='lrifbt-nregistered'>{t('neverRegistered')}</p>
              <button id='lrifbt-register' type='button' onClick={() => router.push('/signup')}>{t('register')}</button>
            </div>

            <button id='lrifb-submit' type='submit'>{loading ? <Loading margin='0px' color='white' size='small' />: t('login')}</button>
          </div>

          <Error margin='10px auto' errorValue={error} errorMessages={{ 'badId': t('badId'), '500': t('error500') }} />
        </form>
      </div>


      <img id='lr-img' src={IllustrationLogin} alt="login"/>
    </div>
  );
}


// @export
export default withTranslation('common')(Login);