// @module import
import React from 'react';
import { WithTranslation } from 'next-i18next';
import { useRouter } from 'next/router';


// @local import
import { withTranslation } from '../../../i18n';
import './index.css';

const IllustrationRecruiter = require('../../../../static/img/illustration-recruiter.svg') as string;
const ArrowIcon = require('../../../../static/assets/arrow-right-icon.svg') as string;
const ValidIcon = require('../../../../static/assets/validation-blue-icon.svg') as string;

// @interfaces
interface AppProps extends WithTranslation {
  logInfo: any
}


// @component
const HomeRecruiter = ({ t, logInfo }: AppProps) => {

  const router = useRouter();

  return (
    <div id='home-recruiter-root'>
      <div className='hrr-box'>
        <div id='hrrb-txt'>
          <h1 id='hrrbt-title'>{t('home-recruiter-title')}</h1>
          <h2 id='hrrbt-subtitle' dangerouslySetInnerHTML={{ __html: t('home-recruiter-subtitle') }}></h2>
          <div id='hrrbt-stats'>
            <div className='hrrbts-box'>
              <p className='hrrbtsb-txt'>500%</p>
              <h4 className='hrrbtsb-label'>{t('satisfaction')}</h4>
            </div>

            <div className='hrrbts-box'>
              <p className='hrrbtsb-txt'>24/7</p>
              <h4 className='hrrbtsb-label'>{t('support')}</h4>
            </div>

            <div className='hrrbts-box'>
              <p className='hrrbtsb-txt'>100+</p>
              <h4 className='hrrbtsb-label'>{t('candidats')}</h4>
            </div>

          </div>
          <button id='hrrt-btn' onClick={() => router.push('/signup')}>{t('openRecruiterAccount')}</button>
        </div>
        <img id='hrrb-img' src={IllustrationRecruiter} alt='recruiter' />
      </div>

      <div className='hrr-box'>
        <div id='hrrb-management'>
          <h4 className='hrrbb-label' style={{ color: '#246BF8', backgroundColor: 'rgba(36, 107, 248, 0.15)' }}>{t('management')}</h4>
          <h3 className='hrrbb-title' dangerouslySetInnerHTML={{ __html: t('management-title') }}></h3>
          <p className='hrrbb-subtitle'>{t('management-subtitle')}</p>
        </div>

        <div id='hrrb-simplicity'>
          <h4 className='hrrbb-label' style={{ color: '#00C9A7', backgroundColor: 'rgba(0, 201, 167, 0.15)' }}>{t('simplicity')}</h4>
          <h3 className='hrrbb-title' dangerouslySetInnerHTML={{ __html: t('simplicity-title') }}></h3>
          <p className='hrrbb-subtitle'>{t('simplicity-subtitle')}</p>
        </div>
      </div>

      <div id='hrr-pricing'>
        <div id='hrrp-head'>
          <h1 id='hrrph-title'>{t('pricing-title')}</h1>
          <h2 id='hrrph-subtitle'>{t('pricing-subtitle')}</h2>
        </div>

        <div id='hrr-body'>
          <div id='hrrb-element'>
            <div id='hrrbe-box'>
              <div id='hrrbeb-price'>
                <p id='hrrbebp-sign'>€</p>
                <p id='hrrbebp-number'>150<span style={{ fontSize: '.5em !important' }}>.00</span></p>
                <p id='hrrbebp-txt'>{t('announce')}</p>
              </div>

              <div id='hrrbeb-line'></div>

              <h3 id='hrrbeb-description'>{t('price-description')}</h3>

              <button id='hrrbeb-offer'>
                {t('postOffer')}
                <img id='hrrbebo-img' src={ArrowIcon} alt="post an announce" />
              </button>
            </div>
          </div>



          <div id='hrrb-list'>
            <div className='hrrbl-box'>
              <img className='hrrblb-img' src={ValidIcon} alt="list-icon"/>
              <div className='hrrblb-text'>
                <h2 className='hrrblbt-title'>{t('unlimitedCompanies-title')}</h2>
                <h4 className='hrrblbt-subtitle'>{t('unlimitedCompanies-subtitle')}</h4>
              </div>
            </div>

            <div className='hrrbl-box'>
              <img className='hrrblb-img' src={ValidIcon} alt="list-icon"/>
              <div className='hrrblb-text'>
                <h2 className='hrrblbt-title'>{t('unlimitedTime-title')}</h2>
                <h4 className='hrrblbt-subtitle'>{t('unlimitedTime-subtitle')}</h4>
              </div>
            </div>

            <div className='hrrbl-box'>
              <img className='hrrblb-img' src={ValidIcon} alt="list-icon"/>
              <div className='hrrblb-text'>
                <h2 className='hrrblbt-title'>{t('qualifiedCandidate-title')}</h2>
                <h4 className='hrrblbt-subtitle'>{t('qualifiedCandidate-subtitle')}</h4>
              </div>
            </div>

            <div className='hrrbl-box'>
              <img className='hrrblb-img' src={ValidIcon} alt="list-icon"/>
              <div className='hrrblb-text'>
                <h2 className='hrrblbt-title'>{t('noAdditionnalCost-title')}</h2>
                <h4 className='hrrblbt-subtitle'>{t('noAdditionnalCost-subtitle')}</h4>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};


// @export
export default withTranslation('common')(HomeRecruiter);