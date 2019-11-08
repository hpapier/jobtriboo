// @module import
import { useState, useRef } from 'react';
import { useCookies } from 'react-cookie';
import { useRouter } from 'next/router';


// @local import
import './index.css';
import LocationIconGrey from '../../../../../static/assets/localization_icon_g.svg';
import ContractIconGrey from '../../../../../static/assets/contract_icon_g.svg';
import LinkIconGrey from '../../../../../static/assets/link_icon_g.svg';
import DeleteIconGrey from '../../../../../static/assets/delete_icon_g.svg';
import { withTranslation } from '../../../../i18n';
import { deleteAnnounce } from '../../../../../utils/request/announces';


// @component$
const AnnounceItem = ({ t, data, updateData, isPublic = false }) => {
  const [loading, setLoading] = useState(false);
  const [cookies, _, __] = useCookies();
  const isUnmounted = useRef(false);

  const handleDelete = async () => {
    if (loading)
      return;
   
    if (!isUnmounted.current)
      setLoading(true);

    try {
      const res = await deleteAnnounce(data, cookies.token);
      if (res.status === 204) {
        if (!isUnmounted.current)
          setLoading(false);
        updateData(data._id);
      }
      else
        throw res.status;
    } catch (e) {
      console.log(e);
      if (!isUnmounted.current)
        setLoading(false);
    }
  }

  const contractTypeList = [
    { value: 'internship', label: t('dsrCt.internship') },
    { value: 'cdd', label: t('dsrCt.cdd') },
    { value: 'cdi', label: t('dsrCt.cdi') },
    { value: 'contractor', label: t('dsrCt.contractor') }
  ];

  useRef(() => { isUnmounted.current = true },[]);

  const router = useRouter();


  // console.log(data);
  return (
    <div className='announce-item-root'>
      {data.company === null ? <div className='announce-item-company'></div> : <img src={`http://localhost:3001${data.companyInfo[0].logo}`} alt='company-logo' className='announce-item-company' />}
      <div className='announce-item-box'>
        <div className='announce-item-box-title'>{data.title}</div>
        <div className='announce-item-box-cpname'>{data.company !== null ? data.companyInfo[0].name : t('anonymous')}</div>
        <div className='announce-item-box-details'>
          <div className='announce-item-box-details-box'>
            <img src={LocationIconGrey} alt='location-icon' />
            <p className='announce-item-box-details-txt'>{data.location}</p>
          </div>

          <div className='announce-item-box-details-box'>
            <p style={{ margin: 0, fontWeight: 500, fontSize: '1em' }} className='announce-item-box-details-txt'>€</p>
            <p className='announce-item-box-details-txt' style={{ marginTop: '2px' }}>{data.salary.min} - {data.salary.max}</p>
          </div>

          <div className='announce-item-box-details-box'>
            <img width={35} height={35} src={ContractIconGrey} alt='contract-icon' />
            <p className='announce-item-box-details-txt'>{contractTypeList.filter(item => item.value === data.contractType)[0].label}</p>
          </div>
        </div>
      </div>

      {
        !isPublic ?
        (
          <div className='announce-item-btn'>
            <button className='announce-item-btn-el' onClick={() => router.push(`/jobs/${data.publicId}`)}>
              <img src={LinkIconGrey} alt='link-icon' />
            </button>

            <button className='announce-item-btn-el' onClick={handleDelete}>
              <img src={DeleteIconGrey} alt='remove-icon' />
            </button>
          </div>
        ):
        null
      }
    </div>
  );
}


// @export
export default withTranslation('common')(AnnounceItem);