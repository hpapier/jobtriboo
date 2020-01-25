// @module import
import React, { useState, FormEvent, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useCookies } from 'react-cookie';


// @local import
import './index.css';
import { withTranslation } from '../../../i18n';
import { registerAuthentication } from '../../../../utils/request/authentication';
import { handleInputEmail, handleInputText, handleInputPhone } from '../../../../utils/input';
import Input from '../../../Form/Input';
import Lang from '../../../Navbar/LangButton';
import Error from '../../../Error';
import Loading from '../../../Loading';
import Checkbox from '../../../CheckBox'


const IllustrationRegister = require('../../../../static/img/illustration-signup.svg') as string;


// @interface
interface errorObject {
  userState: string,
  firstname: string,
  lastname: string,
  email: string,
  phone: string,
  password: string,
  other: string
}

// @component
const Register = ({ t }) => {

  const errorObject: errorObject = {
    userState: null,
    firstname: null,
    lastname: null,
    email: null,
    phone: null,
    password: null,
    other: null
  };

  const [userState, setUserState] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname]   = useState('');
  const [email, setEmail]         = useState('');
  const [phone, setPhone]         = useState('');
  const [password, setPassword]   = useState('');
  const [CGUCb, setCGUCb]         = useState(true);

  const [error, setError]         = useState(errorObject);

  const [loading, setLoading]     = useState(false);
  const [cookie, setCookie, _]    = useCookies();

  const router = useRouter();
  const isUnmounted = useRef(false);


  // @Register Input Error Handler
  const handleInputErrors: () => boolean = () => {
    let errors = errorObject;

    if (userState === '') errors.userState = 'empty';
    if (!handleInputText(firstname, 100)) errors.firstname = 'badId';
    if (!handleInputText(lastname, 100)) errors.lastname = 'badId';
    if (!handleInputEmail(email)) errors.email = 'badId';
    if (!handleInputPhone(phone)) errors.phone = 'badId';
    if (!handleInputText(password)) errors.password = 'badId';
    if (!CGUCb) errors.other = 'cguMandatory';

    if (
      errors.userState  !== null  ||
      errors.firstname  !== null  ||
      errors.lastname   !== null  ||
      errors.email      !== null  ||
      errors.phone      !== null  ||
      errors.password   !== null  ||
      errors.other      !== null
    ) {
      console.log(errors);
      setError({ ...errors });
      return true;
    }

    return false;
  }


  // @Register Request Handler
  const handleSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void> = async e => {
    e.preventDefault();

    if (!isUnmounted.current) {
      setError(errorObject);
      setLoading(true);
    }


    if (handleInputErrors()) {
      if (!isUnmounted.current)
        setLoading(false);
      return;
    }


    try {
      const res = await registerAuthentication(userState, firstname, lastname, email, phone, password);

      if (res.status === 201) {
        const userInfo = await res.json();
        setCookie('token', userInfo.token, { path: '/' });
        router.push(userInfo.userState === 'candidate' ? '/profil' : '/dashboard');
      }
      else if (res.status === 200) {
        const response = await res.json();

        if (response.errorMsg === 'formatError') {
          if (!isUnmounted.current)
            setError({ ...errorObject, userState: 'empty', firstname: 'badId', lastname: 'badId', email: 'badId', phone: 'badId', password: 'badId' });
        }
        else if (response.errorMsg === 'notAvailable') {
          if (!isUnmounted.current)
            setError({ ...errorObject, email: 'notAvailable', other: 'notAvailable' });
        }
      }

      if (!isUnmounted.current)
        setLoading(false);
    }
    catch (e) {
      if (!isUnmounted.current) {
        setError({ ...errorObject, other: '500' });
        setLoading(false);
      }
    }
  }


  useEffect(() => () => { isUnmounted.current = true }, []);


  return (
    <div id='register-root'>
      <div id='rr-nav'>
        <h1 id='rrn-logo' onClick={() => router.push('/')}>Jobtriboo</h1>

        <div id='rrn-lang'>
          <Lang />
        </div>
      </div>


      <div id='rr-input'>
        <h1 id='rri-title' dangerouslySetInnerHTML={{ __html: t('registerTitle') }}></h1>
        <h3 id='rri-subtitle'>{t('registerSubtitle')}</h3>

        <form id='rri-form' onSubmit={handleSubmit}>
          <div id='rrif-userstate'>
            <button
              type='button'
              onClick={() => setUserState('candidate')}
              className={`rrifu-btn${userState === 'candidate' ? ` --rr-user-state-selected`: ``}`}
            >
              {t('candidate')}
            </button>
            <button
              type='button'
              onClick={() => setUserState('recruiter')}
              className={`rrifu-btn${userState === 'recruiter' ? ` --rr-user-state-selected`: ``}`}
            >
              {t('recruiter')}
            </button>
          </div>
          { error.userState !== null ? <Error margin='0px auto' errorValue={error.userState} errorMessages={{ 'empty': t('userStateEmptyChoice') }} /> : null }

          <Input
            disabled={loading}
            value={firstname}
            error={error.firstname !== null ? true : false}
            errorValue={error.firstname}
            errorMessages={{ 'badId': t('inputTextError') }}
            changeFn={setFirstname}
            type='text'
            placeholder={t('phFirstname')}
            label={t('firstname')}
            autocomplete='given-name'
            margin='20px 0px'
            onBlurFn={e => {}} />
          <Input
            disabled={loading}
            value={lastname}
            error={error.lastname !== null ? true : false}
            errorValue={error.lastname}
            errorMessages={{ 'badId': t('inputTextError') }}
            changeFn={setLastname}
            type='text'
            placeholder={t('phLastname')}
            label={t('lastname')}
            autocomplete='family-name'
            margin='20px 0px 10px 0px'
            onBlurFn={e => {}} />
          <Input
            disabled={loading}
            value={email}
            error={error.email !== null ? true : false}
            errorValue={error.email}
            errorMessages={{ 'badId': t('inputEmailError'), 'notAvailable': t('emailNotAvailable') }}
            changeFn={setEmail}
            type='email'
            placeholder={t('phEmail')}
            label={t('email')}
            autocomplete='email'
            margin='20px 0px 10px 0px'
            onBlurFn={e => {}} />
          <Input
            disabled={loading}
            value={phone}
            error={error.phone !== null ? true : false}
            errorValue={error.phone}
            errorMessages={{ 'badId': t('inputPhoneError') }}
            changeFn={setPhone}
            type='tel'
            placeholder={t('phPhoneNumber')}
            label={t('phoneNumber')}
            autocomplete='tel'
            margin='20px 0px 10px 0px'
            onBlurFn={e => {}} />
          <Input
            disabled={loading}
            value={password}
            error={error.password !== null ? true : false}
            errorValue={error.password}
            errorMessages={{ 'badId': t('inputPasswordError') }}
            changeFn={setPassword}
            type='password'
            placeholder={t('phPassword')}
            label={t('password')}
            autocomplete='new-password'
            margin='20px 0px 10px 0px'
            onBlurFn={e => {}} />

          <div id='rrif-bbox'>
            <div id='rrifb-txt'>
              <p id='rrifbt-nregistered'>{t('alreadyAnAccount')}</p>
              <button id='rrifbt-register' type='button' onClick={() => router.push('/signin')}>{t('login')}</button>
            </div>

            <button id='rrifb-submit' type='submit'>{loading ? <Loading margin='0px' color='white' size='small' />: t('register')}</button>
          </div>

          <Checkbox label={t('cguCheckboxLabel')} check={n => setCGUCb(!n)} isChecked={CGUCb} />

          { error.other !== null ? <Error margin='10px auto' errorValue={error.other} errorMessages={{ 'notAvailable': t('notAvailable'), '500': t('error500'), 'cguMandatory': t('cguMandatory') }} /> : null }
        </form>
      </div>


      <img id='rr-img' src={IllustrationRegister} alt='login' />
    </div>
  );
}


// @export
export default withTranslation('common')(Register);