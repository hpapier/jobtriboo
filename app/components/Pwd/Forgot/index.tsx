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
const PwdForgot: (props: AppProps) => JSX.Element = ({ t }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const router = useRouter();

  return (
    <div id='pwd-fgt-root'>
      <div id='pfr-head'>
        <h1 id='pfrh-logo'>Jobtriboo</h1>
        <Lang />
      </div>

      <div id='pfr-input'>
        <h1 id='pfri-title' dangerouslySetInnerHTML={{ __html: t('pwdFgt-title') }}></h1>
        <h2 id='pfri-subtitle'>{t('pwdFgt-subtitle')}</h2>
        <Input
          placeholder={t('phEmail')}
          label={t('email')}
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
        <button id='pfri-btn'>{t('changePwd')}</button>

        <div id='pfri-txt'>
          <p id='pfrit-phrase'>{t('neverRegistered')}</p>
          <button id='pfrit-login' onClick={() => router.push('/signup')}>{t('register')}</button>
        </div>
      </div>

      <img id='pfr-img' src={IllustrationPwd} alt='' />
    </div>
  );
}


// @export
export default withTranslation('common')(PwdForgot);