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
  school: string,
  removeFn: (id: string) => {},
  loading: string
}

const CrossIcon = require('../../../../../../static/assets/cross-icon-red.svg') as string;


// @component
const QualificationItem: (props: ComponentProps) => JSX.Element = ({ t, id, title, startingDate, endDate, inProgress, school, removeFn, loading }) => {

  const consvertToFormatedStringDate: (date: string) => string = (date) => {
    const ndate = new Date(date);
    return `${ndate.getDate() < 10 ? `0${ndate.getDate()}` : ndate.getDate()}/${(ndate.getMonth() + 1 < 10 ? `0${ndate.getMonth() + 1}` : ndate.getMonth() + 1)}/${ndate.getFullYear()}`;
  }

  return (
    <div className='comp-qualification-item-root'>
      {/* <div className='cqir-info'> */}
      <p className='cqiri-txt --cqiri-title'>{title}</p>
      <p className='cqiri-txt --cqiri-date'>{`${consvertToFormatedStringDate(startingDate)} - ${inProgress ? t('current') : consvertToFormatedStringDate(endDate)}`}</p>
      <p className='cqiri-txt --cqiri-school'>{school}</p>
      {/* </div> */}
      <button className='cqir-remove' onClick={() => removeFn(id)} disabled={loading === id}>
        <img className='cqirr-icon' src={CrossIcon} alt="cross-icon" />
      </button>
    </div>
  );
};


// @export
export default withTranslation('common')(QualificationItem);