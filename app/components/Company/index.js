// @module import
import { useRouter } from 'next/router';


// @local import
import './index.css';
import { withTranslation } from '../i18n';
import LocationIconGrey from '../../static/assets/localization_icon_g.svg';
import TotemIconGrey from '../../static/assets/totem_icon_g.svg';
import TribeIconGrey from '../../static/assets/tribe_icon_g.svg';
import AnnounceItem from '../Dashboard/View/Announces/AnnounceItem'


// @component
const JobComponent = ({ t, data }) => {
  const router = useRouter();

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
    <div className='job-root'>
      <div className='job-head'>
        <div className='job-head-ib'>
          <img className='job-head-logo' src={`http://localhost:3001${data.logo}`} />
          <div className='job-head-tbox'>
            <div>
              <h3 className='job-head-tbox-title' style={{ opacity: 1, fontSize: '2em' }}>{ data.name }</h3>
              {/* <a href={data.link} target='_blank' className='job-head-tbox-title' style={{ opacity: 1, fontSize: '1.2em', fontWeight: '400' }}>{ data.link }</a> */}
              <h3 target='_blank' className='job-head-tbox-title' style={{ opacity: 1, fontSize: '1.2em', fontWeight: '400' }}>{ data.link }</h3>
            </div>
            <div className='job-head-tbox-info'>
              <h2 className='job-head-tbox-title' style={{ opacity: 1, fontSize: '1.2em', color: '#6B5AED' }}>{ data.announces.length } {t('jobs')}</h2>
            </div>
          </div>
        </div>

        {/* <div className='job-head-bb'>
          <button className='job-head-bb-button'>{ t('apply') }</button>
        </div> */}
      </div>

      <div className='job-body'>
        <div className='job-body-l'>
          <div className='company-body-left'>
            <h3 className='job-body-label-txt'>{ t('about') }</h3>
            <hr className='job-body-label-hr'/>
            <p className='job-body-left-txt'>{ data.description }</p>
          </div>

          <div className='company-body-left' style={{ padding: '0px', marginBottom: '10px' }}>
            <h3 className='job-body-label-txt'>{ t('offerAvailable') } ({ data.announces.length })</h3>
          </div>

          <div>
            {data.announces.map((item, index) =>
              <div className='company-job-item'  key={index} onClick={() => router.push(`/jobs/${item.publicId}`)}>
                <AnnounceItem updateData={null} data={{ ...item, companyInfo: [data]}} isPublic />
              </div>
            )}
          </div>
        </div>

        <div className='job-body-right'>
          {/* <div className='job-body-right-box'>
            <h3 className='job-body-label-txt'>{ t('benefits') }</h3>
            <hr className='job-body-label-hr'/>
            <div className='job-body-right-benefit'>
              {
                data.benefits.map((item, index) =>
                  <div key={index} className='job-body-left-benefit-item'>
                    <img src={FeatherIcon} alt='benefit-icon' className='job-body-left-benefit-item-icon' />
                    <p className='job-body-left-benefit-item-label'>{item}</p>
                  </div>
                )
              }
            </div>
          </div> */}

          <div className='job-body-right-box'>
            <h3 className='job-body-label-txt'>{ t('theCompany') }</h3>
            <hr className='job-body-label-hr' style={{ marginBottom: '20px' }} />
            <div className='job-body-company-infobox'>
              <img src={TotemIconGrey} alt='triboo-icon' className='job-body-company-infobox-icon' />
              <p className='job-body-company-infobox-txt' style={{ marginLeft: '15px'}} >{ triboo.filter(item => data.activityArea[0] === item.value)[0].label  }</p>
            </div>

            <div className='job-body-company-infobox'>
              <img src={LocationIconGrey} alt='location-icon' style={{ marginLeft: '2px'}} className='job-body-company-infobox-icon' />
              <p className='job-body-company-infobox-txt' style={{ marginLeft: '16px'}} >{ data.country }, { data.address }</p>
            </div>

            <div className='job-body-company-infobox'>
              <img src={TribeIconGrey} alt='employeesNumber-icon' style={{ marginLeft: '2px'}} className='job-body-company-infobox-icon' />
              <p className='job-body-company-infobox-txt' style={{ marginLeft: '17px'}} >{ employeesNumber.filter(item => data.employeesNumber === item.value)[0].label }</p>
            </div>

            {/* <button className='company-btn' onClick={() => router.push(`/company/${data.company.name}`)}>{ t('knowMore') }</button> */}
          </div>
        </div>
      </div>
    </div>
  );
};


// @export
export default withTranslation('common')(JobComponent);