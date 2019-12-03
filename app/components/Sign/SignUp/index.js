// @module import
import React, { useState } from 'react';


// @local import
import Input from './Input'
import View from './View'
import './index.css'
import { withTranslation } from '../../i18n'


// @component
const SignUp = ({ t }) => {
  return (
    <div className='signup-root'>
      <Input t={t} />
      <View />
    </div>
  );
}


// @export
export default withTranslation('common')(SignUp);