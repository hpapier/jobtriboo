// @module import
import { WithTranslation } from 'next-i18next';


// @local import
import './index.css';
import { withTranslation } from '../../../../../i18n';


// @interface
interface ComponentProps extends WithTranslation {
  id: string,
  title: string,
  startingDate: string,
  endDate: string,
  inProgress: boolean,
  company: string,
  description: string,
  removeFn: (id: string) => {},
  loading: string
}

const CrossIcon = require('../../../../../../static/assets/cross-icon-red.svg') as string;


// @component
const ExperiencesItem: (props: ComponentProps) => JSX.Element = ({ t, id, title, startingDate, endDate, inProgress, company, description, removeFn, loading }) => {

  const consvertToFormatedStringDate: (date: string) => string = (date) => {
    const ndate = new Date(date);
    return `${ndate.getDate() < 10 ? `0${ndate.getDate()}` : ndate.getDate()}/${(ndate.getMonth() + 1 < 10 ? `0${ndate.getMonth() + 1}` : ndate.getMonth() + 1)}/${ndate.getFullYear()}`;
  }

  return (
    <div className='comp-experiences-item-root'>
      {/* <div className='cqir-info'> */}
        <p className='ceiri-txt --ceiri-title'>{title}</p>
        <p className='ceiri-txt --ceiri-date'>{`${consvertToFormatedStringDate(startingDate)} - ${inProgress ? t('current') : consvertToFormatedStringDate(endDate)}`}</p>
        <p className='ceiri-txt --ceiri-company'>{company}</p>
      {/* </div> */}
      <button className='ceir-remove' onClick={() => removeFn(id)} disabled={loading === id}>
        <img className='ceirr-icon' src={CrossIcon} alt="cross-icon" />
      </button>
      <p className='ceiri-txt --ceiri-desc'>{description}</p>
    </div>
  );
};


// @export
export default withTranslation('common')(ExperiencesItem);