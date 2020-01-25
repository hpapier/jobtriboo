// @module import
import React, { useState, useRef, useEffect, FocusEvent } from 'react';
import { useCookies } from 'react-cookie';
import { WithTranslation } from 'next-i18next';


// @local import
import './index.css'
import { withTranslation } from '../../../../i18n';
import Input from '../../../../Form/Input';
import Dropdown from '../../../../Form/Dropdown';
import { candidateInformationUpdate } from '../../../../../utils/request/informations';
import { handleInputText } from '../../../../../utils/input';


// @interface
interface ComponentProps extends WithTranslation {
  data: {
    job: string,
    expertiseLevel: string,
    desiredContract: string,
    legalAvailability: string,
    expectedSalary: string
  }
}


// @component
const Other: (props: ComponentProps) => JSX.Element = ({ t, data }) => {
  const getLabel = (name: string, placeholderName: string) => {
    if (name === '')
      return t(placeholderName);

    return (t(name));
  };

  const [job, setJob]                             = useState({ value: data.job, error: null, loading: false });
  const [expertiseLevel, setExpertiseLevel]       = useState({ value: { value: data.expertiseLevel, label: getLabel(data.expertiseLevel, 'phExpertiseLevel') }, error: null, loading: false });
  const [desiredContract, setDesiredContract]     = useState({ value: { value: data.desiredContract, label: getLabel(data.desiredContract, 'phDesiredContract') }, error: null, loading: false });
  const [legalAvailability, setLegalAvailability] = useState({ value: { value: data.legalAvailability, label: getLabel(data.legalAvailability, 'phLegalAvailability') }, error: null, loading: false });
  const [expectedSalary, setExpectedSalary]       = useState({ value: data.expectedSalary, error: null, loading: false });
  const [genError, setGenError]                   = useState(null);

  const isUnmounted       = useRef(false);
  const [cookies, _, __]  = useCookies();


   // State dispacther handler
  function fnHandlerDropdown(value: { value: { value: string, label: string }, error: string, loading: boolean }, type: string) {
    switch(type) {
      case 'expertiseLevel':
        setExpertiseLevel(value);
        break;
      case 'desiredContract':
        setDesiredContract(value);
        break;
      case 'legalAvailability':
        setLegalAvailability(value);
        break;
    }
  }


  // State dispacther handler
  function fnHandlerInput(value: { value: string , error: string, loading: boolean }, type: string) {
    switch(type) {
      case 'job':
        setJob(value);
        break;
      case 'expectedSalary':
        setExpectedSalary(value);
        break;
    }
  }

   // Update the user INPUT informations.
   const handleInputInformation = async (type: string, value: string, checkFormat: any, req: (endpoint: string, value: any, token: string) => Promise<Response>) => {

    if (checkFormat !== null && !checkFormat(value)) {
      if (!isUnmounted.current)
        fnHandlerInput({ value, error: 'formatInvalid', loading: false }, type);
      return;
    }

    try {
      if (!isUnmounted.current)
        fnHandlerInput({ value, error: null, loading: true }, type);

        const response = await req(`/${type}`, value, cookies.token);
        if (response.status === 200) {
          if (!isUnmounted.current)
            fnHandlerInput({ value, error: null, loading: false }, type);
        }
        else if (response.status === 401) {
          if (!isUnmounted.current)
            fnHandlerInput({ value, error: 'unauthorized', loading: false }, type);
        }
        else
          throw 'unauthorized';

        if (!isUnmounted.current)
          fnHandlerInput({ value, error: null, loading: false }, type);
      }
      catch (e) {
        console.log(e);
        if (!isUnmounted.current)
          setGenError('500');
      }
  }


   // Update the user INPUT informations.
   const handleDropdownInformation = async (type: string, value: { value: string, label: string }, checkFormat: any, req: (endpoint: string, value: any, token: string) => Promise<Response>) => {

    try {
      if (!isUnmounted.current)
        fnHandlerDropdown({ value, error: null, loading: true }, type);

        const response = await req(`/${type}`, value.value, cookies.token);
        if (response.status === 200) {
          if (!isUnmounted.current)
            fnHandlerDropdown({ value, error: null, loading: false }, type);
        }
        else if (response.status === 401) {
          if (!isUnmounted.current)
            fnHandlerDropdown({ value, error: 'unauthorized', loading: false }, type);
        }
        else
          throw 'unauthorized';

        if (!isUnmounted.current)
          fnHandlerDropdown({ value, error: null, loading: false }, type);
      }
      catch (e) {
        console.log(e);
        if (!isUnmounted.current)
          setGenError('500');
      }
  }


  // Didmount/Unmount function.
  useEffect(() => () => { isUnmounted.current = true; }, []);


  // Rendering function.
  return (
    <div id='comp-other-root'>
      <h4 id='cor-title'>{t('other')}</h4>
      <Input
        placeholder={t('phJobName')}
        label={t('jobName')}
        type='text'
        changeFn={(n: string) => setJob({ ...job, value: n })}
        value={job.value}
        autocomplete='off'
        margin='20px 0px'
        disabled={job.loading}
        error={job.error !== null}
        errorValue={job.error}
        errorMessages={{ 'invalidFormat': t('inputTextError') }}
        onBlurFn={() => handleInputInformation('job', job.value, handleInputText, candidateInformationUpdate)}
      />
      <Dropdown
        list={[
          { value: '', label: t('phExpertiseLevel')},
          { value: 'student', label: t('student')},
          { value: 'junior', label: t('junior')},
          { value: 'mid', label: t('mid')},
          { value: 'senior', label: t('senior')},
        ]}
        placeholder={t('phExpertiseLevel')}
        label={t('expertiseLevel')}
        currentValue={expertiseLevel.value}
        changeValue={(n: { value: string, label: string }) => handleDropdownInformation('expertiseLevel', n, null, candidateInformationUpdate)}
        disabled={expertiseLevel.loading}
        error={expertiseLevel.error !== null}
        errorValue={expertiseLevel.error}
        errorMessages={{ '500': t('error500' )}}
        margin='20px 0px'
      />
      <Dropdown
        list={[
          { value: '', label: t('phDesiredContract')},
          { value: 'indifferent', label: t('indifferent')},
          { value: 'internship', label: t('internship')},
          { value: 'full-time', label: t('full-time')},
          { value: 'part-time', label: t('part-time')},
          { value: 'contractor', label: t('contractor')},
        ]}
        placeholder={t('phDesiredContract')}
        label={t('desiredContract')}
        currentValue={desiredContract.value}
        changeValue={(n: { value: string, label: string }) => handleDropdownInformation('desiredContract', n, null, candidateInformationUpdate)}
        disabled={desiredContract.loading}
        error={desiredContract.error !== null}
        errorValue={desiredContract.error}
        errorMessages={{ '500': t('error500' )}}
        margin='20px 0px'
      />
      <Dropdown
        list={[
          { value: '', label: t('phLegalAvailability')},
          { value: 'now', label: t('now')},
          { value: '0to15', label: t('0to15')},
          { value: '15to30', label: t('15to30')},
          { value: '30to90', label: t('30to90')},
          { value: '90+', label: t('90+')},
        ]}
        placeholder={t('phLegalAvailability')}
        label={t('legalAvailability')}
        currentValue={legalAvailability.value}
        changeValue={(n: { value: string, label: string }) => handleDropdownInformation('legalAvailability', n, null, candidateInformationUpdate)}
        disabled={legalAvailability.loading}
        error={legalAvailability.error !== null}
        errorValue={legalAvailability.error}
        errorMessages={{ '500': t('error500' )}}
        margin='20px 0px'
      />
      <Input
        placeholder={t('phMinimumSalary')}
        label={t('minimumSalary')}
        type='text'
        changeFn={(n: string) => { setExpectedSalary({ ...expectedSalary, value: n.match(/^\d+$/) !== null || n === '' ? n : expectedSalary.value })}}
        value={expectedSalary.value}
        autocomplete='off'
        margin='20px 0px'
        disabled={expectedSalary.loading}
        error={expectedSalary.error !== null}
        errorValue={expectedSalary.error}
        errorMessages={{ 'invalidFormat': t('inputTextError') }}
        onBlurFn={() => handleInputInformation('expectedSalary', expectedSalary.value, null, candidateInformationUpdate)}
      />
    </div>
  );
};


// @export
export default withTranslation('common')(Other);