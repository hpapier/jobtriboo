// @module import
import { useState, useEffect, useRef } from 'react';
import { useCookies } from 'react-cookie';


// @local import
import { withTranslation } from '../../i18n';
import { getRoomData } from '../../../utils/request/room';
import './chat.css';

// @component
const Chat = ({ t, data, loading, moreLloading, fetchMore, owner, candidate }) => {
  const isUnmounted = useRef(false);
  const element = useRef(null);

  useEffect(() => {
    // return () => { isUnmounted.current = true };
    element.current.scrollTop = element.current.scrollHeight;
  });
  

  // let sortedData = data.reverse();

  return (
    <div ref={element} className={`chat-root ${loading ? ` -loading` : ` -msg`}`}>
      {
        loading ?
        <div className='chat-loading'></div> :
        <div className='chat-box-chat'>
          {
            data.map((item, index) => (
              <div key={index} className={`chat-msg-box ${owner === item.from ? ` -owner-box`: ``}`}>
                {
                  item.type === 'Application' ?
                  <div className='chat-msg-isInterested'>{`${candidate.firstName} ${candidate.lastName} ${t('candidateIsInterestedAbout')} ${item.apply.announceInfo[0].title} ${t('fromTheCompany')} ${item.apply.companyInfo.length > 0 ? item.apply.companyInfo[0].name : t('anonymous')}`}</div> :
                  <div className={`chat-msg ${owner === item.from ? ` -owner`: ``}`}>{item.content}</div>
                }
              </div>
            ))
          }
        </div>
      }
    </div>
  );
}


// @export
export default withTranslation('common')(Chat);