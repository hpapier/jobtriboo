// @module import
import { useState, useEffect, useRef } from 'react';
import { useCookies } from 'react-cookie';
import { useRouter } from 'next/router';


// @local import
import './index.css';
import TotemIconGrey from '../../../../../static/assets/totem_icon_g.svg';
import LocalizationIconGrey from '../../../../../static/assets/location-icon-grey.svg';
import TribeIconGrey from '../../../../../static/assets/tribe_icon_g.svg';
import LinkIconGrey from '../../../../../static/assets/link_icon_g.svg';
import DeleteIconGrey from '../../../../../static/assets/delete_icon_g.svg';
import { withTranslation } from '../../../../i18n';
import { deleteCompany } from '../../../../../utils/request/companies';
import NewCompany from '../NewCompany';
import { serverFileURL } from '../../../../../utils/config';


// @component
const CompanyItem = ({ data, t, updateCompaniesList }) => {
  const [updateState, setUpdateState] = useState(false);
  const [loading, setLoading] = useState(false);
  const listActivityArea = [
    { label: t('commercial'), value: 'commercial' },
    { label: t('tech'), value: 'tech' },
    { label: t('engineering'), value: 'engineering' },
    { label: t('retail'), value: 'retail' },
  ];
  const listEmployeesNumber = [
    { label: t('companyEmployeesNumberTiny'), value: 'tiny' },
    { label: t('companyEmployeesNumberSmall'), value: 'small' },
    { label: t('companyEmployeesNumberMid'), value: 'mid' },
    { label: t('companyEmployeesNumberBig'), value: 'big' },
    { label: t('companyEmployeesNumberHuge'), value: 'huge' }
  ];
  const [cookies, _, __] = useCookies();
  const isUnmounted = useRef(false);
  const router = useRouter();

  const activityArea = listActivityArea.filter(item => item.value === data.activityArea[0])
  const employeesNumber = listEmployeesNumber.filter(item => item.value === data.employeesNumber);

  const handleDelete = async () => {
    if (!isUnmounted.current)
      setLoading(true);

    try {
      const res = await deleteCompany(data, cookies.token);
      if (res.status === 200) {
        const ndata = await res.json();

        if (!isUnmounted.current) {
          setLoading(false);
          updateCompaniesList(ndata);
        }
      } else
        throw res.status;
    } catch (e) {
      console.log(e);
      if (!isUnmounted.current)
        setLoading(false);
    }
  }

  useEffect(() => () => { isUnmounted.current = true },[]);


  const handleUpdateState = ndata => {
    if (!isUnmounted.current) {
      if (ndata !== 'noupdate')
        updateCompaniesList(ndata);
      setUpdateState(false);
    }
  }

  const handleSetItemUpdateClick = e => {
    if (e.target.id === 'delete-btn')
      return;
    else if (e.target.id === 'link-btn')
      return;
    else {
      if (!isUnmounted.current)
        setUpdateState(true);
    }
  }

  return (
    <div>
      {
        updateState ?
        (
          <div className='comp-update-root'>
            <NewCompany closeWindow={ndata => handleUpdateState(ndata)} update={{ ...data, logo: data.logo, cover: data.logo }} />
          </div>
        ) :
        (
          <div className='comp-item-root' onClick={e => handleSetItemUpdateClick(e)}>
            <img  src={`${serverFileURL}${data.logo}`} alt='' className='comp-item-logo' />
            <div style={{ height: '90px' }}>
              <h2 className='comp-item-name'>{data.name}</h2>
              <div className='comp-item-info-box'>
                <img src={TotemIconGrey} className='comp-item-icon' alt='totem-icon' />
                <p className='comp-item-info-box-txt'>{activityArea[0].label}</p>
              </div>

              <div className='comp-item-info-box'>
                <img src={LocalizationIconGrey} style={{ marginLeft: '3px', marginRight: '12px' }} className='comp-item-icon' alt='localization-icon' />
                <p className='comp-item-info-box-txt'>{data.country}</p>
              </div>

              <div className='comp-item-info-box'>
                <img src={TribeIconGrey} style={{ marginLeft: '3px', marginRight: '14px' }} className='comp-item-icon' alt='tribe-icon' />
                <p className='comp-item-info-box-txt'>{employeesNumber[0].label}</p>
              </div>
            </div>

            <div className='comp-item-left-icons'>
              <button disabled={loading} className='comp-item-left-btn' id='link-btn' onClick={() => router.push(`/companies/${data.name}`)}>
                <img src={LinkIconGrey} alt='link-icon' id='link-btn' />
              </button>

              <button disabled={loading} className='comp-item-left-btn' id='delete-btn' onClick={() => handleDelete()}>
                <img id='delete-btn' src={DeleteIconGrey} alt='delete-icon' />
              </button>
            </div>
          </div>
        )
      }
    </div>
  );
}


// @export
export default withTranslation('common')(CompanyItem);