// @module import
import React, { useState, useEffect, useRef, Dispatch, SetStateAction } from 'react';
import { WithTranslation } from 'next-i18next';
import { useCookies } from 'react-cookie';


// @local import
import './index.css'
import { withTranslation } from '../../../../i18n';
import { deleteAnnounce } from '../../../../../utils/request/announces';
import { serverFileURL } from '../../../../../utils/config';
import { useRouter } from 'next/router';
import { salaryFormat } from '../../../../../utils/format';
import { AnnounceProps } from '../../../../../types/announce';

const CrossIcon = require('../../../../../static/assets/cross-icon-red.svg') as string;
const UserIcon = require('../../../../../static/assets/user-icon-blue.svg') as string;
const ArrowIcon = require('../../../../../static/assets/arrow-right-icon-grey.svg') as string;


// @interface
interface AnnounceItemProps extends WithTranslation {
  type: string,
  data: AnnounceProps,
  clickFn?: (data: AnnounceProps) => void,
  removeAnnounce?: (id: string) => void
}


// @component
const AnnounceItem: (props: AnnounceItemProps) => JSX.Element = ({ t, type, data, clickFn = null, removeAnnounce = null }) => {

  const [fetchLoading, setFetchLoading] = useState(false);
  const isUnmounted = useRef(false);
  const [cookies, _, __] = useCookies();
  const router = useRouter();


  const handleAnnounceRemoving = async (e) => {
    e.stopPropagation();

    if (!isUnmounted.current)
      setFetchLoading(true);

    try {
      const response = await deleteAnnounce(data._id, cookies.token);
      if (response.status === 204)
        removeAnnounce(data._id);
      else
        throw response;
    }
    catch (e) {
      console.log(e);
      if (!isUnmounted.current) setFetchLoading(false);
    }
  }


  const handleSeeAnnounce = (e) => {
    e.stopPropagation();

    router.push('/jobs/' + data.publicId);
  }


  // Component Didmount & Unmount fucntion.
  useEffect(() => {
    () => { isUnmounted.current = true };
  }, []);


  // Rendering function.
  return (
    <div className='component-announce-item-root' onClick={() => clickFn(data)}>
      <div className='cair-info'>
        { data.company !== null ? <img className='cairi-company' style={{ backgroundColor: '#fff' }} src={serverFileURL + data.companyInfo.logo } /> : <div className='cairi-company'></div> }

        <div className='cairi-box --cairi-box-info'>
          <h2 className='cairib-title'>{data.title}</h2>
          <h4 className='cairib-subtitle'>{data.company === null ? t('anonymousLabel') : data.companyInfo.name}</h4>
        </div>

        <div className='cairi-box --cairi-box-location'>
          <h2 className='cairib-title'>{`${data.country}, ${data.city}`}</h2>
          <h4 className='cairib-subtitle'>{t('location')}</h4>
        </div>

        <div className='cairi-box --cairi-box-salary'>
          <h2 className='cairib-title'>{`${salaryFormat(data.salary.min)}€ - ${salaryFormat(data.salary.max)}€`}</h2>
          <h4 className='cairib-subtitle'>{t('salary')}</h4>
        </div>
      </div>

      {
        type === 'recruiter' ?
        <div className='cair-action'>
          <button className='caira-btn --caira-btn-candidates' type='button' disabled={fetchLoading}>
            <img className='caira-btn-candidates-icon' src={UserIcon} alt=""/>
            {data.candidateInfo.length}
          </button>
          <button className='caira-btn --caira-btn-remove' type='button' onClick={handleAnnounceRemoving} disabled={fetchLoading}>
            <img className='caira-btn-remove-icon' src={CrossIcon} alt=""/>
          </button>
          <button className='caira-see-announce' type='button' onClick={handleSeeAnnounce}>
            {t('seeAnnounce')}
            <img src={ArrowIcon} alt="see-announce"/>
          </button>
        </div> :
        <div className='cair-contract-type'>
          <p className='cairct-txt'>{t(data.contractType)}</p>
        </div>
      }
    </div>
  );
}


// @export
export default withTranslation('common')(AnnounceItem);