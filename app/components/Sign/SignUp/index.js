// @module import
import React, { useState } from 'react';


// @local import
import Input from './Input'
import Candidate from './Candidate'
import View from './View'
import './index.css'
import { withTranslation } from '../../i18n'


// @component
const SignUp = ({ t }) => {
  const [flow, setFlow] = useState(false);
  return (
    <div className='signup-root'>
      {
        !flow ?
        <Input t={t} setFlow={setFlow} /> :
        <Candidate t={t} />

      }
      <View />
    </div>
  );
}


// @export
export default withTranslation('common')(SignUp);