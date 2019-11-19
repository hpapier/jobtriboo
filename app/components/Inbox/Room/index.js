// @module import
import { useRef, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useRouter } from 'next/router';
import io from 'socket.io-client';


// @local import
import './index.css';
import { getRoomData, roomAcceptation } from '../../../utils/request/room';
import { postMessage } from '../../../utils/request/messages';
import { withTranslation } from '../../i18n';
import Chat from './chat';
import Loading from '../../Loading';


// @component
const Room = ({ logInfo, data, t, userState }) => {
  const candidate = data.candidateInfo[0];
  const isUnmounted = useRef(false);
  const [cookies, _, __] = useCookies();
  const socket = useRef(null);
  const messages = useRef([]);
  const [fetchMoreBool, setFetchMoreBool] = useState(false);
  const [postLoading, setPostLoading] = useState(false);
  const router = useRouter();

  const [inputValue, setInputValue] = useState('');
  const [roomData, setRoomData] = useState({ ...data, messages: [] });
  const [dataState, setDataState] = useState({ error: false, loading: true, moreLoading: false });
  const [acceptBtnStatus, setAcceptBtnStatus] = useState({ error: false, loading: false });




  const fetchData = async (more = false) => {
    if (more) {
      if (!isUnmounted.current)
        setDataState({ ...dataState, moreLoading: true });
    }
    else {
      if (!isUnmounted.current)
        setDataState({ error: false, loading: true, moreLoading: false });
    }

    try {
      const res = await getRoomData(userState, roomData._id, cookies.token, messages.current.length);

      if (res.status === 200) {
        const ndata = await res.json();
        if (!isUnmounted.current) {
          setRoomData({ ...roomData, messages: [...roomData.messages, ...ndata ]});
          if (more)
            setDataState({ ...dataState, moreLoading: false });
          else
            setDataState({ error: false, loading: false, moreLoading: false });
        }
      }
      else
        throw res.status;
    } catch (e) {
      console.log(e);
      if (!isUnmounted.current)
          setDataState({ error: true, loading: false, moreLoading: false })
    }
  }



  const handleAccept = async () => {
    if (!isUnmounted.current)
      setAcceptBtnStatus({ error: false, loading: true });

    try {
      const res = await roomAcceptation(roomData._id, cookies.token);
      if (res.status === 204) {
        if (!isUnmounted.current) {
          setRoomData({ ...roomData, accepted: true });
          setAcceptBtnStatus({ error: false, loading: false });
        }
      }
      else
        throw res.status;
    } catch (e) {
      console.log(e);
      if (!isUnmounted.current)
        setAcceptBtnStatus({ error: true, loading: false });
    }
  }




  const handlePostMsg = async e => {
    e.preventDefault();

    if (inputValue === '')
      return;

    if (!isUnmounted.current)
      setPostLoading(true);

    try {
      const res = await postMessage(
        {
          to: userState === 'recruiter' ? roomData.candidate : roomData.recruiter,
          from: logInfo.userId,
          content: inputValue,
          roomId: roomData._id
        },
        cookies.token,
        userState
      );

      if (res.status === 200) {
        if (!isUnmounted.current) {
          setInputValue('');
          setPostLoading(false);
        }
      }
      else
        throw res.status;

    } catch (e) {
      console.log(e);
      setPostLoading(false);
    }
  }




  // Put the ref messages array up to date on each render
  useEffect(() => {
    messages.current = roomData.messages;
  });




  // CDM, CWUM, ..
  useEffect(() => {
    fetchData();

    socket.current = io('localhost:3001');

    socket.current.on('connect', () => {
      socket.current.emit('join-room', roomData._id);
    });

    socket.current.on('message', msg => {
      setRoomData({ ...roomData, messages: [msg, ...messages.current] });
      if (msg.to === logInfo.userId)
        socket.current.emit('message-received', logInfo.userId);
    });

    return () => {
      isUnmounted.current = true;

      socket.current.emit('leave-room', roomData._id);
      socket.current.off('message');
    };
  }, []);


  useEffect(() => {
    if (fetchMoreBool) {
      fetchData(true);
      setFetchMoreBool(false);
    }
  }, [fetchMoreBool])

  return (
    <div className='room-root'>
      <div className='room-candidate-profil'>
        { userState !== 'recruiter' || (candidate.picture === '' ? <div className='room-candidate-profil-picture'></div> : <img className='room-candidate-profil-picture' src={`http://localhost:3001${candidate.picture}`} />)}
        { userState !== 'candidate' || <div className='room-candidate-profil-picture'></div> }
        <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '15px' }}>
          {
            userState === 'recruiter' ?
            <>
              <h3 className='room-candidate-profil-fullname'>{ candidate.firstName } { candidate.lastName }</h3>
              <h3 className='room-candidate-profil-jobname'>{ candidate.jobName }sqdfqsdfqds</h3>
              <button className='room-candidate-profil-seeprofil' onClick={() => router.push(`/candidate/${candidate.publicId}`)}>{t('seeProfil')}</button>
            </> :
            <>
              <h3 className='room-candidate-profil-fullname'>{ roomData.recruiterInfo[0].firstName }</h3>
              <h3 className='room-candidate-profil-jobname'>{ `${t('recruiterFor')}` }</h3>
            </>
          }
        </div>

      </div>

      <Chat
        data={roomData.messages}
        moreLoading={dataState.moreLoading}
        loading={dataState.loading}
        fetchMore={bool => setFetchMoreBool(bool)}
        owner={logInfo.userId}
        candidate={candidate}
      />

      <form onSubmit={handlePostMsg} className='room-input'>
        {
          roomData.accepted ?
          <>
            <input className='room-input-el' type='text' placeholder={t('WriteSomething')} onChange={e => setInputValue(e.target.value)} value={inputValue} />
            <button className='room-input-send' type='submit' disabled={dataState.loading || postLoading}>{postLoading ? <Loading size='tiny' color='white' /> : t('sendMsg')}</button>
          </> :
            (userState === 'recruiter') ?
            <button className='room-input-btn-accept' disabled={acceptBtnStatus.loading} onClick={handleAccept} type='button'>
              { acceptBtnStatus.loading ? <div className='room-input-btn-accept-loading'></div> : t('acceptAndStartChatting') }
            </button> :
            null
        }
      </form>
    </div>
  );
}


// @export
export default withTranslation('common')(Room);