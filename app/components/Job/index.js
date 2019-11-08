// @module import
import { useRouter } from 'next/router';


// @local import
import './index.css';
import { withTranslation } from '../i18n';
import LocationIconGrey from '../../static/assets/localization_icon_g.svg';
import ContractTypeIconGrey from '../../static/assets/contract_icon_g.svg';
import FeatherIcon from '../../static/assets/feather_icon.svg';
import TotemIconGrey from '../../static/assets/totem_icon_g.svg';
import TribeIconGrey from '../../static/assets/tribe_icon_g.svg';


// @component
const JobComponent = ({ t, data }) => {

  const router = useRouter();

  const contracts = [
    { value: 'internship', label: t('dsrCt.internship') },
    { value: 'cdd', label: t('dsrCt.cdd') },
    { value: 'cdi', label: t('dsrCt.cdi') },
    { value: 'contractor', label: t('dsrCt.contractor') }
  ]
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
          { data.company === null ? <div className='job-head-logo'></div> : <img className='job-head-logo' src={`http://localhost:3001${data.companyInfo[0].logo}`} /> }
          <div className='job-head-tbox'>
            <div>
              <h3 className='job-head-tbox-title' style={{ opacity: 0.5, fontSize: '1em' }}>{ data.company === null ? t('anonymous') : data.companyInfo[0].name }</h3>
              <h2 className='job-head-tbox-title' style={{ opacity: 1, fontSize: '1.5em' }}>{ data.title }</h2>
            </div>
            <div className='job-head-tbox-info'>
              <div className='job-head-tbox-info-box'>
                <img src={LocationIconGrey} alt='location-icon' className='job-head-tbox-info-box-icon' />
                <p className='job-head-tbox-info-box-txt'>{ data.location }</p>
              </div>

              <div className='job-head-tbox-info-box'>
                <div className='euro-icon'>€</div>
                <p className='job-head-tbox-info-box-txt'>{ data.salary.min }k - { data.salary.max }k</p>
              </div>

              <div className='job-head-tbox-info-box'>
                <img src={ContractTypeIconGrey} width={35} height={35} alt='contract-type-icon' className='job-head-tbox-info-box-icon' />
                <p className='job-head-tbox-info-box-txt'>{ contracts.filter(item => data.contractType === item.value)[0].label }</p>
              </div>
            </div>
          </div>
        </div>

        <div className='job-head-bb'>
          <button className='job-head-bb-button'>{ t('apply') }</button>
        </div>
      </div>

      <div className='job-body'>
        <div className='job-body-left'>
          <h3 className='job-body-label-txt'>{ t('postDescription') }</h3>
          <hr className='job-body-label-hr'/>
          <p className='job-body-left-txt'>{ data.description }</p>
        </div>

        <div className='job-body-right'>
          <div className='job-body-right-box'>
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
          </div>

          {
            data.company !== null ?
            <div className='job-body-right-box'>
              <h3 className='job-body-label-txt'>{ t('theCompany') }</h3>
              <hr className='job-body-label-hr' style={{ marginBottom: '20px' }} />
              <div className='job-body-company-infobox'>
                <img src={TotemIconGrey} alt='triboo-icon' className='job-body-company-infobox-icon' />
                <p className='job-body-company-infobox-txt' style={{ marginLeft: '15px'}} >{ triboo.filter(item => data.companyInfo[0].activityArea[0] === item.value)[0].label }</p>
              </div>

              <div className='job-body-company-infobox'>
                <img src={LocationIconGrey} alt='location-icon' style={{ marginLeft: '2px'}} className='job-body-company-infobox-icon' />
                <p className='job-body-company-infobox-txt' style={{ marginLeft: '16px'}} >{ data.companyInfo[0].country }, { data.companyInfo[0].address }</p>
              </div>

              <div className='job-body-company-infobox'>
                <img src={TribeIconGrey} alt='employeesNumber-icon' style={{ marginLeft: '2px'}} className='job-body-company-infobox-icon' />
                <p className='job-body-company-infobox-txt' style={{ marginLeft: '17px'}} >{ employeesNumber.filter(item => data.companyInfo[0].employeesNumber === item.value)[0].label }</p>
              </div>

              <button className='company-btn' onClick={() => router.push(`/companies/${data.companyInfo[0].name}`)}>{ t('knowMore') }</button>
            </div> :
            null
          }

        </div>
      </div>
    </div>
  );
};


// @export
export default withTranslation('common')(JobComponent);