// @module import
import { Dispatch, SetStateAction, useState, useRef, FormEvent, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { WithTranslation } from "next-i18next";
import { injectStripe } from 'react-stripe-elements';


// @local import
import './index.css';
import { withTranslation } from '../../../../../i18n';
import Input from '../../../../../Form/Input';
import CardNumberInput from '../../../../../Form/Card/Number';
// import CardExpirationDate from '../../../../../Form/Card/ExpirationDate';
import InputDate from '../../../../../Form/Date';
import Dropdown from '../../../../../Form/Dropdown';
import TextArea from '../../../../../Form/TextArea';
import CheckBox from '../../../../../CheckBox';
import { getListValues } from '../../../../../../utils/listValues';
import { getRecruiterCompanies } from '../../../../../../utils/request/companies';
import { postAnnounce } from '../../../../../../utils/request/announces';
import BenefitItem from '../../../../../Profil/V2/Informations/Skills/Item';
import { getPaymentIntent } from '../../../../../../utils/request/announces';
import { handleInputText } from '../../../../../../utils/input';
import Error from '../../../../../Error';

const CrossIcon = require('../../../../../../static/assets/cross-icon-grey.svg') as string;
const ArrowIcon = require('../../../../../../static/assets/arrow-right-icon_white.svg') as string;


// @interface
interface ComponentProps extends WithTranslation {
  changeView: Dispatch<SetStateAction<string>>,
  addAnnounce: (announce: {
    _id: string,
    title: string,
    level: string,
    company: string,
    country: string,
    city: string,
    street: string,
    remote: boolean,
    postDescription: string,
    postResponsibilities: string,
    profilDescription: string,
    contractType: string,
    salary: { min: number, max: number },
    startingDate: string,
    visaSponsoring: boolean,
    category: string,
    benefits: Array<string>,
    publicId: string,
    candidates: Array<string>
  }) => void,
  // stripe: Stripe
}


// Elements Style
// const StyleNumberElement = {
//   base: {
//     border: '1.5px solid rgba(64, 70, 96, .25)',
//     padding: '20px',
//     color: 'blue',
//     margin: '20px'
//   }
// }


// @component
const FormComponent: (props: ComponentProps) => JSX.Element = (props) => {``

  const { t, addAnnounce, changeView } = props;

  // Input Information State Management.
  const [title, setTitle]                           = useState({ value: '', error: null });
  const [country, setCountry]                       = useState({ value: '', error: null });
  const [city, setCity]                             = useState({ value: '', error: null });
  const [street, setStreet]                         = useState({ value: '', error: null });
  const [minSalary, setMinSalary]                   = useState({ value: '', error: null });
  const [maxSalary, setMaxSalary]                   = useState({ value: '', error: null });
  const [startingDate, setStartingDate]             = useState({ value: null, error: null });
  const [benefitValue, setBenefitValue]             = useState({ value: '', error: null });
  const [benefits, setBenefits]                     = useState([]);
  const [cardNumber, setCardNumber]                 = useState({ value: '', error: null });
  const [cardExpirationDate, setCardExpirationDate] = useState({ value: '', error: null });
  const [cardCvc, setCardCvc]                       = useState({ value: '', error: null });
  const [coupon, setCoupon]                         = useState({ value: '', error: null, validated: false });
  const [announcePrice, setAnnouncePrice]           = useState(150);
  const [clientSecret, setClientSecret]             = useState(null);


  // Checkbox Information State Management.
  const [remote, setRemote]                 = useState(false);
  const [visaSponsoring, setVisaSponsoring] = useState(false);


  // Dropdown Information State Management.
  const [company, setCompany]           = useState({ value: { value: '', label: t('phSelectCompany') }, error: null });
  const [level, setLevel]               = useState({ value: { value: '', label: t('phLevel') }, error: null });
  const [contractType, setContractType] = useState({ value: { value: '', label: t('phContractType') }, error: null });
  const [category, setCategory]         = useState({ value: { value: '', label: t('phSelectCategory') }, error: null });


  // TextArea Information State Management.
  const [postDescription, setPostDescription]           = useState({ value: '', error: null });
  const [postResponsibilities, setPostResponsibilities] = useState({ value: '', error: null });
  const [profilDescription, setProfilDescription]       = useState({ value: '', error: null });


  // Recruiter Info
  const [recruiterCompanies, setRecruiterCompanies]     = useState([]);


  // General State Management.
  const [fetchCompaniesLoading, setFetchCompaniesLoading] = useState(false);
  const [fetchCouponLoading, setFetchCouponLoading]       = useState(false);
  const [fetchLoading, setFetchLoading]                   = useState(false);
  const [genError, setGenError]                           = useState(null);
  const [cookies, _, __]                                  = useCookies();
  const isUnmounted                                       = useRef(false);


  // Set a benefit
  const handleBenefitSubmition = (e: FormEvent) => {
    event.preventDefault();

    if (benefitValue.value === '' || (benefits.filter(item => item.toLowerCase() === benefitValue.value.toLowerCase()).length !== 0))
      return;

    if (!isUnmounted.current) {
      setBenefits([ ...benefits, benefitValue.value ]);
      setBenefitValue({ ...benefitValue, value: '' });
    }
  }


  // Remove a benefit
  const handleBenefitRemoving = (value: string) => {
    if (!isUnmounted.current)
      setBenefits([ ...benefits.filter(item => item !== value) ]);
  }


  // Get all the companies of a recruiter.
  const handleCompaniesRequest = async () => {
    if (!isUnmounted.current)
      if (!fetchCompaniesLoading) setFetchCompaniesLoading(true);

    try {
      const response = await getRecruiterCompanies(cookies.token);
      if (response.status === 200) {
        const companiesData = await response.json();
        if (!isUnmounted.current) {
          setRecruiterCompanies(companiesData.map(item => ({ value: item._id, label: item.name })));
          setFetchCompaniesLoading(false);
        }
      }
      else
        throw response.status;
    }
    catch (e) {
      console.log(e)
      if (!isUnmounted.current)
        setFetchCompaniesLoading(false);
    }
  };


  // Form checking handler.
  const handleFormChecking = () => {
    const inputErrors = {
      title: false,
      country: false,
      city: false,
      street: false,
      minSalary: false,
      maxSalary: false,
      startingDate: false,
      benefits: false,
      company: false,
      level: false,
      contractType: false,
      category: false,
      postDescription: false,
      postResponsibilities: false,
      profilDescription: false
    };

    if (!handleInputText(title.value, 500))                                               inputErrors.title = true;
    if (!handleInputText(country.value, 100))                                             inputErrors.country = true;
    if (!handleInputText(city.value, 500))                                                inputErrors.city = true;
    if (!handleInputText(street.value, 500))                                              inputErrors.street = true;
    if (minSalary.value === '')                                                           inputErrors.minSalary = true;
    if (maxSalary.value === '' || parseInt(maxSalary.value) < parseInt(minSalary.value))  inputErrors.maxSalary = true;
    if (startingDate.value === '' || startingDate.value === null)                         inputErrors.startingDate = true;
    if (benefits.length === 0)                                                            inputErrors.benefits = true;
    if (company.value.value === '')                                                       inputErrors.company = true;
    if (level.value.value === '')                                                         inputErrors.level = true;
    if (contractType.value.value === '')                                                  inputErrors.contractType = true;
    if (category.value.value === '')                                                      inputErrors.category = true;
    if (!handleInputText(postDescription.value, 10000))                                   inputErrors.postDescription = true;
    if (!handleInputText(postResponsibilities.value, 10000))                              inputErrors.postResponsibilities = true;
    if (!handleInputText(profilDescription.value, 10000))                                 inputErrors.profilDescription = true;

    (inputErrors.title)                ? setTitle({ ...title, error: 'invalidFormat' })                               : setTitle({ ...title, error: null });
    (inputErrors.country)              ? setCountry({ ...country, error: 'invalidFormat' })                           : setCountry({ ...country, error: null });
    (inputErrors.city)                 ? setCity({ ...city, error: 'invalidFormat' })                                 : setCity({ ...city, error: null });
    (inputErrors.street)               ? setStreet({ ...street, error: 'invalidFormat' })                             : setStreet({ ...street, error: null });
    (inputErrors.minSalary)            ? setMinSalary({ ...minSalary, error: 'invalidFormat' })                       : setMinSalary({ ...minSalary, error: null });
    (inputErrors.maxSalary)            ? setMaxSalary({ ...maxSalary, error: 'invalidFormat' })                       : setMaxSalary({ ...maxSalary, error: null });
    (inputErrors.startingDate)         ? setStartingDate({ ...startingDate, error: 'invalidFormat' })                 : setStartingDate({ ...startingDate, error: null });
    (inputErrors.benefits)             ? setBenefitValue({ ...benefitValue, error: 'empty' })                         : setBenefitValue({ ...benefitValue, error: null });
    (inputErrors.company)              ? setCompany({ ...company, error: 'empty' })                                   : setCompany({ ...company, error: null });
    (inputErrors.level)                ? setLevel({ ...level, error: 'empty' })                                       : setLevel({ ...level, error: null });
    (inputErrors.contractType)         ? setContractType({ ...contractType, error: 'empty' })                         : setContractType({ ...contractType, error: null });
    (inputErrors.category)             ? setCategory({ ...category, error: 'empty' })                                 : setCategory({ ...category, error: null });
    (inputErrors.postDescription)      ? setPostDescription({ ...postDescription, error: 'invalidFormat' })           : setPostDescription({ ...postDescription, error: null });
    (inputErrors.postResponsibilities) ? setPostResponsibilities({ ...postResponsibilities, error: 'invalidFormat' }) : setPostResponsibilities({ ...postResponsibilities, error: null });
    (inputErrors.profilDescription)    ? setProfilDescription({ ...profilDescription, error: 'invalidFormat' })       : setProfilDescription({ ...profilDescription, error: null });

    if (
      inputErrors.title ||
      inputErrors.country ||
      inputErrors.city ||
      inputErrors.street ||
      inputErrors.minSalary ||
      inputErrors.maxSalary ||
      inputErrors.startingDate ||
      inputErrors.benefits ||
      inputErrors.company ||
      inputErrors.level ||
      inputErrors.contractType ||
      inputErrors.category ||
      inputErrors.postDescription ||
      inputErrors.postResponsibilities ||
      inputErrors.profilDescription
    )
      return false;

    return true;
  }


  // CouponSubmition
  const handleCouponSubmition = async () => {
    if (coupon.value === '') {
      if (!isUnmounted.current) {
        if (fetchCouponLoading) setFetchCouponLoading(false);
        if (coupon.error !== null) setCoupon({ ...coupon, error: null });
      }
      return;
    }

    if (!isUnmounted.current) {
      if (!fetchCouponLoading) setFetchCouponLoading(true);
      if (coupon.error !== null) setCoupon({ ...coupon, error: null });
    }

    try {
      const couponResponse = await getPaymentIntent(cookies.token, coupon.value);

      if (couponResponse.status === 200) {
        const intentData = await couponResponse.json();
        if (!isUnmounted.current) {
          setAnnouncePrice(intentData.amount);
          setClientSecret(intentData.clientSecret);
          setCoupon({ ...coupon, error: null, validated: true });

          if (intentData.amount === 0) {
            if (cardNumber.error !== null) setCardNumber({ ...cardNumber, error: null });
          }
        }
      }
      else if (couponResponse.status === 404)
        if (!isUnmounted.current) setCoupon({ ...coupon, error: 'invalidCoupon' });
      else
        throw couponResponse.status;

      if (!isUnmounted.current) setFetchCouponLoading(false);
    }
    catch (e) {
      console.log(e);
      if (!isUnmounted.current) {
        setFetchCouponLoading(false)
        setCoupon({ ...coupon, error: '500' });
      }
    }
  }


  // Handle the submition of an announce.
  const handleAnnounceSubmition = async () => {

    // Reset the general state (error & loading).
    if (!isUnmounted.current) {
      if (!fetchLoading) setFetchLoading(true);
      if (genError !== null) setGenError(null);
    }


    // Check errors.
    if (!handleFormChecking()) {
      if (!isUnmounted.current) setFetchLoading(false);
      return;
    }

    // Get the payment intent.
    let CLIENT_SECRET = clientSecret;
    let PRICE         = announcePrice;

    if (CLIENT_SECRET === null) {
      try {
        const intentResponse = await getPaymentIntent(cookies.token, coupon.value);

        if (intentResponse.status === 200) {
          const intentData = await intentResponse.json();
          PRICE = intentData.amount
          CLIENT_SECRET = intentData.clientSecret;
        }
        else if (intentResponse.status === 404)
          if (!isUnmounted.current) setGenError('invalidCoupon');
        else
          throw intentResponse.status;

        if (!isUnmounted.current) setFetchLoading(false);
      }
      catch (e) {
        console.log(e)
        if (!isUnmounted.current) {
          setFetchLoading(false);
          setGenError('500');
        }
      }
    }

    if (CLIENT_SECRET === null && PRICE !== 0)
      return;

    // Process the payment.
    try {

      if (announcePrice !== 0 && PRICE !== 0) {
        const cardElement = (props as any).elements.getElement('card');
        const confirmPaymentResponse = await (props as any).stripe.confirmCardPayment(CLIENT_SECRET.client_secret, { payment_method: { card: cardElement }});
        if (confirmPaymentResponse.error !== null && confirmPaymentResponse.error !== undefined) {
          if (!isUnmounted.current) {
            setFetchLoading(false);
            setCardNumber({ ...cardNumber, error: confirmPaymentResponse.error.message });
            setGenError(null);
            return;
          }
        }
      }

      const announceResponse = await postAnnounce({
        title: title.value,
        level: level.value.value,
        company: company.value.value,
        country: country.value,
        city: city.value,
        street: street.value,
        remote: remote,
        postDescription: postDescription.value,
        postResponsibilities: postResponsibilities.value,
        profilDescription: profilDescription.value,
        contractType: contractType.value.value,
        salary: { min: parseInt(minSalary.value) , max: parseInt(maxSalary.value) },
        startingDate: startingDate.value,
        visaSponsoring,
        category: category.value.value,
        benefits
      }, cookies.token);
      if (announceResponse.status === 200) {
        const announceData = await announceResponse.json();
        addAnnounce(announceData);
        changeView('list');
      }
      else
        throw announceResponse;
    }
    catch (e) {
      console.log(e);
      if (!isUnmounted.current) {
        setFetchLoading(false);
        setGenError('500');
      }
    }
  }


  useEffect(() => {
    handleCompaniesRequest();
    return () => { isUnmounted.current = true };
  }, []);


  // Rendering function.
  return (
    <div id='create-announce-component-root'>

      {/* INFORMATION SECTION */}
      <div className='cacr-boxes'>
        <div className='cacrb-head'>
          <h2 className='cacrbh-number'>01</h2>
          <h3 className='cacrbh-title'>{t('information')}</h3>

          <button id='cacr-cancel-btn' type='button' onClick={() => changeView('list')}>
            <img id='cacr-cancel-icon' src={CrossIcon} alt="cancel-icon" />
          </button>
        </div>

        <div className='cacrb-body'>
          <div className='cacr-normal'>
            <Input
              placeholder={t('phJobtitle')}
              label={t('jobTitle')}
              type='text'
              changeFn={(n: string) => setTitle({ ...title, value: n })}
              value={title.value}
              autocomplete='off'
              margin='20px 0px 0px 0px'
              error={title.error !== null}
              disabled={fetchLoading}
              errorValue={title.error}
              errorMessages={{ 'invalidFormat': t('inputTextError') }}
              onBlurFn={() => {}}
            />
          </div>

          <div className='cacr-normal'>
            <Dropdown
              placeholder={t('phLevel')}
              label={t('level')}
              currentValue={level.value}
              list={[ { value: '', label: t('phLevel') }, ...getListValues(t, 'expertiseLevel') ]}
              changeValue={(n: { value: string, label: string }) => setLevel({ ...level, value: n })}
              margin='20px 0px 0px 0px'
              error={level.error !== null}
              disabled={fetchLoading}
              errorValue={level.error}
              errorMessages={{ 'empty': t('inputDropdownError') }}
            />
          </div>

          <div className='cacr-normal'>
            <Dropdown
              placeholder={t('phSelectCompany')}
              label={t('company')}
              currentValue={company.value}
              list={[ { value: '', label: t('phSelectCompany') }, { value: 'anonymous', label: t('anonymousLabel') }, ...recruiterCompanies ]}
              changeValue={(n: { value: string, label: string }) => setCompany({ ...company, value: n })}
              margin='20px 0px 0px 0px'
              error={company.error !== null}
              disabled={fetchLoading || fetchCompaniesLoading}
              errorValue={company.error}
              errorMessages={{ 'empty': t('inputDropdownError') }}
            />
          </div>

          <div className='cacr-normal'>
            <Input
              placeholder={t('phCountry')}
              label={t('country')}
              type='text'
              changeFn={(n: string) => setCountry({ ...country, value: n })}
              value={country.value}
              autocomplete='off'
              margin='20px 0px 0px 0px'
              error={country.error !== null}
              disabled={fetchLoading}
              errorValue={country.error}
              errorMessages={{ 'invalidFormat': t('inputTextError') }}
              onBlurFn={() => {}}
            />
          </div>

          <div className='cacr-normal'>
            <Input
              placeholder={t('phCity')}
              label={t('city')}
              type='text'
              changeFn={(n: string) => setCity({ ...city, value: n })}
              value={city.value}
              autocomplete='off'
              margin='20px 0px 0px 0px'
              error={city.error !== null}
              disabled={fetchLoading}
              errorValue={city.error}
              errorMessages={{ 'invalidFormat': t('inputTextError') }}
              onBlurFn={() => {}}
            />
          </div>

          <div className='cacr-normal'>
            <Input
              placeholder={t('phStreet')}
              label={t('street')}
              type='text'
              changeFn={(n: string) => setStreet({ ...street, value: n })}
              value={street.value}
              autocomplete='off'
              margin='20px 0px 0px 0px'
              error={street.error !== null}
              disabled={fetchLoading}
              errorValue={street.error}
              errorMessages={{ 'invalidFormat': t('inputTextError') }}
              onBlurFn={() => {}}
            />
          </div>

          <div className='cacr-big'>
            <div style={{ width: 'max-content', marginBottom: '20px' }}>
              <CheckBox label={t('remote')} check={(b: boolean) => setRemote(!b)} isChecked={remote} defaultChecked={false} />
            </div>
          </div>

          <div className='cacr-mid'>
            <TextArea
              placeholder={t('phPostDescription')}
              label={t('postDescription')}
              changeFn={(n: string) => setPostDescription({ ...postDescription, value: n })}
              value={postDescription.value}
              margin='20px 0px 0px 0px'
              error={postDescription.error !== null}
              loading={fetchLoading}
              errorValue={postDescription.error}
              errorMessages={{ 'invalidFormat': t('inputTextError') }}
              onBlurFn={() => {}}
            />
          </div>

          <div className='cacr-mid'>
            <TextArea
              placeholder={t('phPostResponsabilities')}
              label={t('postResponsabilities')}
              changeFn={(n: string) => setPostResponsibilities({ ...postResponsibilities, value: n })}
              value={postResponsibilities.value}
              margin='20px 0px 0px 0px'
              error={postResponsibilities.error !== null}
              loading={fetchLoading}
              errorValue={postResponsibilities.error}
              errorMessages={{ 'invalidFormat': t('inputTextError') }}
              onBlurFn={() => {}}
            />
          </div>

          <div className='cacr-mid'>
            <TextArea
              placeholder={t('phProfilDescription')}
              label={t('profilDescription')}
              changeFn={(n: string) => setProfilDescription({ ...profilDescription, value: n })}
              value={profilDescription.value}
              margin='20px 0px 0px 0px'
              error={profilDescription.error !== null}
              loading={fetchLoading}
              errorValue={profilDescription.error}
              errorMessages={{ 'invalidFormat': t('inputTextError') }}
              onBlurFn={() => {}}
            />
          </div>
        </div>

      </div>



     {/* CONTRACT SECTION */}
      <div className='cacr-boxes'>
        <div className='cacrb-head'>
          <h2 className='cacrbh-number'>02</h2>
          <h3 className='cacrbh-title'>{t('contract')}</h3>
        </div>

        <div className='cacrb-body'>
          <div className='cacr-midlong'>
            <Dropdown
              placeholder={t('phContractType')}
              label={t('contractType')}
              currentValue={contractType.value}
              list={[ { value: '', label: t('phContractType') }, ...getListValues(t, 'contractType') ]}
              changeValue={(n: { value: string, label: string }) => setContractType({ ...contractType, value: n })}
              margin='20px 0px 0px 0px'
              error={contractType.error !== null}
              disabled={fetchLoading}
              errorValue={contractType.error}
              errorMessages={{ 'empty': t('inputDropdownError') }}
            />
          </div>

          <div className='cacr-midlong'>
            <InputDate
              label={t('startingDate')}
              value={startingDate.value}
              margin='20px 0px 0px 0px'
              error={startingDate.error}
              disabled={fetchLoading}
              errorValue={startingDate.error}
              errorMessages={{ 'invalidFormat': t('invalidDate') }}
              onBlurFn={(e: any, dateValue: string) => setStartingDate({ ...startingDate, value: dateValue })}
              minYear={new Date().getFullYear()}
            />
          </div>

          <div className='cacr-midlong'>
            <Input
              placeholder={t('phMinSalary')}
              label={t('minSalary')}
              type='text'
              changeFn={(n: string) => setMinSalary({ ...minSalary, value: n.match(/^\d{0,}$/) === null ? minSalary.value : n })}
              value={minSalary.value}
              autocomplete='off'
              margin='20px 0px 0px 0px'
              error={minSalary.error !== null}
              disabled={fetchLoading}
              errorValue={minSalary.error}
              errorMessages={{ 'invalidFormat': t('inputTextError') }}
              onBlurFn={() => {}}
            />
          </div>

          <div className='cacr-midlong'>
            <Input
              placeholder={t('phMaxSalary')}
              label={t('maxSalary')}
              type='text'
              changeFn={(n: string) => setMaxSalary({ ...maxSalary, value: n.match(/^\d{0,}$/) === null ? maxSalary.value : n })}
              value={maxSalary.value}
              autocomplete='off'
              margin='20px 0px 0px 0px'
              error={maxSalary.error !== null}
              disabled={fetchLoading}
              errorValue={maxSalary.error}
              errorMessages={{ 'invalidFormat': t('inputTextError') }}
              onBlurFn={() => {}}
            />
          </div>


          <div className='cacr-big'>
            <div style={{ width: 'max-content', marginBottom: '20px' }}>
              <CheckBox label={t('visaSponsoring')} check={(b: boolean) => setVisaSponsoring(!b)} isChecked={visaSponsoring} defaultChecked={false} />
            </div>
          </div>

        </div>
      </div>



      {/* OTHER SECTION */}
      <div className='cacr-boxes'>
        <div className='cacrb-head'>
          <h2 className='cacrbh-number'>03</h2>
          <h3 className='cacrbh-title'>{t('other')}</h3>
        </div>

        <div className='cacrb-body'>
          <div className='cacr-big'>
            <Dropdown
              placeholder={t('phSelectCategory')}
              label={t('category')}
              currentValue={category.value}
              list={[ { value: '', label: t('phSelectCategory') }, ...getListValues(t, 'category') ]}
              changeValue={(n: { value: string, label: string }) => setCategory({ ...category, value: n })}
              margin='20px 0px 0px 0px'
              error={category.error !== null}
              disabled={fetchLoading}
              errorValue={category.error}
              errorMessages={{ 'empty': t('inputDropdownError') }}
            />
          </div>

          <form onSubmit={handleBenefitSubmition} className='cacr-big'>
            <Input
              placeholder={t('phBenefits')}
              label={t('benefits')}
              type='text'
              changeFn={(n: string) => setBenefitValue({ ...benefitValue, value: n })}
              value={benefitValue.value}
              autocomplete='off'
              margin='20px 0px 0px 0px'
              error={benefitValue.error !== null}
              disabled={fetchLoading}
              errorValue={benefitValue.error}
              errorMessages={{ 'empty': t('noBenefitsFound') }}
              onBlurFn={() => {}}
              onFocusBottomMsg={t('clickEnterToAddBenefit')}
            />
          </form>

          <div className='cacr-list'>
            { benefits.map((item, index) => <BenefitItem key={index} id={item} name={item} removeFn={handleBenefitRemoving} />)}
          </div>

        </div>
      </div>



      {/* PAYMENT SECTION */}
      <div className='cacr-boxes'>
        <div className='cacrb-head'>
          <h2 className='cacrbh-number'>04</h2>
          <h3 className='cacrbh-title'>{t('payment')}</h3>
        </div>

        <div className='cacrb-body'>
          <div className='cacr-card-element'>
            <CardNumberInput
              label={t('cardNumber')}
              type='text'
              changeFn={(n: string) => setCardNumber({ ...cardNumber, value: n })}
              value={cardNumber.value}
              autocomplete='cc-number'
              margin='20px 0px 0px 0px'
              error={null}
              disabled={fetchLoading}
              errorValue={cardNumber.error}
              errorMessages={{ 'invalidFormat': t('inputTextError') }}
              onBlurFn={() => {}}
            />
            <Error margin='10px auto' errorValue={cardNumber.error} errorMessages={{ [cardNumber.error]: cardNumber.error }} />
          </div>

          <div className='cacr-coupon'>
            <Input
              placeholder={t('phCoupon')}
              label={t('coupon')}
              type='text'
              changeFn={(n: string) => setCoupon({ ...coupon, value: n })}
              value={coupon.value}
              autocomplete='off'
              margin='20px 0px 0px 0px'
              error={coupon.error !== null}
              disabled={fetchLoading || coupon.validated || fetchCouponLoading}
              errorValue={coupon.error}
              errorMessages={{ 'invalidCoupon': t('invalidCoupon') }}
              onBlurFn={() => {}}
              borderRadius='8px 0px 0px 8px'
            />
            <button className='cacrc-btn' disabled={fetchLoading || coupon.validated || fetchCouponLoading} onClick={handleCouponSubmition} type='button'>{t('use')}</button>
          </div>

          <div className='cacr-total'>
            <div className='cacrt-announce-price'>{announcePrice}€</div>
            <button type='submit' disabled={fetchLoading || fetchCompaniesLoading || fetchCouponLoading} className='cacrt-submit' onClick={handleAnnounceSubmition}>
              <p>{t('validateAndPay')}</p>
              <img className='cacrt-icon' src={ArrowIcon} alt="arrow-icon" />
            </button>
          </div>
        </div>
      </div>



    </div>
  );
};


// @export
export default injectStripe(withTranslation('common')(FormComponent));