// @module import
import React, { useState } from 'react';
import { WithTranslation } from 'next-i18next';
import { useRouter } from 'next/router';


// @local import
import { withTranslation } from '../../i18n';
import Input from '../../Form/Input';
import './index.css';
import Lang from '../../Navbar/LangButton';


const IllustrationPwd = require('../../../static/img/illustration-password-fgt.svg') as string;


// @interface
interface AppProps extends WithTranslation {}


// @component
const PwdReset: (props: AppProps) => JSX.Element = ({ t }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const router = useRouter();

  return (
    <div id='pwd-reset-root'>
      <div id='prr-head'>
        <h1 id='rfrh-logo'>Jobtriboo</h1>
        <Lang />
      </div>

      <div id='prr-input'>
        <h1 id='prri-title' dangerouslySetInnerHTML={{ __html: t('pwdReset-title') }}></h1>
        <h2 id='prri-subtitle'>{t('pwdReset-subtitle')}</h2>
        <Input
          placeholder={t('phPassword')}
          label={t('password')}
          type='email'
          changeFn={setEmail}
          value={email}
          autocomplete='email'
          margin='100px 0px 0px 0px'
          error={error}
          disabled={loading}
          errorValue={error}
          errorMessages={{ 'accountDoesNotExist': t('accountDoesNotExist'), 'InputEmailError': t('InputEmailError') }}
          onBlurFn={e => {}}
        />
        <button id='prri-btn'>{t('reinitialize')}</button>

        <div id='prri-txt'>
          <p id='prrit-phrase'>{t('neverRegistered')}</p>
          <button id='prrit-login' onClick={() => router.push('/signup')}>{t('register')}</button>
        </div>
      </div>

      <img id='prr-img' src={IllustrationPwd} alt='' />
    </div>
  );
}


// @export
export default withTranslation('common')(PwdReset);