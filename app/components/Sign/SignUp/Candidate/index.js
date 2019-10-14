// @module import
// @local import
import SignNavbar from '../../Navbar'
import './index.css'


// @component
const Candidate = ({ t }) => {
  return (
    <div className='candidate-root'>
      <SignNavbar />

      <div>

        <div>
          <label></label>
          <div>
            <div></div>
            <div></div>
          </div>
        </div>


        <div>
          <button>{t('validate')}</button>
          <button>{t('skip')}</button>
        </div>
      </div>
    </div>
  );
};


// @export
export default Candidate;