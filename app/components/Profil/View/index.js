// @module import
// @local import
import './index.css'
import Informations from './Informations';
import Messages from './Messages';
import Settings from './Settings';


// @component
const View = ({ section, logInfo }) => {
  return (
    <div className='view-root'>
      { section === 'informations'  ? <Informations />  : null }
      { section === 'messages'      ? <Messages logInfo={logInfo} />      : null }
      { section === 'settings'      ? <Settings />      : null }
    </div>
  );
}


// @export
export default View;