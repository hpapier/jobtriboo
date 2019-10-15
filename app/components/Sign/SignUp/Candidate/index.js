// @module import
import { useRouter } from 'next/router';


// @local import
import SignNavbar from '../../Navbar'
import './index.css'


// @component
const Candidate = ({ t }) => {
  const router = useRouter();

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
          <button onClick={() => router.push('/profil')}>{t('validate')}</button>
          <button onClick={() => router.push('/profil')}>{t('skip')}</button>
        </div>
      </div>
    </div>
  );
};


// @export
export default Candidate;