// @module import
// @local import
import Companies from './Companies';
import Announces from './Announces';
import Messages from './Messages';
import Settings from './Settings';
import './index.css';


// @component
const View = ({ section, logInfo }) => {
  return (
    <div className='view-root'>
      { section === 'companies' ? <Companies /> : null }
      { section === 'announces' ? <Announces /> : null }
      { section === 'messages' ? <Messages logInfo={logInfo} /> : null }
      { section === 'settings' ? <Settings /> : null }
    </div>
  );
}


// @export
export default View;