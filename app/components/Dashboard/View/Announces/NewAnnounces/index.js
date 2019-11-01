// @module import
import { useState } from 'react';
import { useCookies } from 'react-cookie';


// @local import
import './index.css';
import { Input, TextArea, Select, ListInput } from '../../../../Form';
import { withTranslation } from '../../../../i18n';
import CheckBox from '../../../../CheckBox';
import Card from '../../../../Card';
import CompaniesList from '../../../../CompaniesList';


// @component
const NewAnnounces = ({ t, companies }) => {
  const [title, setTitle] = useState('');
  const [localisation, setLocalisation] = useState('');
  const [level, setLevel] = useState('junior');
  const [startingDate, setStartingDate] = useState('');
  const [description, setDescription] = useState('');
  const [contractType, setContractType] = useState('cdi');
  const [salary, setSalary] = useState({ min: 15, max: 100 });
  const [benefits, setBenefits] = useState([]);
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sponsoring, setSponsoring] = useState(false);
  const [cookies, _, __] = useCookies();
  const [inputError, setInputError] = useState({
    title: false,
    localisation: false,
    level: false,
    startingDate: false,
    description: false,
    contractType: false,
    salary: {
      min: false,
      max: false
    },
    benefits: false,
    paiement: false
  });

  return (
    <div className='new-announces-root'>
      <CompaniesList token={cookies.token} updateData={ndata => setCompany(ndata)} rootStyle={{ minWidth: '200px', top: 20, right: 25 }} />
      <h2 className='new-announces-label'>{t('information')}</h2>
      <div className='new-announces-box'>
        <Input
          width={350}
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
        <Input
          width={350}
          margin='10px 0px'
          error={inputError.localisation}
          label={t('localisation')}
          placeholder={t('phLocalisation')}
          value={localisation}
          setValue={setLocalisation}
          formatErrorMsg={t('emptyOrTooLongError')}
          type='text'
          loading={loading}
        />
        <Select
          label={t('level')}
          optionList={[
            { value: 'student', label: t('lvl.student') },
            { value: 'junior', label: t('lvl.junior') },
            { value: 'mid', label: t('lvl.mid') },
            { value: 'senior', label: t('lvl.senior') }
          ]}
          width={350}
          margin='10px 0px'
          value={level}
          setValue={setLevel}
          loading={loading}
        />
        <Input
          width={350}
          margin='10px 0px'
          error={inputError.startingDate}
          label={t('startingDate')}
          placeholder={t('phStartingDate')}
          value={startingDate}
          setValue={setStartingDate}
          formatErrorMsg={t('emptyOrTooLongError')}
          type='text'
          loading={loading}
        />

        <TextArea
          width={750}
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

      <h2 className='new-announces-label'>{t('contract')}</h2>
      <div className='new-announces-box'>
        <Select
          label={t('type')}
          optionList={[
            { value: 'internship', label: t('dsrCt.internship') },
            { value: 'cdd', label: t('dsrCt.cdd') },
            { value: 'cdi', label: t('dsrCt.cdi') },
            { value: 'contractor', label: t('dsrCt.contractor') }
          ]}
          width={350}
          margin='10px 0px'
          value={contractType}
          setValue={setContractType}
          loading={loading}
        />
        <div style={{ display: 'flex'}}>
          <Input
            width={175}
            margin='10px 10px 0px 0px'
            error={inputError.salary.minimum}
            label={t('salary')}
            placeholder={t('minimum')}
            value={salary.minimum}
            setValue={nd => setSalary({ ...salary, min: nd })}
            formatErrorMsg={t('')}
            type='number'
            loading={loading}
          />
          <Input
            width={175}
            margin='10px 0px'
            error={inputError.salary.maximum}
            label={t('salary')}
            placeholder={t('maximum')}
            value={salary.maximum}
            setValue={nd => setSalary({ ...salary, max: nd })}
            formatErrorMsg={t('')}
            type='number'
            loading={loading}
          />
        </div>
        <CheckBox margin='0px 0px 0px 0px' label={t('visaSponsoring')} size={{ width: '20px', height: '20px' }} checked={sponsoring} setCheckState={setSponsoring} />
      </div>

      <h2 className='new-announces-label'>{t('divers')}</h2>
      <div className='new-announces-box'>
        <ListInput
          label={t('benefits')}
          placeholder={t('phBenefits')}
          objectList={benefits}
          addObjectList={ndata => setBenefits([...benefits, ndata])}
          removeObjectList={item => {
            let nObjList = benefits.filter(el => el !== item);
            setBenefits(nObjList);
          }}
          width='500px'
        />
      </div>

      <h2 className='new-announces-label'>{t('payement')}</h2>
      <Card setCard={setCard} selectedCard={card} />

      <div className='new-announces-btn-box'>
        <div className='new-announces-btn-box-price'>500€</div>
        <div className='new-announces-btn-box-b'>
          <button className='new-announces-btn-box-btn -validate'>{t('validate')}</button>
          <button className='new-announces-btn-box-btn -cancel'>{t('cancel')}</button>
        </div>
      </div>
    </div>
  );
};


// @export
export default withTranslation('common')(NewAnnounces);