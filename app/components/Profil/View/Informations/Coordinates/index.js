// @module import
import { useState } from 'react';


// @local import
import { withTranslation } from '../../../../i18n';
import './index.css';
import Input, { InputPhone } from '../Input';


// @component
const Coordinates = ({ t, data }) => {
  const [firstName, setFirstName] = useState(data.firstName);
  const [lastName, setLastName] = useState(data.lastName);
  const [country, setCountry] = useState(data.country);
  const [age, setAge] = useState(data.age);
  const [email, setEmail] = useState(data.email);
  const [prefix, setPrefix] = useState(data.prefix);
  const [phone, setPhone] = useState(data.phone);

  return (
    <div className='coordinates-root'>
      <h2 className='coordinates-title'>{t('coordinates')}</h2>
      <div className='coordinates-box'>
        <Input
          label={t('firstName')}
          placeholder={t('phFirstName')}
          value={firstName}
          setValue={setFirstName}
          type='text'
        />
        <Input
          label={t('lastName')}
          placeholder={t('phLastName')}
          value={lastName}
          setValue={setLastName}
          type='text'
        />
        <Input
          label={t('country')}
          placeholder={t('phCountry')}
          value={country}
          setValue={setCountry}
          type='text'
        />
        <Input
          label={t('age')}
          placeholder={t('phAge')}
          value={age}
          setValue={setAge}
          type='text'
        />
        <Input
          label={t('email')}
          placeholder={t('phEmail')}
          value={email}
          setValue={setEmail}
          type='email'
        />

        <InputPhone
          label={t('phoneNumber')}

          prefixValue={prefix}
          prefixSetValue={setPrefix}
          prefixPlaceholder={'+33'}

          phoneValue={phone}
          phoneSetValue={setPhone}
          phonePlaceholder={t('phPhoneNumber')}
        />
      </div>
    </div>
  );
};


// @export
export default withTranslation('common')(Coordinates);