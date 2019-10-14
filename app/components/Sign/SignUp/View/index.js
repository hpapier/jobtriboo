// @module import
// @local import
import TribeLogo from '../../../../static/assets/tribe_logo_w_b.svg'
import './index.css'


// @component
const View = () => {
  return (
    <div className='signup-view-root'>
      <img src={TribeLogo} />
    </div>
  );
}


// @export
export default View;