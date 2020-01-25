// @module import
import React, { useState, ChangeEvent, FocusEvent, useRef } from 'react';
import { WithTranslation } from 'next-i18next';


// @local import
import './index.css';
import { withTranslation } from '../../../../i18n';
import Input from '../../../../Form/Input';
import TextArea from '../../../../Form/TextArea';
import DateInput from '../../../../Form/Date';
import Error from '../../../../Error';
import { serverFileURL } from '../../../../../utils/config';
import { candidateProfilPictureUpdate } from '../../../../../utils/request/informations';
import { useCookies } from 'react-cookie';
import { candidateInformationUpdate } from '../../../../../utils/request/informations';


// @interface
interface ComponentProps extends WithTranslation {
  data: {
    picture: string,
    firstname: string,
    lastname: string,
    birthdate: string,
    email: string,
    phone: string,
    description: string
  }
}


// @component
const Info: (props: ComponentProps) => JSX.Element = ({ t, data }) => {

  const [picture, setPicture]         = useState({ value: data.picture, error: null, loading: false });
  const [firstname, setFirstname]     = useState({ value: data.firstname, error: null, loading: false });
  const [lastname, setLastname]       = useState({ value: data.lastname, error: null, loading: false });
  const [birthdate, setBirthdate]     = useState({ value: data.birthdate === '' ? null : data.birthdate, error: null, loading: false });
  const [email, setEmail]             = useState({ value: data.email, error: null, loading: false });
  const [phone, setPhone]             = useState({ value: data.phone, error: null, loading: false });
  const [description, setDescription] = useState({ value: data.description, error: null, loading: false });
  const [generalError, setGenError]   = useState(null);

  const [cookies, setCookie, __]      = useCookies();
  const isUnmounted                   = useRef(false);


  // Update the user profil picture
  const handlePicture = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files[0];

    if (file !== undefined) {
      if (file.size > 2000000) {
        setPicture({ ...picture, error: 'sizeError' });
        return;
      }

      setPicture({ ...picture, error: null });
      const freader = new FileReader();

      freader.onload = async function(evt) {
        const res = await candidateProfilPictureUpdate(evt.target.result, file.type.replace(/^image\//, ''), cookies.token);
        const { path } = await res.json();
        setPicture({ ...picture, value: path });
      }

      freader.readAsDataURL(file);
    }
  }


  // State dispacther handler
  const fnHandler = (value: { value: string, error: string, loading: boolean }, type: string) => {
    switch(type) {
      case 'firstname':
        setFirstname(value);
        break;
      case 'lastname':
        setLastname(value);
        break;
      case 'birthdate':
        setBirthdate(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'phone':
        setPhone(value);
        break;
      case 'description':
        setDescription(value);
        break;
    }
  }


  // Update the user informations
  const handleInformation = async (e: FocusEvent, type: string, initialValue: string, value: string, checkFormat: any, req: (endpoint: string, value: any, token: string) => Promise<Response>) => {

    if (initialValue === value) {
      if (!isUnmounted.current)
        fnHandler({ value: initialValue, error: null, loading: false }, type);
      return;
    }

    if (value === '' || (checkFormat !== null && !checkFormat(value))) {
      if (!isUnmounted.current)
        fnHandler({ value, error: 'formatInvalid', loading: false }, type);
      return;
    }

    try {
      if (!isUnmounted.current)
        fnHandler({ value, error: null, loading: true }, type);

        const response = await req(`/${type}`, value, cookies.token);
        if (response.status === 200) {
          if (type === 'email') {
            const { token } = await response.json();
            setCookie('token', token, { path: '/' });
          }

          if (!isUnmounted.current)
            fnHandler({ value, error: null, loading: false }, type);
        }
        else if (response.status === 401) {
          if (!isUnmounted.current)
            fnHandler({ value, error: 'unauthorized', loading: false }, type);
        }
        else
          throw 'unauthorized';

        if (!isUnmounted.current)
          fnHandler({ value, error: null, loading: false }, type);
      }
      catch (e) {
        console.log(e);
        if (!isUnmounted.current)
          setGenError('500');
      }
  }


  return (
    <div id='comp-info'>

      <div id='ci-picture'>
        <h3 className='ci-title'>{t('picture')}</h3>
        <div id='cip-picbox'>
          { picture.value === '' ? <div id='cipp-element'></div> : <img src={serverFileURL + picture.value} alt="picture-profil" id='cipp-element' /> }
          <div>
            <div className='cippe-tinfo'>
              <p className='cippet-label'>{t('weight')}</p>
              <h4 className='cippet-txt'>{t('weightInfo')}</h4>
            </div>
            <div className='cippe-tinfo'>
              <p className='cippet-label'>{t('format')}</p>
              <h4 className='cippet-txt'>{t('formatInfo')}</h4>
            </div>
          </div>
        </div>
        { picture.error !== null ? <Error margin='10px 0px' errorValue={picture.error} errorMessages={{ 'sizeError': 'sizeError' }} /> : null}
        <input type="file" accept='image/jpg, image/png, image/jpeg' onChange={e => handlePicture(e)} size={2000000} id='picture-input' style={{ display: 'none' }} />
        <label id='cip-upload' htmlFor='picture-input'>
          {t('importPicture')}
        </label>
      </div>

      <div className='ci-line'></div>

      <div id='ci-info'>
        <h3 className='ci-title'>{t('informations')}</h3>
        <Input
          placeholder={t('phFirstname')}
          label={t('firstname')}
          type='text'
          changeFn={(n: string) => setFirstname({ ...firstname, value: n })}
          value={firstname.value}
          autocomplete='off'
          margin='20px 0px 0px 0px'
          error={firstname.error !== null}
          disabled={firstname.loading}
          errorValue={firstname.error}
          errorMessages={{ 'formatInvalid': t('inputTextError'), 'unauthorized': t('unauthorizedError') }}
          onBlurFn={e => handleInformation(e, 'firstname', data.firstname, firstname.value, null, candidateInformationUpdate)}
        />
        <Input
          placeholder={t('phLastname')}
          label={t('lastname')}
          type='text'
          changeFn={(n: string) => setLastname({ ...lastname, value: n })}
          value={lastname.value}
          autocomplete='off'
          margin='20px 0px 0px 0px'
          error={lastname.error !== null}
          disabled={lastname.loading}
          errorValue={lastname.error}
          errorMessages={{ 'formatInvalid': t('inputTextError'), 'unauthorized': t('unauthorizedError') }}
          onBlurFn={e => handleInformation(e, 'lastname', data.lastname, lastname.value, null, candidateInformationUpdate)}
        />
        <DateInput
          label={t('phBirthdate')}
          value={birthdate.value}
          margin='20px 0px 0px 0px'
          error={birthdate.error !== null}
          errorValue={birthdate.error}
          disabled={birthdate.loading}
          errorMessages={{ 'formatInvalid': t('invalidDate' ), 'unauthorized': t('unauthorizedError')}}
          onBlurFn={(e, dateValue) => handleInformation(e, 'birthdate', data.birthdate, dateValue, null, candidateInformationUpdate)}
          maxYear={new Date().getFullYear()}
          minYear={1900}
        />
        <Input
          placeholder={t('phEmail')}
          label={t('email')}
          type='email'
          changeFn={(n: string) => setEmail({ ...email, value: n })}
          value={email.value}
          autocomplete='off'
          margin='20px 0px 0px 0px'
          error={email.error !== null}
          disabled={email.loading}
          errorValue={email.error}
          errorMessages={{ 'formatInvalid': t('inputEmailError'), 'unauthorized': t('unauthorizedError') }}
          onBlurFn={e => handleInformation(e, 'email', data.email, email.value, null, candidateInformationUpdate)}
        />
        <Input
          placeholder={t('phPhoneNumber')}
          label={t('phoneNumber')}
          type='text'
          changeFn={(n: string) => setPhone({ ...phone, value: n })}
          value={phone.value}
          autocomplete='off'
          margin='20px 0px 0px 0px'
          error={phone.error !== null}
          disabled={phone.loading}
          errorValue={phone.error}
          errorMessages={{ 'formatInvalid': t('inputPhoneError'), 'unauthorized': t('unauthorizedError') }}
          onBlurFn={e => handleInformation(e, 'phone', data.phone, phone.value, null, candidateInformationUpdate)}
        />
        <TextArea
          label={t('description')}
          placeholder={t('phDescription')}
          value={description.value}
          margin='20px 0px'
          changeFn={(n: string) => setDescription({ ...description, value: n })}
          onBlurFn={e => handleInformation(e, 'description', data.description, description.value, null, candidateInformationUpdate)}
          loading={description.loading}
          error={description.error !== null}
          errorValue={description.error}
          errorMessages={{ 'formatInvalid': t('inputTextError' ), 'unauthorized': t('unauthorizedError')}}
        />
      </div>

    </div>
  );
}


// @export
export default withTranslation('common')(Info);