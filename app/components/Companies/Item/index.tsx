// @module import
import React, { useState, useRef, ChangeEvent, Dispatch, SetStateAction } from 'react';
import { WithTranslation } from 'next-i18next';
import { useCookies } from 'react-cookie';


// @local import
import './index.css';
import { withTranslation } from '../../i18n';
import { serverFileURL } from '../../../utils/config';
import { createNewCompany, updateCompany, deleteCompany } from '../../../utils/request/companies';
import Input from '../../Form/Input';
import TextArea from '../../Form/TextArea';
import Dropdown from '../../Form/Dropdown';
import { handleInputText, handleInputPhone, handleInputEmail } from '../../../utils/input';
import Error from '../../Error';
import { CompanyProps } from '../../../types/company';
import { useRouter } from 'next/router';

const ValidationIcon  = require('../../../static/assets/chevron-down-icon-green.svg')     as string;
const CrossIconRed    = require('../../../static/assets/cross-icon-red.svg')              as string;
const CrossIconGrey   = require('../../../static/assets/cross-icon-grey.svg')             as string;
const EditIcon        = require('../../../static/assets/edit-icon-blue.svg')              as string;
const ArrowIcon       = require('../../../static/assets/arrow-right-icon-grey.svg')       as string;
// const DotIcon         = require('../../../static/assets/dot-icon-grey.svg')            as string;


// @interface
interface ComponentProps extends WithTranslation {
  data: CompanyProps,

  editable?: {
    current: string,
    validation: (e: any) => void,
    cancel: Dispatch<SetStateAction<boolean>>,
    remove: (id: string) => void,
    fetchLoading: string
  },

  onClickFn?: Function
}


// @component
const CompanyItem: (props: ComponentProps) => JSX.Element = ({ t, data, editable = null, onClickFn = null }) => {

  // Input State management.
  const [edit, setEdit]                     = useState(false);
  const [modalState, setModalState]         = useState(false);
  const [companyLogo, setCompanyLogo]       = useState({ value: data !== null ? data.logo       : '', type: null, error: null });
  const [companyName, setCompanyName]       = useState({ value: data !== null ? data.name       : '', error: null });
  const [companyPhone, setCompanyPhone]     = useState({ value: data !== null ? data.phone      : '', error: null });
  const [companyEmail, setCompanyEmail]     = useState({ value: data !== null ? data.email      : '', error: null });
  const [companyCountry, setCompanyCountry] = useState({ value: data !== null ? data.country    : '', error: null });
  const [companyCity, setCompanyCity]       = useState({ value: data !== null ? data.city       : '', error: null });
  const [companyLink, setCompanyLink]       = useState({ value: data !== null ? data.link       : '', error: null });


  // TextArea State Management
  const [companyDescription, setCompanyDescription] = useState({ value: data !== null ? data.description : '', error: null });


  // Dropdown State Management
  const [companyCategory, setCompanyCategory]     = useState({ value: { value: data !== null ? data.category        : '', label: data !== null ? t(data.category)        : t('phCompanyCategory')}, error: null });
  const [companyEmployeeNb, setCompanyEmployeeNb] = useState({ value: { value: data !== null ? data.employeesNumber : '', label: data !== null ? t(data.employeesNumber) : t('phCompanyEmployeeNb')}, error: null });


  // Component General State, Ref & Cookie management.
  const [fetchLoading, setFetchLoading] = useState(false);
  const [genError, setGenError]         = useState(null);
  const [cookies, _, __]                = useCookies();
  const isUnmounted                     = useRef(false);
  const router                          = useRouter();


  // Handle the update of the company logo.
  const handleLogoUpdate = e => {
    const file = e.target.files[0];

    if (file.size > 2000000) {
      setCompanyLogo({ ...companyLogo, error: 'sizeError' });
      return;
    }

    setCompanyLogo({ ...companyLogo, error: null });
    const freader = new FileReader();

    freader.onload = function(evt) {
      setCompanyLogo({ value: evt.target.result.toString(), error: null, type: file.type.replace(/^image\//, '') });
    }

    freader.readAsDataURL(file);
  }


  // Check the information.
  const validationChecking: () => boolean = () => {
    let inputErrors = {
      logo: false,
      name: false,
      phone: false,
      email: false,
      country: false,
      city: false,
      description: false,
      category: false,
      employeesNumber: false,
      link: false
    };

    (companyLogo.value === '')                          ? inputErrors.logo = true             : null;
    (!handleInputText(companyName.value, 100))          ? inputErrors.name = true             : null;
    (!handleInputPhone(companyPhone.value))             ? inputErrors.phone = true            : null ;
    (!handleInputEmail(companyEmail.value))             ? inputErrors.email = true            : null ;
    (!handleInputText(companyCountry.value, 100))       ? inputErrors.country = true          : null ;
    (!handleInputText(companyCity.value, 100))          ? inputErrors.city = true             : null ;
    (!handleInputText(companyDescription.value, 1000))  ? inputErrors.description = true      : null ;
    (companyCategory.value.value === '')                ? inputErrors.category = true         : null ;
    (companyEmployeeNb.value.value === '')              ? inputErrors.employeesNumber = true  : null ;
    (!handleInputText(companyLink.value, 100))          ? inputErrors.link = true             : null ;


    if (!isUnmounted.current) {
      setCompanyLogo({ ...companyLogo, error: inputErrors.logo ? 'empty' : null })
      setCompanyName({ ...companyName, error: inputErrors.name ? 'invalidFormat' : null });
      setCompanyPhone({ ...companyPhone, error: inputErrors.phone ? 'invalidFormat' : null });
      setCompanyEmail({ ...companyEmail, error: inputErrors.email ? 'invalidFormat' : null });
      setCompanyCountry({ ...companyCountry, error: inputErrors.country ? 'invalidFormat' : null });
      setCompanyCity({ ...companyCity, error: inputErrors.city ? 'invalidFormat' : null });
      setCompanyDescription({ ...companyDescription, error: inputErrors.description ? 'invalidFormat' : null });
      setCompanyCategory({ ...companyCategory, error: inputErrors.category ? 'empty' : null});
      setCompanyEmployeeNb({ ...companyEmployeeNb, error: inputErrors.employeesNumber ? 'empty' : null });
      setCompanyLink({ ...companyLink, error: inputErrors.link ? 'invalidFormat' : null });
    }

    if (
      inputErrors.logo              ||
      inputErrors.name              ||
      inputErrors.phone             ||
      inputErrors.email             ||
      inputErrors.country           ||
      inputErrors.city              ||
      inputErrors.description       ||
      inputErrors.category          ||
      inputErrors.employeesNumber   ||
      inputErrors.link
    )
      return true;

    return false;
  }


  // Handle Edit/Creation Validation.
  const handleValidation = async () => {
    // CHECK
    if (validationChecking())
      return;

    if (!isUnmounted.current) {
      setFetchLoading(true);
      setGenError(null);
    }

    if (editable.current === 'new') {
      try {
        const response = await createNewCompany({
          logo: { data: companyLogo.value, type: companyLogo.type },
          name: companyName.value,
          phone: companyPhone.value,
          email: companyEmail.value,
          country: companyCountry.value,
          city: companyCity.value,
          description: companyDescription.value,
          category: companyCategory.value.value,
          employeesNumber: companyEmployeeNb.value.value,
          link: companyLink.value,
        }, cookies.token);

        if (response.status === 200) {
          const company = await response.json();
          if (!isUnmounted.current) {
            editable.validation(company);
            editable.cancel(false);
            setFetchLoading(false);
            setGenError(null);
          }
        }
        else if (response.status === 401) {
          const { state } = await response.json();
          if (!isUnmounted.current) {
            setFetchLoading(false);
            setGenError(state);
          }
        }
        else
          throw response;
      }
      catch (e) {
        console.log(e);
        if (!isUnmounted.current) {
          setFetchLoading(false);
          setGenError('500');
        }
      }
    }
    else {
      try {
        const response = await updateCompany({
          _id: data._id,
          logo: { data: companyLogo.value, type: companyLogo.type, new: data.logo !== companyLogo.value },
          name: companyName.value,
          phone: companyPhone.value,
          email: companyEmail.value,
          country: companyCountry.value,
          city: companyCity.value,
          description: companyDescription.value,
          category: companyCategory.value.value,
          employeesNumber: companyEmployeeNb.value.value,
          link: companyLink.value,
        }, cookies.token);

        if (response.status === 200) {
          const company = await response.json();
          editable.validation(company);

          if (!isUnmounted.current) {
            setFetchLoading(false);
            setGenError(null);
            setEdit(false);
          }
        } else if (response.status === 401) {
          const { state } = await response.json();
          if (!isUnmounted.current) {
            setFetchLoading(false);
            setGenError(state);
          }

        }
        else
          throw response;
      }
      catch (e) {
        console.log(e);
        if (!isUnmounted.current) {
          setFetchLoading(false);
          setGenError('500');
        }
      }
    }
  }


  // Handle Edit/Creation Canceling.
  const handleRemoving = async (id: string) => {
    if (!isUnmounted.current) {
      setFetchLoading(true);
      setGenError(false);
    }

    try {
      const response = await deleteCompany({ logo: companyLogo.value, id: data._id }, cookies.token);
      if (response.status === 204) {
        editable.remove(data._id);
      }
      else
        throw response;
    }
    catch (e) {
      console.log(e);
      if (!isUnmounted.current) {
        setFetchLoading(false);
        setGenError('500');
      }
    }
  };


  // Rendering function.
  return (
    <div className={`comp-company-item-root${onClickFn !== null ? ` --ccir-clickable` : ``}`} onClick={() => onClickFn !== null ? onClickFn() : null}>

      {
        modalState ?
        <div className='ccir-modal-background'>
          <div className='ccir-modal'>
            <h4 className='ccir-modal-txt'>{t('deleteCompanyWarning')}</h4>
            <button className='ccir-modal-btn' style={{ color: '#246BF8' }} onClick={() => setModalState(false)}>{t('cancel')}</button>
            <button className='ccir-modal-btn' style={{ color: 'rgba(214, 48, 49, 1)' }} onClick={() => { handleRemoving(data._id); setModalState(false); }}>{t('remove')}</button>
          </div>
        </div> :
        null
      }

      {
        editable !== null && (editable.current !== 'new' && !edit) ?
        <>
          <button className='ccir-btn --ccir-btn-update' disabled={fetchLoading} onClick={() => setEdit(true)}>
            <img className='ccirb-icon' src={EditIcon} alt="update-icon" />
          </button>
          <button className='ccir-btn --ccir-btn-remove' disabled={fetchLoading} onClick={() => setModalState(true)}>
            <img className='ccirb-icon' src={CrossIconGrey} alt="remove-icon" />
          </button>
        </> :
        null
      }

      {
        ((editable !== null && edit) || (editable !== null && editable.current === 'new')) ?
        <>
          <button className='ccir-btn --ccir-btn-validate' disabled={fetchLoading} onClick={() => handleValidation()}>
            <img className='ccirb-icon' src={ValidationIcon} alt="valide-icon" />
          </button>

          <button className='ccir-btn --ccir-btn-cancel' disabled={fetchLoading} onClick={() => { editable.current === 'new' ? editable.cancel(false) : setEdit(false) }}>
            <img className='ccirb-icon' src={CrossIconRed} alt="cancel-icon" />
          </button>
        </> :
        null
      }

      { data === null && companyLogo.value === '' ? <div className={`ccir-logo${companyLogo.error === 'empty' ? ` --ccir-logo-empty` : ``}`} style={{ backgroundColor: '#f7f8fc' }}></div> : <img className='ccir-logo' src={`${data !== null && data.logo === companyLogo.value ? serverFileURL : ``}${companyLogo.value}`} alt=""/> }

      {
        (!edit && editable === null ) || (editable !== null && editable.current !== 'new' && !edit) ?
        <div className='ccir-public'>
          <h4 className='ccirp-name'>{data.name}</h4>
          {/* <div className='ccirp-sub'> */}
            <p className='ccirps-phone'>{data.phone}</p>
            {/* <img className='ccirps-icon' src={DotIcon} alt="dot-icon"/> */}
            <a className='ccirps-link' href={'https://' + data.link} target='_blank'>{data.link}</a>
          {/* </div> */}

          <p className='ccirp-description'>{data.description}</p>

          <div className='ccirp-box'>
            <div className='ccirp-line-horizontal'></div>
            <div className='ccirpb-txt'>
              <h5 className='ccirpbt-title'>{t('companyLocation')}</h5>
              <p className='ccirpbt-info'>{`${data.country}, ${data.city}`}</p>
            </div>
          </div>
            {/* <div className='ccirp-line-vertical'></div> */}


          <div className='ccirp-box'>
            <div className='ccirp-line-horizontal'></div>
            <div className='ccirpb-txt'>
              <h5 className='ccirpbt-title'>{t('companyEmployeeNumber')}</h5>
              <p className='ccirpbt-info'>{t(data.employeesNumber)}</p>
            </div>
          </div>

          <div className='ccirp-box'>
            <div className='ccirp-line-horizontal'></div>
            <div className='ccirpb-txt'>
              <h5 className='ccirpbt-title'>{t('companyCategory')}</h5>
              <p className='ccirpbt-info'>{t(data.category)}</p>
            </div>
          </div>

          <div className='ccirp-box'>
            <div className='ccirp-line-horizontal'></div>
            {/* <div className='ccirp-line-vertical'></div> */}
            <div className='ccirpb-txt'>
              <h5 className='ccirpbt-title'>{t('companyContactEmail')}</h5>
              <p className='ccirpbt-info'>{data.email}</p>
            </div>
          </div>

          { data.announcesNumber ? <div className='ccirp-open-offers'>{data.announcesNumber} {t(data.announcesNumber > 1 ? 'openOffers' : 'openOffer')}</div> : null }
          {
            !edit && onClickFn === null ?
            <button className='ccirp-see-announce' type='button' onClick={() => router.push('/companies/' + data.name)}>
              {t('seeCompany')}
              <img src={ArrowIcon} alt="see-announce"/>
            </button> :
            null
          }
        </div> :
        null
      }

      {
        edit || (editable !== null && editable.current === 'new') ?
        <div className='ccir-edit'>
          <label className='ccire-logo'>
            <p className='ccirel-txt'>{t('importLogo')}</p>
            <input style={{ display: 'none' }} type="file" accept="image/jpeg, image/png" onChange={(e) => handleLogoUpdate(e)} />
          </label>

          <Input
            placeholder={t('phCompanyName')}
            label={t('companyName')}
            type='text'
            changeFn={(value: string) => setCompanyName({ ...companyName, value })}
            value={companyName.value}
            autocomplete='off'
            margin='20px 0px 0px 0px'
            error={companyName.error !== null}
            errorValue={companyName.error}
            errorMessages={{ 'invalidFormat': t('inputTextError') }}
            disabled={fetchLoading}
            onBlurFn={() => {}}
          />
          <Input
            placeholder={t('phCompanyPhone')}
            label={t('companyPhone')}
            type='text'
            changeFn={(value: string) => setCompanyPhone({ ...companyPhone, value })}
            value={companyPhone.value}
            autocomplete='off'
            margin='20px 0px 0px 0px'
            error={companyPhone.error !== null}
            errorValue={companyPhone.error}
            errorMessages={{ 'invalidFormat' : t('inputPhoneError') }}
            disabled={fetchLoading}
            onBlurFn={() => {}}
          />
          <Input
            placeholder={t('phCompanyEmail')}
            label={t('companyEmail')}
            type='text'
            changeFn={(value: string) => setCompanyEmail({ ...companyEmail, value })}
            value={companyEmail.value}
            autocomplete='off'
            margin='20px 0px 0px 0px'
            error={companyEmail.error !== null}
            errorValue={companyEmail.error}
            errorMessages={{ 'invalidFormat' : t('inputEmailError') }}
            disabled={fetchLoading}
            onBlurFn={() => {}}
          />
          <Input
            placeholder={t('phCompanyCountry')}
            label={t('companyCountry')}
            type='text'
            changeFn={(value: string) => setCompanyCountry({ ...companyCountry, value })}
            value={companyCountry.value}
            autocomplete='off'
            margin='20px 0px 0px 0px'
            error={companyCountry.error !== null}
            errorValue={companyCountry.error}
            errorMessages={{ 'invalidFormat' : t('inputTextError') }}
            disabled={fetchLoading}
            onBlurFn={() => {}}
          />
          <Input
            placeholder={t('phCompanyCity')}
            label={t('companyCity')}
            type='text'
            changeFn={(value: string) => setCompanyCity({ ...companyCity, value })}
            value={companyCity.value}
            autocomplete='off'
            margin='20px 0px 0px 0px'
            error={companyCity.error !== null}
            errorValue={companyCity.error}
            errorMessages={{ 'invalidFormat' : t('inputTextError') }}
            disabled={fetchLoading}
            onBlurFn={() => {}}
          />

          <TextArea
            placeholder={t('phCompanyDescription')}
            label={t('companyDescription')}
            changeFn={(value: string) => setCompanyDescription({ ...companyDescription, value })}
            value={companyDescription.value}
            margin='20px 0px 0px 0px'
            error={companyDescription.error !== null}
            errorValue={companyDescription.error}
            errorMessages={{ 'invalidFormat' : t('inputTextError') }}
            loading={editable.current !== null && editable.fetchLoading === editable.current}
            onBlurFn={() => {}}
          />

          <Dropdown
            placeholder={t('phCompanyCategory')}
            label={t('companyCategory')}
            changeValue={(value: { value: string, label: string }) => setCompanyCategory({ ...companyCategory, value })}
            currentValue={companyCategory.value}
            margin='20px 0px 0px 0px'
            error={companyCategory.error !== null}
            errorValue={companyCategory.error}
            errorMessages={{ 'empty' : t('inputDropdownError') }}
            disabled={fetchLoading}
            list={[
              { value: '', label: t('phCompanyCategory') },
              { value: 'commercial', label: t('commercial') },
              { value: 'tech-it', label: t('tech') },
              { value: 'marketing', label: t('marketing') },
              { value: 'finance', label: t('finance') },
              { value: 'engineering', label: t('engineering') },
              { value: 'legal', label: t('legal') },
              { value: 'retail', label: t('retail') },
              { value: 'logistic', label: t('logistic') },
              { value: 'direction', label: t('direction') },
              { value: 'design', label: t('design') }
            ]}
          />
          <Dropdown
            placeholder={t('phCompanyEmployeeNb')}
            label={t('companyEmployeeNb')}
            changeValue={(value: { value: string, label: string }) => setCompanyEmployeeNb({ ...companyEmployeeNb, value })}
            currentValue={companyEmployeeNb.value}
            margin='20px 0px 0px 0px'
            error={companyEmployeeNb.error !== null}
            errorValue={companyEmployeeNb.error}
            errorMessages={{ 'empty' : t('inputDropdownError') }}
            disabled={fetchLoading}
            list={[
              { value: '', label: t('phCompanyEmployeeNb') },
              { value: '0to5', label: t('0to5') },
              { value: '5to25', label: t('5to25') },
              { value: '25to100', label: t('25to100') },
              { value: '100to250', label: t('100to250') },
              { value: '250to1000', label: t('250to1000') },
              { value: '1000+', label: t('1000+') },
            ]}
          />

          <Input
            placeholder={t('phCompanyLink')}
            label={t('companyLink')}
            type='text'
            changeFn={(value: string) => setCompanyLink({ ...companyLink, value })}
            value={companyLink.value}
            autocomplete='off'
            margin='20px 0px 20px 0px'
            error={companyLink.error !== null}
            errorValue={companyLink.error}
            errorMessages={{ 'invalidFormat' : t('inputTextError') }}
            disabled={fetchLoading}
            onBlurFn={() => {}}
          />

          { genError !== null ? <Error margin='10px auto' errorValue={genError} errorMessages={{ '500': t('error500'), 'alreadyExist': t('companyAlreadyExist'), 'unauthorized': t('unauthorized') }} /> : null }
        </div> :
        null
      }

    </div>
  );
}


// @export
export default withTranslation('common')(CompanyItem);