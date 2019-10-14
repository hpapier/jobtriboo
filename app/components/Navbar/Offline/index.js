// @module import
import { Button } from '@material-ui/core'
import { useRouter } from 'next/router'

// @local import
import LangButton from '../LangButton'
import Layout from '../Layout'
import Logo from '../Logo'
import Feather from '../../../static/assets/feather_icon.svg'
import Arrow from '../../../static/assets/arrow_icon_0.svg'
import { SSignInBtn, SSignUpBtn, SRecruiterBtn, SRightButtonDiv } from './style'
import './index.css'


// @component
const Offline = ({ t }) => {
  const router = useRouter();
  return (
    <Layout>
      <div className='navbar-offline-logo'>
        <Logo/>
      </div>

      <div style={SRightButtonDiv}>
        <LangButton />

        <button style={SSignInBtn} onClick={() => router.push('/signin')}>
          {t('login')}
        </button>

        <Button style={SSignUpBtn} onClick={() => router.push('/signup')}>
          {t('register')}
          <img src={Feather} />
        </Button>

        <Button style={SRecruiterBtn}>
          {t('recruiter')}
          <img src={Arrow} />
        </Button>
      </div>
    </Layout>
  )
};


// @export
export default Offline;