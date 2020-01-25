// @module import
import React, { useState, FormEvent, useRef } from 'react';
import { WithTranslation } from 'next-i18next';


// @local import
import './index.css';
import { withTranslation } from '../../../../i18n';
import Input from '../../../../Form/Input';
import DateInput from '../../../../Form/Date';
import Error from '../../../../Error';
import { handleInputText } from '../../../../../utils/input';
import { useCookies } from 'react-cookie';
import { addExperience, removeExperience } from '../../../../../utils/request/candidate';
import Item from './Item';
import TextArea from '../../../../Form/TextArea';
import Loading from '../../../../Loading';

const AddIcon = require('../../../../../static/assets/plus-icon-white.svg') as string;


// @interface
interface ComponentProps extends WithTranslation {
  data: Array<object>
}

interface ExperiencesProperties {
  _id: string,
  jobTitle: string,
  startingDate: string,
  endDate: string,
  inProgress: boolean,
  company: string,
  jobDescription: string
}



// @component
const Experiences: (props: ComponentProps) => JSX.Element = ({ t, data }) => {

  const [jobName, setJobName]   = useState({ value: '', error: null });
  const [startingDate, setStartingDate]   = useState({ value: null, error: null });
  const [endDate, setEndDate]             = useState({ value: null, error: null });
  const [IsInProgress, setProgressState]  = useState(false);
  const [company, setCompany]             = useState({ value: '', error: null });
  const [description, setDescription]     = useState({ value: '', error: null });
  const [resetNeeded, setReset]           = useState(false);

  const [fetchLoading, setFetchLoading] = useState(false);
  const [genError, setGenError]         = useState(null);

  const isUnmounted       = useRef(false);
  const [cookies, _, __]  = useCookies();

  const [removeLoading, setRemoveLoading] = useState(null);
  const [removeError, setRemoveError]     = useState(null);

  // const ndata = data.slice(0, data.length - 1).reverse();
  const [experiences, setExperiences] = useState(data);


  // Reset all the fields (or just error values).
  const resetValues: (keepValue?: boolean) => void = (keepValue = false) => {
    if (!isUnmounted.current) {
      setJobName({ value: keepValue ? jobName.value : '', error: null });
      setStartingDate({ value: keepValue ? startingDate.value : null, error: null });
      setEndDate({ value: keepValue ? endDate.value : null, error: null });
      setProgressState(keepValue ? IsInProgress : false);
      setCompany({ value: keepValue ? company.value : '', error: null });
      setDescription({ value: keepValue ? description.value : '', error: null });
    }
  }


  // Handle the experience form submition.
  const handleSubmit: (event: FormEvent) => void = async event => {
    event.preventDefault();

    resetValues(true);

    let error = false;
    if (!handleInputText(jobName.value, 1000)) {
      setJobName({ ...jobName, error: 'invalidFormat' });
      error = true;
    }

    console.log('starting value:  ', startingDate.value);
    if (startingDate.value === null || startingDate.value === 'Invalid Date') {
      setStartingDate({ ...startingDate, error: 'invalidFormat' });
      error = true;
    }

    if (endDate.value === null && !IsInProgress) {
      setEndDate({ ...endDate, error: 'invalidFormat' });
      error = true;
    }

    if (!handleInputText(company.value, 1000)) {
      setCompany({ ...company, error: 'invalidFormat' });
      error = true;
    }

    if (!handleInputText(description.value, 10000)) {
      setDescription({ ...description, error: 'invalidFormat' });
      error = true;
    }

    if (error)
      return;

    try {
      if (!isUnmounted.current)
        setFetchLoading(true);

      const response = await addExperience({ jobTitle: jobName.value, startingDate: startingDate.value, endDate: IsInProgress ? '' : endDate.value, inProgress: IsInProgress, company: company.value, description: description.value }, cookies.token);
      if (response.status === 200) {
        const newExperience = await response.json();
        if (!isUnmounted.current)
          setExperiences([ newExperience, ...experiences ]);
      }
      else
        throw response;

      if (!isUnmounted.current) {
        resetValues();
        setFetchLoading(false);
        setReset(true);
      }
    }
    catch (e) {
      console.log(e);
      if (!isUnmounted.current) {
        resetValues(true);
        setFetchLoading(false);
        setGenError('500');
      }
    }
  }


  // Handle Remove Experience.
  const handleRemoveExperience = async (id: string) => {
    if (!isUnmounted.current) {
      setRemoveLoading(id);
      setRemoveError(null);
    }

    try {
      const response = await removeExperience(id, cookies.token);
      if (response.status === 204) {
        const newExperienceArray = experiences.filter((item: ExperiencesProperties) => item._id !== id );

        if (!isUnmounted.current) {
          setExperiences(newExperienceArray);
          setRemoveLoading(null);
          setRemoveError(null);
        }
      }
      else
        throw response;
    }
    catch (e) {
      console.log(e);
      if (!isUnmounted.current) {
        setRemoveLoading(null);
        setRemoveError('500');
      }
    }
  }

  return (
    <div id='comp-experiences-root'>
      <h3 id='cer-title'>{t('experiences')}</h3>
      <form id='cer-inputs' onSubmit={handleSubmit}>
        <div className='ceri-element'>
          <Input
            placeholder={t('phJobname')}
            label={t('jobName')}
            margin='0px 0px'
            type='text'
            changeFn={(n: string) => setJobName({ ...jobName, value: n })}
            value={jobName.value}
            autocomplete='off'
            error={jobName.error !== null}
            disabled={fetchLoading}
            errorValue={jobName.error}
            errorMessages={{ invalidFormat: t('inputTextError') }}
            onBlurFn={() => null}
          />
        </div>

        <div className='ceri-element'>
          <Input
            placeholder={t('phCompany')}
            label={t('company')}
            margin='0px 0px'
            type='text'
            changeFn={(n: string) => setCompany({ ...company, value: n })}
            value={company.value}
            autocomplete='off'
            error={company.error !== null}
            disabled={fetchLoading}
            errorValue={company.error}
            errorMessages={{ invalidFormat: t('inputTextError') }}
            onBlurFn={() => null}
          />
        </div>

        <div className='ceri-element'>
          <DateInput
            label={t('startingDate')}
            value={startingDate.value}
            margin='0px 0px'
            disabled={fetchLoading}
            error={startingDate.error !== null}
            errorValue={startingDate.error}
            errorMessages={{ invalidFormat: t('invalidDate') }}
            onBlurFn={(e, dateValue) => setStartingDate({ ...startingDate, value: dateValue })}
            resetFn={setReset}
            resetNeeded={resetNeeded}
            maxYear={2050}
            minYear={1900}
          />
        </div>

        <div className='ceri-element'>
          <DateInput
            label={t('endDate')}
            value={endDate.value}
            margin='0px 0px'
            disabled={fetchLoading || IsInProgress}
            error={endDate.error !== null}
            errorValue={endDate.error}
            errorMessages={{ invalidFormat: t('invalidDate') }}
            onBlurFn={(e, dateValue) => setEndDate({ ...endDate, value: dateValue })}
            resetFn={setReset}
            resetNeeded={resetNeeded}
            maxYear={2050}
            minYear={1900}
            currentBtn
            currentBtnState={IsInProgress}
            setCurrentBtnState={setProgressState}
          />
        </div>


        <div className='ceri-element' style={{ width: '100%' }}>
          <TextArea
            placeholder={t('phJobDescription')}
            label={t('jobDescription')}
            margin='0px 0px'
            changeFn={(n: string) => setDescription({ ...description, value: n })}
            value={description.value}
            error={description.error !== null}
            loading={fetchLoading}
            errorValue={description.error}
            errorMessages={{ invalidFormat: t('inputTextError') }}
            onBlurFn={() => null}
          />
        </div>

        <button id='ceri-submit' type='submit'>
          {
            !fetchLoading ?
            <>
              <img id='ceris-icon' src={AddIcon} alt="plus-icon"/>
              <p id='ceris-txt'>{t('add')}</p>
            </> :
            <Loading size='small' color='white' margin='0px auto' />
          }
        </button>
      </form>
      { genError !== null ? <Error margin='10px auto' errorValue={genError} errorMessages={{ '500': t('error500') }} /> : null }

      <div className='cer-line'></div>

      <div id='cer-list'>
        { removeError !== null ? <Error margin='10px auto' errorValue={removeError} errorMessages={{ '500': t('error500') }} /> : null }
        { experiences.length === 0 ? <div id='cerl-noexperience'>{t('noexperiences')}</div> : null }
        {
          experiences.map((item: ExperiencesProperties) => <Item key={item._id} id={item._id} title={item.jobTitle} startingDate={item.startingDate} endDate={item.endDate} inProgress={item.inProgress} company={item.company} description={item.jobDescription} removeFn={handleRemoveExperience} loading={removeLoading} />)
        }
      </div>
    </div>
  );
}


// export
export default withTranslation('common')(Experiences);