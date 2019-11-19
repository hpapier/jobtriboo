// @module import
import { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { useCookies } from 'react-cookie';
import io from 'socket.io-client'


// @local import
import './index.css';
import { withTranslation } from '../i18n';
import LocationIconGrey from '../../static/assets/localization_icon_g.svg';
import ContractTypeIconGrey from '../../static/assets/contract_icon_g.svg';
import FeatherIcon from '../../static/assets/feather_icon.svg';
import TotemIconGrey from '../../static/assets/totem_icon_g.svg';
import TribeIconGrey from '../../static/assets/tribe_icon_g.svg';
import { useEffect } from 'react';
import { apply } from '../../utils/request/announces';


// @component
const JobComponent = ({ t, data, logInfo }) => {
  const router = useRouter();
  // const socket = useRef(null);
  const isUnmounted = useRef(false);
  const [announceData, setAnnounceData] = useState(data);
  const [cookies, _, __] = useCookies()

  const [applyState, setApplyState] = useState({ error: false, loading: false });

  const [sample, setSample] = useState(false);

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

  const handleApply = async () => {
    // console.log('handleApply');
    // socket.current.emit('apply', { offerId: data._id, userId: logInfo.userId });
    if (!isUnmounted.current)
      setApplyState({ error: false, loading: true });

    try {
      const res = await apply({ offerId: data._id, candidateId: logInfo.userId, companyId: announceData.company === null ? null : announceData.companyInfo[0]._id }, cookies.token);
      if (res.status === 200) {
        const rdata = await res.json();
        if (!isUnmounted.current) {
          setAnnounceData({ ...data, candidates: rdata.candidates });
          setApplyState({ error: false, loading: false });
        }
      } else
        throw res.status;
    } catch (e) {
      console.log(e);
      setApplyState({ error: true, loading: false });
    }
  }

  useEffect(() => {
    // if (logInfo.loggedIn)
    //   socket.current = io('http://localhost:3001');
    return () => { isUnmounted.current = true };
  }, []);

  console.log(announceData);

  return (
    <div className='job-root'>
      <div className='job-head'>
        <div className='job-head-ib'>
          { announceData.company === null ? <div className='job-head-logo'></div> : <img className='job-head-logo' src={`http://localhost:3001${announceData.companyInfo[0].logo}`} /> }
          <div className='job-head-tbox'>
            <div>
              <h3 className='job-head-tbox-title' style={{ opacity: 0.5, fontSize: '1em' }}>{ announceData.company === null ? t('anonymous') : announceData.companyInfo[0].name }</h3>
              <h2 className='job-head-tbox-title' style={{ opacity: 1, fontSize: '1.5em' }}>{ announceData.title }</h2>
            </div>
            <div className='job-head-tbox-info'>
              <div className='job-head-tbox-info-box'>
                <img src={LocationIconGrey} alt='location-icon' className='job-head-tbox-info-box-icon' />
                <p className='job-head-tbox-info-box-txt'>{ announceData.location }</p>
              </div>

              <div className='job-head-tbox-info-box'>
                <div className='euro-icon'>€</div>
                <p className='job-head-tbox-info-box-txt'>{ announceData.salary.min }k - { announceData.salary.max }k</p>
              </div>

              <div className='job-head-tbox-info-box'>
                <img src={ContractTypeIconGrey} width={35} height={35} alt='contract-type-icon' className='job-head-tbox-info-box-icon' />
                <p className='job-head-tbox-info-box-txt'>{ contracts.filter(item => announceData.contractType === item.value)[0].label }</p>
              </div>
            </div>
          </div>
        </div>

       {
        logInfo.userState === 'recruiter' ||
        <div className='job-head-bb'>
          {
            announceData.candidates.filter(item => logInfo.userId === item).length === 0 ?
            <button className='job-head-bb-button' disabled={!logInfo.loggedIn || applyState.loading} onClick={handleApply}>
              { applyState.loading ? <div className='job-head-bb-button-loading'></div> : t('apply')}
            </button> :
            <button className='job-head-bb-button-alreadyapplied'>{t('alreadyApplied')}</button>
          }
          { !logInfo.loggedIn ? <div className='job-head-bb-msg'>{t('youNeedToBeConnectedToApply')}</div> : null}
          { !applyState.error || <div className='job-head-bb-button-errormsg'>{t('error500')}</div> }
        </div>
      }
      </div>

      <div className='job-body'>
        <div className='job-body-left'>
          <h3 className='job-body-label-txt'>{ t('postDescription') }</h3>
          <hr className='job-body-label-hr'/>
          <p className='job-body-left-txt'>{ announceData.description }</p>
        </div>

        <div className='job-body-right'>
          <div className='job-body-right-box'>
            <h3 className='job-body-label-txt'>{ t('benefits') }</h3>
            <hr className='job-body-label-hr'/>
            <div className='job-body-right-benefit'>
              {
                announceData.benefits.map((item, index) =>
                  <div key={index} className='job-body-left-benefit-item'>
                    <img src={FeatherIcon} alt='benefit-icon' className='job-body-left-benefit-item-icon' />
                    <p className='job-body-left-benefit-item-label'>{item}</p>
                  </div>
                )
              }
            </div>
          </div>

          {
            announceData.company !== null ?
            <div className='job-body-right-box'>
              <h3 className='job-body-label-txt'>{ t('theCompany') }</h3>
              <hr className='job-body-label-hr' style={{ marginBottom: '20px' }} />
              <div className='job-body-company-infobox'>
                <img src={TotemIconGrey} alt='triboo-icon' className='job-body-company-infobox-icon' />
                <p className='job-body-company-infobox-txt' style={{ marginLeft: '15px'}} >{ triboo.filter(item => announceData.companyInfo[0].activityArea[0] === item.value)[0].label }</p>
              </div>

              <div className='job-body-company-infobox'>
                <img src={LocationIconGrey} alt='location-icon' style={{ marginLeft: '2px'}} className='job-body-company-infobox-icon' />
                <p className='job-body-company-infobox-txt' style={{ marginLeft: '16px'}} >{ announceData.companyInfo[0].country }, { announceData.companyInfo[0].address }</p>
              </div>

              <div className='job-body-company-infobox'>
                <img src={TribeIconGrey} alt='employeesNumber-icon' style={{ marginLeft: '2px'}} className='job-body-company-infobox-icon' />
                <p className='job-body-company-infobox-txt' style={{ marginLeft: '17px'}} >{ employeesNumber.filter(item => announceData.companyInfo[0].employeesNumber === item.value)[0].label }</p>
              </div>

              <button className='company-btn' onClick={() => router.push(`/companies/${announceData.companyInfo[0].name}`)}>{ t('knowMore') }</button>
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