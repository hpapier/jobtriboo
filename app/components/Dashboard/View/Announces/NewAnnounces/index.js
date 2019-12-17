// @module import
import { useState, forwardRef, useRef, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import Datepicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { injectStripe } from 'react-stripe-elements'


// @local import
import './index.css';
import { Input, TextArea, Select, ListInput } from '../../../../Form';
import { withTranslation } from '../../../../i18n';
import CheckBox from '../../../../CheckBox';
// import Card from '../../../../Card';
import CardSection from './CardSection';
import CompaniesList from '../../../../CompaniesList';
import TribooSelect from '../../../../TribooSelect';
import { postAnnounce, getPaymentIntent } from '../../../../../utils/request/announces';
import { handleInputText } from '../../../../../utils/input';
import Loading from '../../../../Loading';
// import AutocompleteInput from '../../../../Maps/AutocompleteInput';

// @component
const NewAnnounces = ({ t, changeView, addAnnounce, stripe }) => {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [level, setLevel] = useState('junior');
  const [description, setDescription] = useState('');
  const [contractType, setContractType] = useState('cdi');
  const [salary, setSalary] = useState({ min: 15, max: 100 });
  const [benefits, setBenefits] = useState([]);
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sponsoring, setSponsoring] = useState(false);
  const [startingDate, setStartingDate] = useState(new Date());
  const [cookies, _, __] = useCookies();
  const isUnmounted = useRef(false);
  const [servError, setServError] = useState(null);
  const [company, setCompany] = useState('anonymous');
  const [triboo, setTriboo] = useState('commercial');
  const [inputError, setInputError] = useState({
    title: false,
    location: false,
    description: false,
    benefits: false,
    paiement: false
  });

  const checkInputs = () => {
    const NEO = {
      title: false,
      location: false,
      description: false,
      benefits: false,
      paiement: false
    }

    !handleInputText(title) ? NEO.title = true : null;
    !handleInputText(location, 100) ? NEO.location = true : null;
    !handleInputText(description, 1000000) ? NEO.description = true : null;
    benefits.length === 0 ? NEO.benefits = true : null;

    if (
      NEO.title ||
      NEO.location ||
      NEO.description ||
      NEO.benefits
    ) {
      if (!isUnmounted.current)
        setInputError(NEO);

      return false;
    }

    return true;
  }

  const handleValidation = async () => {

    // Check each input
    if (!checkInputs())
      return;

    if (!isUnmounted.current)
      setLoading(true);

    try {

      // Proceed to payment
      try {
        const res = await getPaymentIntent(cookies.token);
        if (res.status === 200) {
          const { clientSecret } = await res.json();
          const resObject = await stripe.handleCardPayment(clientSecret.client_secret);
          console.log(resObject);
          if (resObject.paymentIntent !== undefined) {
            // If the payment succeed, push the announce to the server
            const data = { triboo, company, title, location, level, description, contractType, salary, benefits, sponsoring, startingDate };
            const res = await postAnnounce(data, cookies.token);
            if (res.status === 200) {
              const rdata = await res.json();
              addAnnounce(rdata);
              changeView();
            }
            else
              throw res.status;
          }
          else {
            if (!isUnmounted.current) {
              setLoading(false);
              setInputError({ ...inputError, paiement: true });
            }
          }
        }
        else
          throw res.status;
      } catch (e) {
        console.log(e);
        return;
      }

    } catch (e) {
      console.log(e);
      if (!isUnmounted.current) {
        setLoading(false);
        setInputError({ title: false, location: false, description: false, benefits: false, paiement: false });
        setServError(500);
      }
    }
  }

  const CustomInputDate = forwardRef(({ onClick, onChange, ...props }, ref) => {
    return (
      <div onClick={onClick} ref={ref}>
        <Input
            width='100%'
            margin='0px'
            error={false}
            label={t('startingDate')}
            placeholder={t('phStartingDate')}
            setValue={onChange}
            formatErrorMsg={null}
            type='text'
            loading={loading}
            {...props}
          />
      </div>
    );
  });


  useEffect(() => () => { isUnmounted.current = true }, []);

  return (
    <div className='new-announces-root'>
      <CompaniesList token={cookies.token} updateData={ndata => setCompany(ndata)} rootStyle={{ minWidth: '200px', top: 20, right: 25 }} />
      <h2 className='new-announces-label'>{t('information')}</h2>
      <div className='new-announces-box'>
        <div className='new-announces-box-item'>
          <Input
            width='calc(100% - 40px)'
            margin='10px 0px'
            error={inputError.title}
            label={t('title')}
            placeholder={t('phTitle')}
            value={title}
            setValue={setTitle}
            formatErrorMsg={t('emptyOrTooLongError')}
            type='text'
            loading={loading}
          />
        </div>

        <div className='new-announces-box-item'>
          <Input
            width='calc(100% - 40px)'
            margin='10px 0px'
            error={inputError.location}
            label={t('location')}
            placeholder={t('phLocation')}
            value={location}
            setValue={setLocation}
            formatErrorMsg={t('emptyOrTooLongError')}
            type='text'
            loading={loading}
          />
        </div>

        <div className='new-announces-box-item'>
          <Select
            label={t('level')}
            optionList={[
              { value: 'student', label: t('lvl.student') },
              { value: 'junior', label: t('lvl.junior') },
              { value: 'mid', label: t('lvl.mid') },
              { value: 'senior', label: t('lvl.senior') }
            ]}
            width='calc(100% - 40px)'
            margin='10px 0px'
            value={level}
            setValue={setLevel}
            loading={loading}
          />
        </div>

        <div className='new-announces-box-item'>
          <Datepicker
            selected={startingDate}
            onChange={date => setStartingDate(date)}
            dateFormat='dd/MM/yyyy'
            minDate={new Date()}
            disabled={loading}
            customInput={<CustomInputDate />}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', width: '100%'}}>
          <TextArea
            width='calc(100% - 40px)'
            margin='30px 0px 0px 0px'
            label={t('description')}
            value={description}
            setValue={setDescription}
            placeholder={t('phDescription')}
            loading={loading}
            error={inputError.description}
            errMsg={t('emptyOrTooLongError')}
          />
        </div>
      </div>

      <h2 className='new-announces-label'>{t('contract')}</h2>
      <div className='new-announces-box'>

        <div className='new-announces-box-item'>
          <Select
            label={t('type')}
            optionList={[
              { value: 'internship', label: t('dsrCt.internship') },
              { value: 'cdd', label: t('dsrCt.cdd') },
              { value: 'cdi', label: t('dsrCt.cdi') },
              { value: 'contractor', label: t('dsrCt.contractor') }
            ]}
            width='calc(100% - 40px)'
            margin='10px 0px'
            value={contractType}
            setValue={setContractType}
            loading={loading}
          />
        </div>


        <div className='new-announces-box-item'>
          <div className='new-announces-box-item'>
            <Input
              width='calc(100% - 30px)'
              margin='10px 0px 0px 10px'
              error={false}
              label={t('salary')}
              placeholder={t('minimum')}
              value={salary.min}
              setValue={nd => setSalary({ ...salary, min: nd })}
              formatErrorMsg={t('')}
              type='number'
              loading={loading}
            />
          </div>

          <div className='new-announces-box-item'>
            <Input
              width='calc(100% - 30px)'
              margin='10px 10px 0px 0px'
              error={false}
              label={t('salary')}
              placeholder={t('maximum')}
              value={salary.max}
              setValue={nd => setSalary({ ...salary, max: nd })}
              formatErrorMsg={t('')}
              type='number'
              loading={loading}
            />
          </div>
        </div>

        <CheckBox disabled={loading} margin='0px 0px 0px 20px' label={t('visaSponsoring')} size={{ width: '20px', height: '20px' }} checked={sponsoring} setCheckState={setSponsoring} />
      </div>

      <h2 className='new-announces-label'>{t('triboo')}</h2>
      <div className='new-announces-triboo-box'>
        <TribooSelect size='small' updateTriboo={setTriboo} selectedTriboo={triboo} />
      </div>

      <h2 className='new-announces-label'>{t('divers')}</h2>
      <div className='new-announces-box' style={{ justifyContent: 'center' }}>
        <ListInput
          label={t('benefits')}
          placeholder={t('phBenefits')}
          objectList={benefits}
          addObjectList={ndata => setBenefits([...benefits, ndata])}
          removeObjectList={item => {
            let nObjList = benefits.filter(el => el !== item);
            setBenefits(nObjList);
          }}
          error={inputError.benefits}
          width='calc(100% - 40px)'
          loading={loading}
          instructionNeeded
        />
      </div>

      <h2 className='new-announces-label'>{t('payement')}</h2>
      <div className='new-announces-box-item-cardsection'>
      {/* <div className='new-announces-box-item'> */}
        {/* <Card width='calc(100% - 40px)' setCard={setCard} selectedCard={card} error={inputError.paiement} /> */}
        <CardSection />
        { inputError.paiement ? <div className='new-box-error-msg'>{t('notValidCard')}</div> : null}
      </div>


      <div className='new-announces-btn-box'>
        <div className='new-announces-box-item'>
          <div className='new-announces-btn-box-price'>500€</div>
        </div>

        <div className='new-announces-box-item'>
          <div className='new-announces-btn-box-b'>
            <button type='submit' disabled={loading} className='new-announces-btn-box-btn -validate' onClick={handleValidation}>{loading ? <Loading size='small' color='white' margin='0px auto' /> : t('validate')}</button>
            <button type='button' disabled={loading} className='new-announces-btn-box-btn -cancel' onClick={changeView}>{t('cancel')}</button>
          </div>
        </div>
      </div>

      {/* <AutocompleteInput /> */}

      { servError === 500 ? <div className='new-box-error-msg'>{t('error500')}</div> : null }
    </div>
  );
};


// @export
export default injectStripe(withTranslation('common')(NewAnnounces));