// @module import
import React from 'react';


// @local import
import './index.css';
import { withTranslation } from '../i18n';
import { WithTranslation } from 'next-i18next';


// @interfaces
interface AppProps extends WithTranslation {
  margin: string,
  errorValue: string,
  errorMessages: Object
}


// @component
const Error: ({}: AppProps) => JSX.Element = ({ t, margin, errorValue, errorMessages }) => {
  return (
    <div style={{ margin, display: 'flex', justifyContent: 'center' }}>
      <p id='error-component-txt'>{errorMessages[errorValue]}</p>
    </div>
  )
}


// @export
export default withTranslation('common')(Error);