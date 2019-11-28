// @module import
// @local import
import './index.css';
import SendIconGrey from '../../../static/assets/send_icon_g.svg';
import { withTranslation } from '../../i18n';
import { serverURL } from '../../../utils/config';


// @component
const RoomItem = ({ userState, data, open, t, logInfo = null }) => {
  const candidate = data.candidateInfo[0];
  const recruiter = data.recruiterInfo[0];
  const { lastMessageInfo } = data;

  // Determine if this user is the receiver of the last message.
  const isReceiver = lastMessageInfo.from === logInfo.userId ? false : true;
  const date = new Date(lastMessageInfo.dateTime);
  const formatedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;


  return (
    <div className={`room-item-root${!lastMessageInfo.readed && lastMessageInfo.from !== logInfo.userId ? `` : ` -room-inactive`}`} onClick={open}>
      { userState === 'candidate' || ((candidate.picture === '') ? <div className='room-item-root-picture'></div> : <img src={`${serverURL}${candidate.picture}`} className='room-item-root-picture' alt='candidate-picture' />) }
      { userState === 'recruiter' || <div className='room-item-root-picture'></div> }
      <div className='room-item-body'>
        <div className='room-item-body-title'>
          { userState !== 'recruiter' || <div className='room-item-body-title-txt'>{candidate.firstName}</div> }
          { userState !== 'candidate' || <div className='room-item-body-title-txt'>{recruiter.firstName}</div> }
          { isReceiver && !lastMessageInfo.readed ? <div className='room-item-body-nmsg'>{t('newMessage')}</div> : null}
        </div>

        <div className='room-item-body-msg'>
          {
            <>
              { userState === 'candidate' || lastMessageInfo.from !== data.recruiter || <img className='room-item-body-msg-icon' src={SendIconGrey} alt='send-icon' /> }
              { userState === 'recruiter' || lastMessageInfo.from !== data.candidate || <img className='room-item-body-msg-icon' src={SendIconGrey} alt='send-icon' /> }
              {/* <p className='room-item-body-msg-content'>qsfljsqldkfjlkqsdjfklqsdjflkqjsdflkjsqdflkfjsdq qsfljsqldkfjlkqsdjfklqsdjflkqjsdflkjsqdflkfjsdq qsfljsqldkfjlkqsdjfklqsdjflkqjsdflkjsqdflkfjsdq ealksqfjklsdjf qsfdlkjflkdqsjf sqjldkfjklqsdjf sqdjfkljqsdlkj sqdjfkljklqsd sqdjf qjsdkfj qsdjfklqslkdjf qsdlf</p> */}
              {
                lastMessageInfo.type === 'Application' ?
                <p className='room-item-body-msg-content'>{ `${candidate.firstName} ${candidate.lastName} ${t('candidateIsInterestedAbout')} ${lastMessageInfo.apply.announceInfo[0].title} ${t('fromTheCompany')} ${lastMessageInfo.apply.companyInfo.length > 0 ? lastMessageInfo.apply.companyInfo[0].name : t('anonymous')}`}</p> :
                <p className='room-item-body-msg-content'>{ data.lastMessageInfo.content }</p>
              }
            </>
          }
        </div>
      </div>

      <div className='room-item-body-msg-date'>
        {formatedDate}
      </div>
    </div>
  );
}


// @export
export default withTranslation('common')(RoomItem);