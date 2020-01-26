// @module import
import React, { useState } from 'react';
import { WithTranslation } from 'next-i18next';
import { useRouter } from 'next/router';


// @local import
import { withTranslation } from '../../../i18n';
import './index.css';
// import IllustrationCandidate from '../../../../static/img/illustration-candidate.svg';


const IllustrationCandidate = require('../../../../static/img/illustration-candidate.svg') as string;

interface AppProps extends WithTranslation {
  job: number,
  company: number,
  query: Object
}


// @component
const HomeCandidate = ({ t, job, company }: AppProps) => {

  // State management.
  const [jobTitle, setJobTitle]       = useState<string>('');
  const [jobLocation, setJobLocation] = useState<string>('');
  const router = useRouter();


  // Handle the search action.
  const handleJobSearch = () => {
    router.push(`/jobs${(jobTitle !== '' || jobLocation !== '') ? `?` : ``}${jobTitle !== '' ? `jobTitle=${jobTitle}` : ``}${jobTitle !== '' && jobLocation !== '' ? `&` : ``}${jobLocation !== '' ? `jobLocation=${jobLocation}` : ``}`);
  }


  // Rendering function.
  return (
    <div id='home-candidate-root'>

      <div id='hcr-presentation'>
        <div id='hcrp-txt'>
          <div>
            <h1 className='home-candidate-title'>{t('joinYourTribooTitle')}</h1>
            <h2 className='home-candidate-subtitle'>{t('joinYourTribooDescription')}</h2>

            <div id='hcrpt-statsbar'>
              {/* <div className='hcrpt-stats'>
                <p className='home-candidate-stats'>{job}</p>
                <p className='home-candidate-stats-title'>{t('jobsAvailable')}</p>
              </div>

              <div className='hcrpt-stats'>
                <p className='home-candidate-stats'>{company}</p>
                <p className='home-candidate-stats-title'>{t('companiesAvailable')}</p>
              </div> */}
            </div>
          </div>
        </div>

        <div id='hcrp-img'>
          <img id='hcrp-img-element' src={IllustrationCandidate} alt='find-job' />
        </div>
      </div>

      <div id='hcr-input'>
        <div className='hcri-box'>
          <h4 className='hcrib-title'>{t('what')}</h4>
          <p className='hcrib-subtitle'>{t('whatSubtitle')}</p>
          <input className='hcrib-input' placeholder={t('whatPlaceholder')} onChange={e => setJobTitle(e.target.value)} value={jobTitle} />
        </div>

        <div className='hcri-box'>
          <h4 className='hcrib-title'>{t('where')}</h4>
          <p className='hcrib-subtitle'>{t('whereSubtitle')}</p>
          <input className='hcrib-input' placeholder={t('wherePlaceholder')} onChange={e => setJobLocation(e.target.value)} value={jobLocation} />
        </div>

        <button id='hcri-btn' type='button' onClick={handleJobSearch}>{t('search')}</button>
      </div>
    </div>
  );
}


// @export
export default withTranslation('common')(HomeCandidate);