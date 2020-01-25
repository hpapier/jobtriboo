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
import { addQualification, removeQualification } from '../../../../../utils/request/candidate';
import Item from './Item';
import Loading from '../../../../Loading';

const AddIcon = require('../../../../../static/assets/plus-icon-white.svg') as string;


// @interface
interface ComponentProps extends WithTranslation {
  data: Array<object>
}

interface QualificationsProperties {
  _id: string,
  title: string,
  startingDate: string,
  endDate: string,
  inProgress: boolean,
  school: string
}



// @component
const Qualifications: (props: ComponentProps) => JSX.Element = ({ t, data }) => {

  const [diplomaTitle, setDiplomaTitle]   = useState({ value: '', error: null });
  const [startingDate, setStartingDate]   = useState({ value: null, error: null });
  const [endDate, setEndDate]             = useState({ value: null, error: null });
  const [IsInProgress, setProgressState]  = useState(false);
  const [school, setSchool]               = useState({ value: '', error: null });
  const [resetNeeded, setReset]           = useState(false);

  const [fetchLoading, setFetchLoading] = useState(false);
  const [genError, setGenError]         = useState(null);

  const isUnmounted       = useRef(false);
  const [cookies, _, __]  = useCookies();

  const [removeLoading, setRemoveLoading] = useState(null);
  const [removeError, setRemoveError]     = useState(null);

  // const ndata = data.slice(0, data.length - 1).reverse();
  const [qualifications, setQualifications] = useState(data);


  // Reset all the fields (or just error values).
  const resetValues: (keepValue?: boolean) => void = (keepValue = false) => {
    if (!isUnmounted.current) {
      setDiplomaTitle({ value: keepValue ? diplomaTitle.value : '', error: null });
      setStartingDate({ value: keepValue ? startingDate.value : null, error: null });
      setEndDate({ value: keepValue ? endDate.value : null, error: null });
      setProgressState(keepValue ? IsInProgress : false);
      setSchool({ value: keepValue ? school.value : '', error: null });
    }
  }


  // Handle the qualification form submition.
  const handleSubmit: (event: FormEvent) => void = async event => {
    event.preventDefault();

    resetValues(true);

    let error = false;
    if (!handleInputText(diplomaTitle.value, 1000)) {
      setDiplomaTitle({ ...diplomaTitle, error: 'invalidFormat' });
      error = true;
    }

    if (startingDate.value === null) {
      setStartingDate({ ...startingDate, error: 'invalidFormat' });
      error = true;
    }

    if (endDate.value === null && !IsInProgress) {
      setEndDate({ ...endDate, error: 'invalidFormat' });
      error = true;
    }

    if (!handleInputText(school.value, 1000)) {
      setSchool({ ...school, error: 'invalidFormat' });
      error = true;
    }

    if (error)
      return;

    try {
      if (!isUnmounted.current)
        setFetchLoading(true);

      const response = await addQualification({ diplomaTitle: diplomaTitle.value, startingDate: startingDate.value, endDate: IsInProgress ? '' : endDate.value, inProgress: IsInProgress, school: school.value }, cookies.token);
      if (response.status === 200) {
        const newQualification = await response.json();
        if (!isUnmounted.current)
          setQualifications([ newQualification, ...qualifications ]);
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


  // Handle Remove Qualification.
  const handleRemoveQualification = async (id: string) => {
    if (!isUnmounted.current) {
      setRemoveLoading(id);
      setRemoveError(null);
    }

    try {
      const response = await removeQualification(id, cookies.token);
      if (response.status === 204) {
        const newQualificationArray = qualifications.filter((item: QualificationsProperties) => item._id !== id );

        if (!isUnmounted.current) {
          setQualifications(newQualificationArray);
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


  // Render
  return (
    <div id='comp-qualifications-root'>
      <h3 id='cqr-title'>{t('qualifications')}</h3>
      <form id='cqr-inputs' onSubmit={handleSubmit}>
        <div className='cqri-element'>
          <Input
            placeholder={t('phDiplomaTitle')}
            label={t('diplomaTitle')}
            margin='0px 0px'
            type='text'
            changeFn={(n: string) => setDiplomaTitle({ ...diplomaTitle, value: n })}
            value={diplomaTitle.value}
            autocomplete='off'
            error={diplomaTitle.error !== null}
            disabled={fetchLoading}
            errorValue={diplomaTitle.error}
            errorMessages={{ invalidFormat: t('inputTextError') }}
            onBlurFn={() => null}
          />
        </div>


        <div className='cqri-element'>
          <Input
            placeholder={t('phSchool')}
            label={t('school')}
            margin='0px 0px'
            type='text'
            changeFn={(n: string) => setSchool({ ...school, value: n })}
            value={school.value}
            autocomplete='off'
            error={school.error !== null}
            disabled={fetchLoading}
            errorValue={school.error}
            errorMessages={{ invalidFormat: t('inputTextError') }}
            onBlurFn={() => null}
          />
        </div>

        <div className='cqri-element'>
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

        <div className='cqri-element'>
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

        <button id='cqri-submit' type='submit'>
          {
            !fetchLoading ?
            <>
              <img id='cqris-icon' src={AddIcon} alt="plus-icon"/>
              <p id='cqris-txt'>{t('add')}</p>
            </> :
            <Loading size='small' color='white' margin='0px auto' />
          }
        </button>
      </form>
      { genError !== null ? <Error margin='10px auto' errorValue={genError} errorMessages={{ '500': t('error500') }} /> : null }

      <div className='cqr-line'></div>

      <div id='cqr-list'>
        { removeError !== null ? <Error margin='10px auto' errorValue={removeError} errorMessages={{ '500': t('error500') }} /> : null }
        { qualifications.length === 0 ? <div id='cqrl-noqualif'>{t('noQualifications')}</div> : null }
        {
          qualifications.map((item: QualificationsProperties) => <Item key={item._id} id={item._id} title={item.title} startingDate={item.startingDate} endDate={item.endDate} inProgress={item.inProgress} school={item.school} removeFn={handleRemoveQualification} loading={removeLoading} />)
        }
      </div>
    </div>
  );
}


// export
export default withTranslation('common')(Qualifications);