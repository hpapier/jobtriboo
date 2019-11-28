// @module import
import { useRef, useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import io from 'socket.io-client';


// @local import
import './index.css';
import { withTranslation } from '../../../i18n';
import { getRooms } from '../../../../utils/request/messages';
import RoomItem from '../../../Inbox/RoomItem';
import Room from '../../../Inbox/Room';
import { socketURL } from '../../../../utils/config';


// @component
const Messages = ({ t, logInfo }) => {
  const isUnmounted = useRef(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [cookies, _, __] = useCookies();

  const socket = useRef(null);
  const roomsRef = useRef([]);

  const [selectedRoom, setSelectedRoom] = useState(null);

  const fetchRooms = async () => {

    if (!isUnmounted.current) {
      !loading ? setLoading(true) : null;
      error ? setError(null) : null;
    }

    try {
      const res = await getRooms('recruiter', cookies.token);
      if (res.status === 200) {
        const rdata = await res.json();
        if (!isUnmounted.current) {
          setLoading(false);
          setRooms(rdata);
        }
      }
    } catch (e) {
      console.log(e);
      if (!isUnmounted.current) {
        setLoading(false);
        setError(500);
      }
    }
  }

  useEffect(() => {
    if (selectedRoom === null)
      fetchRooms();
  }, [selectedRoom]);

  useEffect(() => {
    roomsRef.current = rooms;
  });

  useEffect(() => {
    socket.current = io(socketURL);

    socket.current.on('connect', () => {
      socket.current.emit('join-inbox', logInfo.userId);
    });

    socket.current.on('inbox', room => {
      const filteredRooms = roomsRef.current.filter(item => item._id !== room._id);
      setRooms([ room, ...filteredRooms ]);
    });

    return () => {
      isUnmounted.current = true;

      socket.current.emit('leave-inbox', logInfo.userId);
      socket.current.off('inbox');
    };
  }, []);


  return (
    <div className='dh-msg-root'>
      {
        selectedRoom === null ?
        <h3 className='dh-msg-label'>{t('inboxLabel')} ({rooms.length})</h3> :
        <button className='dh-msg-label-btn' onClick={() => setSelectedRoom(null)}>{t('backToRoom')}</button>
      }
      { !loading && rooms.length === 0 ? <p className='db-msg-empty'>{t('noMsgYet')}</p> : null }
      {
        loading ?
        <div className='dh-msg-loading'></div> :
        <div>
          {
            selectedRoom === null ?
            rooms.map((room, index) => <RoomItem logInfo={logInfo} userState='recruiter' data={room} key={index} open={() => setSelectedRoom(room)} />) :
            <Room userState='recruiter' logInfo={logInfo} data={selectedRoom} />
          }
        </div>
      }
    </div>
  );
}


// @export
export default withTranslation('common')(Messages);