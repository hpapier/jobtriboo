import React, { useState }  from 'react';
import { FormControl, Input, InputLabel, TextField, Button, Select, MenuItem } from '@material-ui/core'
import Modal from 'react-modal'
import { withTranslation } from './i18n'
import { withRouter } from 'next/router'
import { useCookies } from 'react-cookie'

import { request } from '../utils/request'
import LoginTab from '../store/container/login'

Modal.setAppElement("#__next");

const ModalConnexion = ({ t, modalOpen, modalWindowLogin, setModalOpenState, setMWindowLogin, router, storeUserInfo, setLoginState }) => {
  /* State */
  const [birthDateDay, setBirthDateDay] = useState(1);
  const [birthDateMonth, setBirthDateMonth] = useState(1);
  const [birthDateYear, setBirthDateYear] = useState(2019);
  const [status, setStatus] = useState("candidate");
  const [validationBtnState, setValidationBtnState] = useState(true);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [fieldError, setFieldError] = useState(false);
  const [validationStatus, setValidationStatus] = useState(0);

  const [cookies, setCookies, removeCookies] = useCookies();
  console.log('COOKIES: ', cookies);

  /* Utils function */
  const getDayList = () => {
    let dayNumber = 31;

    if (birthDateMonth % 2 === 0 && birthDateMonth != 8)
      dayNumber = 30;
    if (birthDateMonth === 2) {
      if (birthDateYear % 4 === 0) {
        if (birthDateYear % 100 === 0) {
          if (birthDateYear % 400 === 0)
            dayNumber = 29;
          else
            dayNumber = 28;
        }
        else
        dayNumber = 29;
      }
      dayNumber = 28;
    }

    if (dayNumber < birthDateDay)
      setBirthDateDay(dayNumber);
    
    let dateElements = [];
    for(let i = 1; i <= dayNumber; i++)
      dateElements.push(<MenuItem key={i} value={i}>{i}</MenuItem>);
    
    return dateElements;
  }

  const getMonthList = () => {
    let monthElement = [];

    for (let i = 1; i <= 12; i++)
      monthElement.push(<MenuItem key={i} value={i}>{i}</MenuItem>);

    return monthElement;
  }

  const getYearList = () => {
    let yearElement = [];

    for (let i = new Date().getFullYear(); i >= 1900; i--)
      yearElement.push(<MenuItem key={i} value={i}>{i}</MenuItem>);

    return yearElement;
  }

  const handleValidation = async event => {
    event.preventDefault();
    setValidationBtnState(false);
    
    if (firstName === '' || lastName === '' || email === '' || password === '') {
      setFieldError(true);
      setValidationBtnState(true);
      return;
    }
    else {
      try {
  
        const birthDate = new Date(birthDateYear + "-" + birthDateMonth + "-" + birthDateDay);
        
        // .. Start loading front-end process
        const res = await request(
          "/api/register",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: {
              status,
              firstName,
              lastName,
              email,
              password,
              birthDate
            }
          }
        );
        // .. End loading front-end process

        
        
        if (res.status === 201) {
          const data = await res.json();

          setCookies('token', data.token);
          storeUserInfo({ firstName, lastName, email, password, birthDate });

          setValidationStatus(201);
          setValidationBtnState(true);
          setModalOpenState(false);

          setLoginState(true);
          router.push('/settings');
        }
        else {
          setValidationStatus(res.status);
          setEmail('');
          setValidationBtnState(true);
        }
      } catch (e) {
        console.log(e);
        setValidationBtnState(true);
        setValidationStatus(500);
      }
    }
  }

  /* Jsx Rendering */
  return (
    <Modal
      isOpen={modalOpen}
      onRequestClose={() => setModalOpenState(false)}
      style={{ overlay: { backgroundColor: "rgba(0, 0, 0, 0.6)"}, content: { opacity: "1", width: '700px', margin: 'auto' } }}
    >
      <Button variant={!modalWindowLogin ? "outlined" : "contained"} onClick={() => setMWindowLogin(true)} style={{ margin: 5 }} color='primary'>{t('login')}</Button>
      <Button variant={!modalWindowLogin ? "contained" : "outlined"} onClick={() => setMWindowLogin(false)} style={{ margin: 5 }} color='primary'>{t('register')}</Button>
      <hr />

      {
        modalWindowLogin ?
        <LoginTab /> :
        (
          <form onSubmit={handleValidation}>

            <div>
              <Button
                variant={(status !== "candidate") ? "outlined" : "contained"}
                color="secondary"
                onClick={() => setStatus("candidate")}
                style={{ margin: 5}}
              >
                {t('candidate')}
              </Button>
              <Button
                variant={(status !== "recruiter") ? "outlined" : "contained"}
                color="secondary"
                onClick={() => setStatus("recruiter")}
                style={{ margin: 5}}
              >
                {t('recruiter')}
              </Button>
            </div>

            <div>
              <TextField
                label={t('firstName')}
                type="text"
                name="firstName"
                variant="filled"
                style={{ margin: 5}}
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                error={fieldError && firstName === ''}
              />

              <TextField
                label={t('lastName')}
                type="text"
                name="lastName"
                variant="filled"
                style={{ margin: 5}}
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                error={fieldError && lastName === ''}
              />
            </div>

            <div>
              <TextField
                label={t('email')}
                type="email"
                name="email"
                variant="filled"
                autoComplete="email"
                style={{ margin: 5}}
                value={email}
                onChange={e => setEmail(e.target.value)}
                error={fieldError && email === ''}
              />

              <TextField
                label={t('password')}
                type="password"
                name="password"
                variant="filled"
                value={password}
                autoComplete="new-password"
                style={{ margin: 5}}
                onChange={e => setPassword(e.target.value)}
                error={fieldError && password === ''}
              />
            </div>

            <div style={{ margin: "5px 0px"}}> 
              <FormControl>
                <InputLabel htmlFor="age-customized-select" style={{ margin: "0px 5px"}}>{t('birthDateDay')}</InputLabel>
                <Select
                  value={birthDateDay}
                  onChange={e => setBirthDateDay(e.target.value)}
                  style={{ margin: "10px 5px", width: "60px"}}
                >
                  {getDayList()}
                </Select>
              </FormControl>

              <FormControl>
                <InputLabel htmlFor="age-customized-select" style={{ margin: "0px 5px"}}>{t('birthDateMonth')}</InputLabel>
                <Select
                  value={birthDateMonth}
                  onChange={e => setBirthDateMonth(e.target.value)}
                  style={{ margin: "10px 5px", width: "60px"}}
                >
                  {getMonthList()}
                </Select>
              </FormControl>

              <FormControl>
                <InputLabel htmlFor="age-customized-select" style={{ margin: "0px 5px"}}>{t('birthDateYear')}</InputLabel>
                <Select
                  value={birthDateYear}
                  onChange={e => setBirthDateYear(e.target.value)}
                  style={{ margin: "10px 5px", width: "100px"}}
                >
                  {getYearList()}
                </Select>
              </FormControl>

            </div>

            <div>
              <Button
                variant="contained"
                color="primary"
                style={{ margin: 5}}
                type='submit'
                disabled={!validationBtnState}
              >
                {t('validate')}
              </Button>
            </div>

            {
              validationStatus !== 0 ?
              (<div>
                { <p>{validationStatus === 201 ? 'success' : validationStatus === 200 ? 'Email already used' : 'an error occured'}</p> }
              </div>) :
              null
            }

          </form>
        )
      }

    </Modal>
  )
}

export default withTranslation('common')(withRouter(ModalConnexion));