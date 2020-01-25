// @module import
import React from 'react';
import { WithTranslation } from 'next-i18next';


// @local import
import { withTranslation } from '../i18n';
import './index.css';


// @component
const Footer = ({ t }: WithTranslation ) => {
  return (
    <div id='footer-root'>
      <div className='fr-menu'>
        <h5 className='frm-txt'>{t('about')}</h5>
        <h5 className='frm-txt'>{t('contact')}</h5>
        <h5 className='frm-txt'>{t('cgu')}</h5>

        {/* <div>

        </div> */}
      </div>

      <div className='fr-menu'>
        <h5 className='frm-txt'>{t('copyright')}</h5>
      </div>
    </div>
  );
};


// @export
export default withTranslation('common')(Footer);