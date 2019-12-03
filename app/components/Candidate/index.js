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
import { serverFileURL } from '../../utils/config';


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
  const studiesLvl = [
    { value: 'selflearner', label: t('stdLvl.selfLearner') },
    { value: 'post-bac', label: t('stdLvl.postBac') },
    { value: 'bac', label: t('stdLvl.bac') },
    { value: 'licence', label: t('stdLvl.licence') },
    { value: 'master', label: t('stdLvl.master') },
    { value: 'phd', label: t('stdLvl.phd') }
  ]

  return (
    <div className='candidate-comp-root'>
      <div className='candidate-comp-head'>
        <div className='candidate-comp-head-ib'>
          { data.picture === "" ? <div className='candidate-comp-head-logo'></div> : <img className='candidate-comp-head-logo' src={`${serverFileURL}${data.picture}`} /> }
          <div className='candidate-comp-head-tbox'>
            <div>
              <h3 className='candidate-comp-head-tbox-title' style={{ opacity: 1, fontWeight: 600, fontSize: '2em' }}>{ data.firstName }</h3>
              <h2 className='candidate-comp-head-tbox-title' style={{ opacity: 1, fontSize: '1em' }}>{ data.jobName === "" ? t('unknow') : data.jobName }</h2>
            </div>
            <div className='candidate-comp-head-tbox-info'>
              <div className='candidate-comp-head-tbox-info-box'>
                {/* <img src={LocationIconGrey} alt='location-icon' className='job-head-tbox-info-box-icon' /> */}
                <p className='candidate-comp-head-tbox-info-box-txt'>{ data.country === '' ? t('unknow') : data.country }</p>
              </div>

              <div className='candidate-comp-head-tbox-info-box'>
                {/* <div className='euro-icon'>€</div> */}
                <p className='candidate-comp-head-tbox-info-box-txt'>{ data.age } {t('years')}</p>
              </div>

              <div className='candidate-comp-head-tbox-info-box'>
                {/* <img src={ContractTypeIconGrey} width={35} height={35} alt='contract-type-icon' className='job-head-tbox-info-box-icon' /> */}
                <p className='candidate-comp-head-tbox-info-box-txt'>{ studiesLvl.filter(item => item.value === data.studyLvl)[0].label }</p>
              </div>
            </div>
          </div>
        </div>

        {/* <div className='job-head-bb'>
          <button className='job-head-bb-button'>{ t('apply') }</button>
        </div> */}
      </div>

      <div className='candidate-comp-body'>
        <div className='candidate-comp-body-left'>
          <h3 className='candidate-comp-body-label-txt'>{ t('postDescription') }</h3>
          <hr className='candidate-comp-body-label-hr'/>
          <p className='candidate-comp-body-left-txt'>{ data.description === '' ? t('unknow') : data.description }</p>
        </div>

        <div className='candidate-comp-body-right'>
          <div className='candidate-comp-body-right-box'>
            <h3 className='candidate-comp-body-label-txt'>{ t('skillsAndExperience') }</h3>
            <hr className='candidate-comp-body-label-hr'/>
            <div className='candidate-comp-body-right-benefit'>
              {
                data.skills.length === 0 ?
                <div className='candidate-comp-unknow'>{t('unknow')}</div> :
                data.skills.map((item, index) =>
                  <div key={index} className='candidate-comp-body-left-benefit-item'>
                    <p className='candidate-comp-body-left-benefit-item-label'>{item.name}</p>
                    <p className='candidate-comp-body-left-benefit-item-label'>{item.xp} {item.xp > 1 ? t('years') : t('year')}</p>
                  </div>
                )
              }
            </div>
          </div>


        </div>
      </div>
    </div>
  );
};


// @export
export default withTranslation('common')(JobComponent);