// @module import
import { useState, useEffect, useRef } from 'react';
import { useCookies } from 'react-cookie';


// @local import
import './index.css';
import { Input, Select, TextArea } from '../../../../Form';
import RemoveIconGrey from '../../../../../static/assets/remove_icon_grey.svg';
import ImportIconWhite from '../../../../../static/assets/import_icon_w.svg';
import { withTranslation } from '../../../../i18n';
import { handleInputText, handleInputEmail, handleInputNumber } from '../../../../../utils/input';
import { createNewCompany, updateCompany } from '../../../../../utils/request/companies';


// @component
const NewCompany = ({ t, closeWindow, update = false }) => {
  const [loading, setLoading] = useState(false);
  const [logo, setLogo] = useState(!update ? null : update.logo);
  const [logoFileError, setLogoFileError] = useState(false);
  const [fileLoading, setFileLoading] = useState({ logo: false, cover: false })
  const [cover, setCover] = useState(!update ? null : update.cover);
  const [coverFileError, setCoverFileError] = useState(false);
  const [name, setName] = useState(!update ? '' : update.name);
  const [email, setEmail] = useState(!update ? '' : update.email);
  const [phone, setPhone] = useState(!update ? '' : update.phone);
  const [address, setAddress] = useState(!update ? '' : update.address);
  const [country, setCountry] = useState(!update ? '' : update.country);
  const [companyEmployeesNumber, setCompanyEmployeesNumber] = useState(!update ? 'tiny' : update.employeesNumber);
  const [description, setDescription] = useState(!update ? '' : update.description);
  const [activityArea, setActivityArea] = useState(!update ? 'commercial' : update.activityArea[0]);
  const [NIF, setNIF] = useState(!update ? '' : update.NIF);
  const [link, setLink] = useState(!update ? '' : update.link);
  const isUnmounted = useRef(false);
  const [inputError, setInputError] = useState({
    logo: false,
    cover: false,
    name: false,
    email: false,
    phone: false,
    address: false,
    country: false,
    description: false,
    NIF: false,
    link: false
  });
  const [error, setError] = useState(false);
  const [cookies, _, __] = useCookies();


  useEffect(() => () => { isUnmounted.current = true }, []);


  const handleSubmitChecking = () => {
    const NEO = {
      logo: false,
      cover: false,
      name: false,
      email: false,
      phone: false,
      address: false,
      country: false,
      description: false,
      NIF: false,
      link: false
    };

    logo === null ? NEO.logo = true : null ;
    cover === null ? NEO.cover = true : null ;
    !handleInputText(name, 100) ? NEO.name = true : null ;
    !handleInputEmail(email, 100) ? NEO.email = true : null ;
    !handleInputNumber(phone, 100) ? NEO.phone = true : null ;
    !handleInputText(address, 200) ? NEO.address = true : null ;
    !handleInputText(country) ? NEO.country = true : null ;
    !handleInputText(description, 1500) ? NEO.description = true : null ;
    !handleInputText(NIF, 100) ? NEO.NIF = true : null ;
    !handleInputText(link, 200) ? NEO.link = true : null ;

    if (NEO.logo || NEO.cover || NEO.name || NEO.email || NEO.phone || NEO.address || NEO.country || NEO.description || NEO.NIF || NEO.link) {
      if (!isUnmounted.current) {
        setInputError(NEO);
        setLoading(false);
      }
      return false;
    }

    return true;
  }



  const handleSubmit = async e => {
    e.preventDefault();

    if (!isUnmounted.current)
      setLoading(true);

    if (!handleSubmitChecking())
      return;

    try {
      if (!isUnmounted.current) {
        setInputError({ logo: false, cover: false, name: false, email: false, phone: false, address: false, country: false, description: false, NIF: false, link: false });
        setLogoFileError(false);
        setCoverFileError(false);
      }

      const dataToSend = { logo: (typeof logo === 'object') ? { data: logo.data, type: logo.type } : logo, cover: (typeof cover === 'object') ? { data: cover.data, type: cover.type } : cover, name, email, phone, address, country, companyEmployeesNumber, description, activityArea, NIF, link };
      const res = await ((update === false) ?
                        createNewCompany(dataToSend, cookies.token) :
                        updateCompany({ ...update, ...dataToSend }, cookies.token))

      if (res.status === 200) {
        const rdata = await res.json();
        if (rdata.state === 'created' || rdata.state === 'updated') {
          if (!isUnmounted.current) {
            setLoading(false);
            (rdata.state === 'created') ? closeWindow() : closeWindow(rdata.data);
          }
        } else if (rdata.state === 'already exist') {
          if (!isUnmounted.current) {
            setError(rdata.state);
            setLoading(false);
          }
        }
        else
          throw rdata.state;
      }
      else
        throw res.status;

    } catch (e) {
      console.log(e);
      if (!isUnmounted.current) {
        setLoading(false);
        setError(500);
      }
    }
  }

  // Handle the imported file.
  const handleFileChange = (e, item) => {
    if (e.target.files.length === 0 || e.target.files === undefined)
      return;

    const file = e.target.files[0];

    if (file.size > 2000000) {
      if (!isUnmounted.current) {
        if (item === 'logo') setLogoFileError(true);
        else if (item === 'cover') setCoverFileError(true);
      }
      return;
    }

    if (!isUnmounted.current)
      setFileLoading({ ...fileLoading, [item]: true });

    const freader = new FileReader();

    freader.onloadend = e => {
      const data = e.target.result;
      const name = file.name;
      const type = file.type.replace(/^image\//, '');

      if (!isUnmounted.current) {
        if (item === 'logo') setLogo({ data, name, type });
        else if (item === 'cover') setCover({ data, name, type });

        setFileLoading({ ...fileLoading, [item]: false });
        logoFileError ? setLogoFileError(false) : null;
        coverFileError ? setCoverFileError(false) : null;
      }
    };

    freader.readAsDataURL(e.target.files[0]);

    return;
  }


  return (
    <form className='new-company-root' onSubmit={handleSubmit}>
      <div className='new-company-box'>
        <div className='new-company-box-picture'>
          <h2 className='new-company-label'>{t('newCompanyLogo')}</h2>
          <div className='new-company-fileSelected'>{logo === null ? t('noFileSelected') : (typeof logo === 'string') ? t('fileIsPresent') : (logo.name.length > 50) ? logo.name.substring(0, 50) + '...' : logo.name}</div>
          <div className='new-company-picbox'>
            <label className='new-company-import' htmlFor='logo_input'>
              <img className='new-company-import-icon' src={ImportIconWhite} alt='import_icon' />
              {t('import')}
            </label>
            <input
              disabled={fileLoading.logo}
              type='file'
              style={{ display: 'none' }}
              id='logo_input'
              accept='image/jpeg, image/png, image/jpg'
              onChange={e => handleFileChange(e, 'logo')}
            />
            <div>
              <div className='new-company-format-txt'>{t('pictureFormat')}</div>
              <div className='new-company-format-txt'>{t('weight')}</div>
            </div>
          </div>
          { inputError.logo ? <div className='new-company-label-error'>{t('fileEmptyError')}</div> : null}
          { logoFileError ? <div className='new-company-label-error'>{t('ppSizeError')}</div> : null }
        </div>

        <div className='new-company-box-picture'>
          <h2 className='new-company-label'>{t('newCompanyCover')}</h2>
          <div className='new-company-fileSelected'>{cover === null ? t('noFileSelected') : ((typeof cover === 'string')) ? t('fileIsPresent') : (cover.name.length > 50) ? cover.name.substring(0, 50) + '...' : cover.name}</div>
          <div className='new-company-picbox'>
            <label className='new-company-import' htmlFor='cover_input'>
              <img className='new-company-import-icon' src={ImportIconWhite} alt='import_icon' />
              {t('import')}
            </label>
            <input
              disabled={fileLoading.cover}
              type='file'
              style={{ display: 'none' }}
              id='cover_input'
              accept='image/jpeg, image/png, image/jpg'
              onChange={e => handleFileChange(e, 'cover')}
              />
            <div>
              <div className='new-company-format-txt'>{t('pictureFormat')}</div>
              <div className='new-company-format-txt'>{t('weight')}</div>
            </div>
          </div>
          { inputError.cover ? <div className='new-company-label-error'>{t('fileEmptyError')}</div> : null}
          { coverFileError ? <div className='new-company-label-error'>{t('ppSizeError')}</div> : null }
        </div>
      </div>

      <button className='new-company-close' type='button' onClick={() => (!update) ? closeWindow() : closeWindow('noupdate')}>
        <img src={RemoveIconGrey} alt='' />
      </button>

      <div className='new-company-box'>
        <div className='new-company-box-el'>
          <Input
            error={inputError.name}
            label={t('companyName')}
            placeholder={t('phCompanyName')}
            value={name}
            setValue={setName}
            formatErrorMsg={t('emptyOrTooLongError')}
            type='text'
            loading={loading}
            width='100%'
            margin='10px 20px'
          />
        </div>

        <div className='new-company-box-el'>
          <Input
            error={inputError.email}
            label={t('companyEmail')}
            placeholder={t('phCompanyEmail')}
            value={email}
            setValue={setEmail}
            formatErrorMsg={t('emptyOrInvalidFormatError')}
            type='email'
            loading={loading}
            width='100%'
            margin='10px 20px'
          />
        </div>

        <div className='new-company-box-el'>
          <Input
            error={inputError.phone}
            label={t('companyPhone')}
            placeholder={t('phCompanyPhone')}
            value={phone}
            setValue={setPhone}
            formatErrorMsg={t('emptyOrInvalidFormatError')}
            type='text'
            loading={loading}
            width='100%'
            margin='10px 20px'
          />
        </div>

        <div className='new-company-box-el'>
          <Input
            error={inputError.address}
            label={t('companyAddress')}
            placeholder={t('phCompanyAddress')}
            value={address}
            setValue={setAddress}
            formatErrorMsg={t('emptyOrTooLongError')}
            type='text'
            loading={loading}
            width='100%'
            margin='10px 20px'
          />
        </div>

        <div className='new-company-box-el'>
          <Input
            error={inputError.country}
            label={t('companyCountry')}
            placeholder={t('phCompanyCountry')}
            value={country}
            setValue={setCountry}
            formatErrorMsg={t('emptyOrTooLongError')}
            type='text'
            loading={loading}
            width='100%'
            margin='10px 20px'
          />
        </div>

        <div className='new-company-box-el'>
          <Select
            label={t('companyEmployeesNumber')}
            value={companyEmployeesNumber}
            setValue={setCompanyEmployeesNumber}
            optionList={[
              { label: t('companyEmployeesNumberTiny'), value: 'tiny' },
              { label: t('companyEmployeesNumberSmall'), value: 'small' },
              { label: t('companyEmployeesNumberMid'), value: 'mid' },
              { label: t('companyEmployeesNumberBig'), value: 'big' },
              { label: t('companyEmployeesNumberHuge'), value: 'huge' }
            ]}
            loading={loading}
            width='calc(100% - 40px)'
            margin='10px 20px'
          />
        </div>
      </div>

      <div className='new-company-box'>
        <TextArea
          label={t('companyDescription')}
          value={description}
          setValue={setDescription}
          placeholder={t('phCompanyDescription')}
          loading={loading}
          error={inputError.description}
          width='100%'
          margin='40px 20px 40px 20px'
          errMsg={t('emptyOrTooLongError')}
        />
      </div>

      <div className='new-company-box'>
        <div className='new-company-box-el'>
          <Select
            label={t('companyActivityArea')}
            value={activityArea}
            setValue={setActivityArea}
            optionList={[
              { label: t('commercial'), value: 'commercial' },
              { label: t('tech'), value: 'tech' },
              { label: t('engineering'), value: 'engineering' },
              { label: t('retail'), value: 'retail' },
            ]}
            loading={loading}
            width='calc(100% - 40px)'
            margin='10px 20px'
          />
        </div>

        <div className='new-company-box-el'>
          <Input
            error={inputError.NIF}
            label={t('companyNIF')}
            placeholder={t('phCompanyNIF')}
            value={NIF}
            setValue={setNIF}
            formatErrorMsg={t('emptyOrTooLongError')}
            type='text'
            loading={loading}
            width='100%'
            margin='10px 20px'
          />
        </div>

        <div className='new-company-box-el'>
          <Input
            error={inputError.link}
            label={t('companyLink')}
            placeholder={t('phCompanyLink')}
            value={link}
            setValue={setLink}
            formatErrorMsg={t('emptyOrTooLongError')}
            type='text'
            loading={loading}
            width='100%'
            margin='10px 20px'
          />
        </div>
      </div>

      <button type='submit' className='new-company-btn-validation'>
        {loading ? <div className='new-company-btn-loading'></div> : update === false ? t('validate') : t('update')}
      </button>
      { error === 'already exist' ? <div className='new-company-error'>{t('companyAlreadyExist')}</div> : null }
      { error === 500 ? <div className='new-company-error'>{t('error500')}</div> : null }
    </form>
  );
}


// @export
export default withTranslation('common')(NewCompany);