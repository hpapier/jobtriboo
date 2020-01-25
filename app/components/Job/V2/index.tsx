// @module import
import { useState, useRef, useEffect } from 'react';
import { WithTranslation } from 'next-i18next';
import { useCookies } from 'react-cookie';


// @local import
import './index.css';
import { withTranslation } from '../../i18n';
import { serverFileURL } from '../../../utils/config';
import { DateConverter } from '../../../utils/date';
import { useRouter } from 'next/router';
import { salaryFormat } from '../../../utils/format';
import Error from '../../Error';
import Loading from '../../Loading';
import { applyToJob } from '../../../utils/request/candidate';

const LocationIcon = require('../../../static/assets/location-icon-grey.svg') as string;
const MoneyIcon = require('../../../static/assets/money-icon-grey.svg') as string;
const ShapeIcon = require('../../../static/assets/shape-icon-grey.svg') as string;
const DescriptionIcon = require('../../../static/assets/description-icon-blue.svg') as string;
const SendIconBlue = require('../../../static/assets/send-arrow-icon-blue.svg') as string;
const CandidateProfilIcon = require('../../../static/assets/candidate-profil-icon-blue.svg') as string;
const ValidationIcon = require('../../../static/assets/validation-icon-grey.svg') as string;
const UserIcon = require('../../../static/assets/user-icon-grey.svg') as string;
const CategoryIcon = require('../../../static/assets/category-icon-grey.svg') as string;


// @interface
interface LogInfoProps {
  loggedIn: boolean,
  isComplete?: boolean,
  userState: string,
  userId: string
}

interface CompanyProps {
  logo: string,
  name: string,
  phone: string,
  email: string,
  country: string,
  city: string,
  description: string,
  category: string,
  employeesNumber: string,
  link: string,
  NIF: string
}

interface JobProps {
  _id: string,
  title: string,
  level: string,
  company: null,
  companyInfo: CompanyProps | null,
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
  candidates: Array<string>
}

interface ComponentProps extends WithTranslation {
  data: JobProps,
  logInfo: LogInfoProps
}


// @component
const JobComponent: (props: ComponentProps) => JSX.Element = ({ data, t, logInfo }) => {


  // State management.
  const candidateAlreadyApplied: boolean = logInfo && logInfo.userState === 'candidate' && data.candidates.filter(candidateId => candidateId === logInfo.userId).length > 0;
  const [applyState, setApplyState] = useState({ value: !candidateAlreadyApplied, error: null, loading: false });
  const isUnmounted = useRef(false);
  const [cookies, _, __] = useCookies();
  const router = useRouter();


  console.log(logInfo);
  console.log(data);


  // Handle the user application request.
  const handleUserApply: () => void = async () => {
    console.log('applied');
    try {
      const applyResponse: Response = await applyToJob(data._id, cookies.token);
      if (applyResponse.status === 404 || applyResponse.status === 401) {
        if (!isUnmounted.current)
          setApplyState({ ...applyState, error: applyResponse.status === 404 ? 'jobNotFound' : 'unauthorized', loading: false });
      }

      if (!isUnmounted.current)
        setApplyState({ value: false, error: null, loading: false });
    }
    catch (e) {
      console.log(e);
      if (!isUnmounted.current)
        setApplyState({ ...applyState, error: '500', loading: false });
    }
  }


  // Component Didmount/Unmount function.
  useEffect(() => () => { isUnmounted.current = true }, []);


  // Rendering.
  return (
    <div id='component-job-root'>
      <div id='cjr-head'>
        { data.company !== null ? <img className='cjrh-company-logo' style={{ backgroundColor: '#fff' }} src={serverFileURL + data.companyInfo[0].logo} alt='company-logo' /> : <div className='cjrh-company-logo'></div>}
        <div className='cjrh-box'>
          <h1 id='cjrh-jobtitle'>{data.title}</h1>
          <h2 id='cjrh-company-name'>{data.company !== null ? data.companyInfo[0].name : t('anonymousLabel')}</h2>
          <div id='cjrh-principal-info'>
            <div className='cjrhp-info'>
              <img className='cjrhpi-icon' src={LocationIcon} alt="location"/>
              <p className='cjrhpi-txt'>{data.country}</p>
            </div>

            <div className='cjrhp-info'>
              <img className='cjrhpi-icon' src={MoneyIcon} alt="salary"/>
              <p className='cjrhpi-txt'>{`${salaryFormat(data.salary.min)} - ${salaryFormat(data.salary.max)}`}</p>
            </div>

            <div className='cjrhp-info'>
              <img className='cjrhpi-icon' src={ShapeIcon} alt="contract-type"/>
              <p className='cjrhpi-txt'>{t(data.contractType)}</p>
            </div>
          </div>
        </div>

        {
          (logInfo.userState !== 'recruiter' && applyState.value) ?
          <div id='cjrh-apply-box'>
            <button id='cjrh-apply' disabled={!logInfo || !logInfo.isComplete} onClick={handleUserApply}>
              {applyState.loading ? <Loading color='white' size='small' /> : t('apply')}
            </button>
            { (!logInfo || !logInfo.isComplete) && <div id='cjrh-apply-txt'>{!logInfo ? t('createAccountToApply') : t('youMustHaveACompletProfilToApply')}</div> }
            { (!logInfo || !logInfo.isComplete) && <Error margin='10px auto' errorValue={applyState.error} errorMessages={{ 'errorWhenApplying': t('errorOnApply'), '500': t('error500'), 'unauthorized': t('unauthorized'), 'jobNotFound': t('jobNotFound') }} /> }
          </div>:
          null
        }

      </div>

      <div className='cjr-line'></div>

      <div id='cjr-body'>
        <div id='cjrb-left'>

          <div className='cjrbl-info'>
            <div className='cjrbli-title'>
              <img className='cjrbli-title-icon' src={DescriptionIcon} alt="description"/>
              <h3 className='cjrbli-title-txt'>{t('postDescription')}</h3>
            </div>
            <p className='cjrbl-desc'>{data.postDescription}</p>
          </div>

          <div className='cjrbl-info'>
            <div className='cjrbli-title'>
              <img className='cjrbli-title-icon' src={SendIconBlue} alt="responsibilities"/>
              <h3 className='cjrbli-title-txt'>{t('postResponsibilities')}</h3>
            </div>
            <p className='cjrbl-desc'>{data.postResponsibilities}</p>
          </div>

          <div className='cjrbl-info'>
            <div className='cjrbli-title'>
              <img className='cjrbli-title-icon' src={CandidateProfilIcon} alt="description"/>
              <h3 className='cjrbli-title-txt'>{t('candidateProfilDescription')}</h3>
            </div>
            <p className='cjrbl-desc'>{data.profilDescription}</p>
          </div>

        </div>


        <div id='cjrb-right'>
          <div className='cjrbr-box'>
            <h4 className='cjrbrb-title'>{t('summary')}</h4>
            <div className='cjr-line' style={{ marginTop: '15px' }}></div>

            <div className='cjrbrb-body'>
              <h5 className='cjrbrbb-title'>{t('startingDate')}:</h5>
              <p className='cjrbrbb-info'>{DateConverter(data.startingDate)}</p>
            </div>

            <div className='cjrbrb-body'>
              <h5 className='cjrbrbb-title'>{t('salary')}:</h5>
              <p className='cjrbrbb-info'>{`${salaryFormat(data.salary.min)} - ${salaryFormat(data.salary.max)}`}</p>
            </div>

            <div className='cjrbrb-body'>
              <h5 className='cjrbrbb-title'>{t('remote')}:</h5>
              <p className='cjrbrbb-info'>{data.remote ? t('yes') : t('no')}</p>
            </div>

            <div className='cjrbrb-body'>
              <h5 className='cjrbrbb-title'>{t('contractType')}:</h5>
              <p className='cjrbrbb-info'>{t(data.contractType)}</p>
            </div>

            <div className='cjrbrb-body'>
              <h5 className='cjrbrbb-title'>{t('visaSponsoring')}:</h5>
              <p className='cjrbrbb-info'>{data.visaSponsoring ? t('yes') : t('no')}</p>
            </div>

            <div className='cjrbrb-body'>
              <h5 className='cjrbrbb-title'>{t('candidateLevel')}:</h5>
              <p className='cjrbrbb-info'>{t(data.level)}</p>
            </div>

            <div className='cjrbrb-body'>
              <h5 className='cjrbrbb-title'>{t('jobLocation')}:</h5>
              <p className='cjrbrbb-info'>{`${data.country}, ${data.city}, ${data.street}`}</p>
            </div>
          </div>

          <div className='cjrbr-box'>
            <h4 className='cjrbrb-title'>{t('benefits')}</h4>
            <div className='cjr-line' style={{ marginTop: '15px' }}></div>

            {
              data.benefits.map((item, index) => (
                <div key={index} className='cjrbrb-body --cjrbrb-body-benef'>
                  <img className='cjrbrbb-icon' src={ValidationIcon} alt='benefit' />
                  <p className='cjrbrbb-info' style={{ marginLeft: '10px'}}>{item}</p>
                </div>
              ))
            }
          </div>

          {
            data.company !== null ?
            <div className='cjrbr-box'>
              <h4 className='cjrbrb-title'>{t('company')}</h4>
              <div className='cjr-line' style={{ marginTop: '15px' }}></div>

              <div className='cjrbrb-body'>
                <img className='cjrbrbb-icon' style={{ marginRight: '5px' }} width='15' src={CategoryIcon} alt='category' />
                <p className='cjrbrbb-info'>{data.companyInfo[0].category}</p>
              </div>

              <div className='cjrbrb-body'>
                <img className='cjrbrbb-icon' style={{ marginLeft: '2px', marginRight: '5px' }} width='10' src={LocationIcon} alt='location' />
                <p className='cjrbrbb-info'>{data.companyInfo[0].country}, {data.companyInfo.city}</p>
              </div>

              <div className='cjrbrb-body'>
                <img className='cjrbrbb-icon' style={{ marginLeft: '2px', marginRight: '5px' }} width='10' src={UserIcon} alt='employees-number' />
                <p className='cjrbrbb-info'>{t(data.companyInfo[0].employeesNumber)}</p>
              </div>

              <button id='cjrbr-company-btn' type='button' onClick={() => router.push('/companies/' + data.companyInfo[0].name)}>
                {t('findOutMore')}
              </button>
            </div> :
            null
          }

        </div>
      </div>
    </div>
  );
}


// @export
export default withTranslation('common')(JobComponent);