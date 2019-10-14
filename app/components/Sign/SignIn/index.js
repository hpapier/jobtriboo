// @module import
// @local import
import Input from './Input'
import View from './View'
import './index.css'
import { withTranslation } from '../../i18n'


// @component
const SignIn = ({ t }) => {
  return (
    <div className='signin-root'>
      <Input t={t} />
      <View />
    </div>
  );
}


// @export
export default withTranslation('common')(SignIn);