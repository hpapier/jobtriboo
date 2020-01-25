// @module import
import React, { useState, useEffect, useRef } from 'react';
import { WithTranslation } from 'next-i18next';
import { useRouter } from 'next/router';


// @local import
import './index.css';
import { withTranslation } from '../../../../i18n';
import { serverFileURL } from '../../../../../utils/config';
import { AnnounceProps } from '../../../../../types/announce';

const CrossIcon = require('../../../../../static/assets/cross-icon-grey.svg') as string;


// @interface
interface ComponentProps extends WithTranslation {
  data: AnnounceProps,
  changeView: () => void
}


// @component
const AnnounceStatsPanel: (props: ComponentProps) => JSX.Element = ({ t, changeView, data }) => {

  // General state management.
  const isUnmounted = useRef(false);
  const router = useRouter();


  // Component Didmount/Unmount function.
  useEffect(() => {
    return () => { isUnmounted.current = true }
  })


  // Rendering function.
  return (
    <div id='component-announce-stats-pannel-root'>
      <div className='caspr-head'>
        <h1 className='casprh-title'><span style={{ color: '#246BF8' }}>{data.candidateInfo.length}</span> {data.candidateInfo.length > 1 ? t('applicants') : t('applicant')}</h1>
        <button className='casprh-back' onClick={changeView}>
          <img src={CrossIcon} alt="remove"/>
        </button>
      </div>

      <div className='caspr-box'>
      {
        data.candidateInfo.length !== 0 ?
        [...data.candidateInfo].reverse().map((item, index) => (
          <div key={item._id} className='casprb-item' style={{ borderBottom: index === data.candidateInfo.length - 1 ? '1px solid rgba(0, 0, 0, 0)' : '1px solid rgba(0, 0, 0, .05)' }}>
            <div className='casprbi-txt'>
              <img src={serverFileURL + item.picture} alt="logo" className='casprbit-img' />
              <p className='casprbit-info'>{`${item.firstname} ${item.lastname}`}</p>
              <p className='casprbit-info'>{item.phone}</p>
              <p className='casprbit-info'>{item.email}</p>
            </div>

            <button className='casprbi-profilbtn' onClick={() => router.push('/candidate/' + item.publicId)}>{t('seeProfil')}</button>
          </div>
        )) :
        <p style={{ margin: '10px auto', textAlign: 'center' }}>{t('noApplicationYet')}</p>
      }
      </div>
    </div>
  );
}


// @export
export default withTranslation('common')(AnnounceStatsPanel);