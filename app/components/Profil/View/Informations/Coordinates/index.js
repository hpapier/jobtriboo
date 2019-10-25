// @module import
import { useState } from 'react';
import { useCookies } from 'react-cookie';


// @local import
import { withTranslation } from '../../../../i18n';
import './index.css';
import Input, { InputPhone } from '../Input';
import {
  candidateInformationUpdate
} from '../../../../../utils/request/informations';
import { handleInputText, handleInputEmail, handleInputNumber, handleInputPrefix, handleInputInt } from '../../../../../utils/input';


// @component
const Coordinates = ({ t, data, updateData }) => {
  const [cookies, _, __] = useCookies();
  return (
    <div className='coordinates-root'>
      <h2 className='coordinates-title'>{t('coordinates')}</h2>
      <div className='coordinates-box'>
        <Input
          label={t('firstName')}
          placeholder={t('phFirstName')}
          data={data.firstName}
          token={cookies.token}
          updateReq={{ req: candidateInformationUpdate, endpoint: '/firstName' }}
          updateData={nd => updateData({ ...data, firstName: nd })}
          type='text'
          checkFormat={handleInputText}
          formatErrorMsg={t('emptyOrTooLongError')}
        />

        <Input
          label={t('lastName')}
          placeholder={t('phLastName')}
          data={data.lastName}
          token={cookies.token}
          updateReq={{ req: candidateInformationUpdate, endpoint: '/lastName' }}
          updateData={nd => updateData({ ...data, lastName: nd })}
          type='text'
          checkFormat={handleInputText}
          formatErrorMsg={t('emptyOrTooLongError')}
        />

        <Input
          label={t('country')}
          placeholder={t('phCountry')}
          data={data.country}
          token={cookies.token}
          updateReq={{ req: candidateInformationUpdate, endpoint: '/country' }}
          updateData={nd => updateData({ ...data, country: nd })}
          type='text'
        />

        <Input
          label={t('age')}
          placeholder={t('phAge')}
          data={data.age}
          token={cookies.token}
          updateReq={{ req: candidateInformationUpdate, endpoint: '/age' }}
          updateData={nd => updateData({ ...data, age: nd })}
          type='text'
          checkFormat={n => handleInputInt(n, 100, 0)}
          formatErrorMsg={t('notCorrectAge')}
        />

        <Input
          label={t('email')}
          placeholder={t('phEmail')}
          data={data.email}
          token={cookies.token}
          updateReq={{ req: candidateInformationUpdate, endpoint: '/email' }}
          updateData={nd => updateData({ ...data, email: nd })}
          type='email'
          checkFormat={handleInputEmail}
          formatErrorMsg={t('emailError')}
        />

        <InputPhone
          label={t('phoneNumber')}

          prefixData={data.prefix}
          prefixPlaceholder={'+33'}
          prefixUpdateData={nd => updateData({ ...data, prefixPhoneNumber: nd })}
          prefixCheck={handleInputPrefix}

          phoneData={data.phone}
          phonePlaceholder={t('phPhoneNumber')}
          phoneUpdateData={nd => updateData({ ...data, phoneNumber: nd })}
          phoneCheck={handleInputNumber}

          updateReq={{ req: candidateInformationUpdate, endpoint: { prefix: '/prefixPhoneNumber', phone: '/phoneNumber' }}}
          formatErrorMsg={t('emptyOrInvalidFormatError')}
        />
      </div>
    </div>
  );
};


// @export
export default withTranslation('common')(Coordinates);