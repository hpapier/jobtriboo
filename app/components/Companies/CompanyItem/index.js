// @module import


// @local import
import { withTranslation } from '../../i18n';
import TotemIconGrey from '../../../static/assets/totem_icon_g.svg';
import LocationIconGrey from '../../../static/assets/localization_icon_g.svg';
import TribeIconGrey from '../../../static/assets/tribe_icon_g.svg';
import './index.css';


// @component
const CompanyItem = ({ t, data }) => {
  const triboo = [
    { label: t('commercial'), value: 'commercial' },
    { label: t('tech'), value: 'tech' },
    { label: t('engineering'), value: 'engineering' },
    { label: t('retail'), value: 'retail' },
  ];
  const employeesNumber = [
    { label: t('companyEmployeesNumberTiny'), value: 'tiny' },
    { label: t('companyEmployeesNumberSmall'), value: 'small' },
    { label: t('companyEmployeesNumberMid'), value: 'mid' },
    { label: t('companyEmployeesNumberBig'), value: 'big' },
    { label: t('companyEmployeesNumberHuge'), value: 'huge' }
  ];

  return (
    <div className='company-item-root'>
      <div className='company-item-root-cover-fill'></div>
      { data.cover !== null ? <img src={`http://localhost:3001${data.cover}`} className='company-item-root-cover' /> : <div className='company-item-root-cover'></div>}
      { data.logo !== null ? <img src={`http://localhost:3001${data.logo}`} className='company-item-root-logo' /> : <div className='company-item-root-logo'></div> }

      <div className='company-item-root-ibox'>
        <h3 className='company-item-root-ibox-name'>{data.name}</h3>
        <div className='company-item-root-ibox-info'>
          <div className='company-item-root-ibox-info-b'>
            <img src={TotemIconGrey} alt='totem-icon' className='company-item-root-ibox-info-b-icon' />
            <p className='company-item-root-ibox-info-b-txt'>{triboo.filter(item => data.activityArea[0] === item.value)[0].label}</p>
          </div>
          <div className='company-item-root-ibox-info-b'>
            <img src={LocationIconGrey} alt='totem-icon' className='company-item-root-ibox-info-b-icon' style={{ marginLeft: '2px' }} />
            <p className='company-item-root-ibox-info-b-txt' style={{ marginLeft: '14px' }}>{data.country}</p>
          </div>
          <div className='company-item-root-ibox-info-b'>
            <img src={TribeIconGrey} alt='totem-icon' className='company-item-root-ibox-info-b-icon' style={{ marginLeft: '2px' }}/>
            <p className='company-item-root-ibox-info-b-txt' style={{ marginLeft: '14px' }}>{employeesNumber.filter(item => data.employeesNumber === item.value)[0].label}</p>
          </div>
        </div>

        <div className='company-item-root-ibox-footer' >
          <p className='company-item-root-ibox-footer-jobs'>{data.announcesNumber} {t('jobs')}</p>
          <button className='company-item-root-ibox-footer-btn'>{t('discover')}</button>
        </div>
      </div>
    </div>
  );
}


// @export
export default withTranslation('common')(CompanyItem);