// @module import
import { useRouter } from 'next/router';
import { WithTranslation } from 'next-i18next';


// @local import
import './index.css';
import { serverFileURL } from '../../utils/config';
import { withTranslation } from '../i18n';
import { DateConverter } from '../../utils/date';

const DotIcon = require('../../static/assets/dot-icon-grey.svg') as string;


// @interface
interface ComponentProps extends WithTranslation {
  data: {
    picture: string,
    description: string,
    birthdate: string,
    job: string,
    expertiseLevel: string,
    desiredContract: string,
    legalAvailability: string,
    expectedSalary: string,
    updated: string,
    _id: string,
    firstname: string,
    skills: Array<{ name: string, _id: string }>,
    qualifications: Array<{ _id: string, title: string, school: string, startingDate: string, endDate: string, inProgress: boolean }>,
    experiences: Array<{ _id: string, jobTitle: string, company: string, startingDate: string, endDate: string, inProgress: boolean, jobDescription: string }>,
  }
}


// @component
const JobComponent: (props: ComponentProps) => JSX.Element = ({ t, data }) => {

  console.log(data);

  // const router = useRouter();

  return (
    <div id='public-candidate-comp-root'>
      <div id='pccr-left'>
        <img id='pccrl-img' src={serverFileURL + data.picture} alt="profil-picture" />
        <h4 className='pccr-title' style={{ margin: '10px 0px 0px 0px' }}>{data.firstname}</h4>

        { data.job            !== '' ? <p className='pccr-normal-txt' style={{ margin: '10px 0px 0px 0px' }}>{data.job}</p>                : null }
        { data.expertiseLevel !== '' ? <p className='pccr-box-txt' style={{ margin: '50px 0px 0px 0px' }}>{t(data.expertiseLevel)}</p>  : null }


        <div className='pccr-line' style={{ margin: '50px 0px'}}></div>

        <div id='pccrl-skills'>
          <h4 className='pccr-title' style={{ margin: '0px 0px 20px 0px' }}>{t('skills')}</h4>
          <div id='pccrls-box'>
            {data.skills.length === 0 ? '-' : null}
            {data.skills.map(item => <div className='pccr-box-txt' style={{ margin: '3px 3px 3px 0px' }} key={item._id}>{item.name}</div>)}
          </div>
        </div>
      </div>

      <div id='pccr-right'>
        <div id='pccrr-desc'>
          <h4 className='pccr-title'>{t('description')}</h4>
          <p className='pccr-normal-txt' style={{ marginTop: '20px' }}>{data.description}</p>
        </div>

        <div id='pccrr-exp'>
          <h4 className='pccr-title'>{t('experiences')}</h4>
          { data.experiences.length === 0 ? <p className='pccrre-item --pccrre-last-item'>{ t('noexperiences')}</p> : null }
          {
            [ ...data.experiences].reverse().map((item, index) => (
              <div key={item._id} className={`pccrre-item ${index === data.experiences.length - 1 ? ` --pccrre-last-item` : ``}`}>
                <div className='pccrrei-titlebox'>
                  <p className='pccrrei-jobtitle'>{item.jobTitle}</p>
                  <img style={{ margin: '0px 5px' }} src={DotIcon} alt="dot-icon" />
                  <p className='pccrrei-company'>{item.company}</p>
                </div>

                <p className='pccrrei-date'>{`${DateConverter(item.startingDate)} - ${item.inProgress || item.endDate === '' ? t('current') : DateConverter(item.endDate)}`}</p>
                <p className='pccrrei-desc'>{item.jobDescription}</p>
              </div>
            ))
          }
        </div>

        <div id='pccrr-qualif'>
          <h4 className='pccr-title'>{t('qualifications')}</h4>
          {
            [ ...data.qualifications].reverse().map((item, index) => (
              <div key={item._id} className={`pccrrq-item ${index === data.qualifications.length - 1 ? ` --pccrre-last-item` : ``}`}>
                <div className='pccrrei-titlebox'>
                  <p className='pccrrei-jobtitle'>{item.title}</p>
                  <img style={{ margin: '0px 5px' }} src={DotIcon} alt="dot-icon" />
                  <p className='pccrrei-company'>{item.school}</p>
                </div>

                <p className='pccrrei-date'>{`${DateConverter(item.startingDate)} - ${item.inProgress || item.endDate === '' ? t('current') : DateConverter(item.endDate)}`}</p>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
};


// @export
export default withTranslation('common')(JobComponent);