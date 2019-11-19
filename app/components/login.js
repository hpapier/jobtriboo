import React, { useState, useEffect } from 'react'
import { useCookies } from 'react-cookie'
import { FormControl, Input, InputLabel, Button } from '@material-ui/core'

import { request } from '../utils/request'
import { withTranslation } from './i18n'

const LoginTab = withTranslation('common')(({ t, setLoginState }) => {

  const [errorStatus, setErrorStatus] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [connexionBtnStatus, setConnectionBtnStatus] = useState(false);
  const [cookies, setCookies, removeCookies] = useCookies();

  const handleConnexion = async e => {
    e.preventDefault();
    setConnectionBtnStatus(true);

    console.log('SUBMITTED');

    try {
      const response = await request('/api/authentication', { method: 'post', body: { email, password }, headers: { 'Content-type': 'application/json' }});
      const data = await response.json();


      if (response.status === 200) {
        // Set the new cookie.
        setCookies('token', data.token, { path: '/' });

        // Login user.
        setConnectionBtnStatus(false);
        setLoginState(true);

        console.log('PROCESS LOGIN COMPLETE')
      }
      else {
        setConnectionBtnStatus(false);
        setErrorStatus(response.status);
      }

    } catch (e) {
      setConnectionBtnStatus(false);
      setErrorStatus(500);
    }

  }

  return (
    <form onSubmit={handleConnexion}>
      <div>
        <FormControl margin="normal">
          <InputLabel htmlFor="email">{t('email')}</InputLabel>
          <Input
            value={email}
            onChange={e => setEmail(e.target.value)}
            type="email"
            name="email"
            autoComplete="email"
            error={errorStatus && email === ""}
          />
        </FormControl>

        <FormControl margin="normal">
          <InputLabel htmlFor="password">{t('password')}</InputLabel>
          <Input
            value={password}
            onChange={e => setPassword(e.target.value)}
            type="password"
            name="password"
            autoComplete="current-password"
            error={errorStatus && password === ""}
          />
        </FormControl>
      </div>

      <div>
        <Button disabled={connexionBtnStatus} variant='outlined' color='secondary' type="submit">{t('connection')}</Button>
      </div>

      { errorStatus === 500 ? 'ERROR OCCURED' : null }
    </form>
  );
});


export default LoginTab;