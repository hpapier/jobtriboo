// @module import
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router'


// @local import
import { withTranslation } from '../../i18n';
import WaveImg0 from '../../../static/assets/wave_0.svg'
import WaveImg1 from '../../../static/assets/wave_1.svg'
import LocationIconGrey from '../../../static/assets/localization_icon_g.svg';
import ContractIconGrey from '../../../static/assets/contract_icon_g.svg';
import Footer from '../Footer';
import '../index.css'
import './index.css'


// @component
const Home = ({ t, data }) => {
  const { candidates } = data;
  const filtredCandidates = candidates.filter((item, index) => {
    if (process.browser) {
      if (window.innerWidth < 450) {
        if (index > 0)
          return false;
        return true;
      }
      if (window.innerWidth < 700) {
        if (index > 1)
          return false;
        return true;
      }
      return true;
    }
    return true;
  });

  const router = useRouter();
  const isUnmounted = useRef(false);

  const contracts = [
    { value: 'internship', label: t('dsrCt.internship') },
    { value: 'cdd', label: t('dsrCt.cdd') },
    { value: 'cdi', label: t('dsrCt.cdi') },
    { value: 'contractor', label: t('dsrCt.contractor') }
  ]

  const wave1Element = useRef(null);
  const [waveStyle, setWaveStyle] = useState(0);


  useEffect(() => {
    setWaveStyle(wave1Element.current ? wave1Element.current.height : 0);

    window.addEventListener('resize', e => {
      if (!isUnmounted.current)
        setWaveStyle(wave1Element.current ? wave1Element.current.height : 0);
    });

    return () => {
      window.removeEventListener('resize', () => console.log('removed'));
      isUnmounted.current = true;
    }
  }, [])



  return (
    <div className='home-root'>
      <div className='home-fb'>
        <h1 className='home--title'>{t('growthYourClan')}</h1>
        <h4 className='home-recruiter-subtitle'>{t('descrRecruiterPage')}</h4>
        <div className='home-fb-announces'>
          {
            filtredCandidates.map((item, index) => (
              <div key={index} className='home-fb-announces-item'>
                <div className='home-fb-announces-item-img'></div>
                <div className='home-fb-announces-item-box'>
                  <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', margin: '25px 0px 0px 0px' }}>
                    <h4 className='home-fb-announces-item-box-title' style={{ margin: '0px' }}>{ item.firstName }</h4>
                    <div className='home-fb-announces-item-box-info-b' style={{ padding: '5px 10px', margin: '0px 0px 0px 10px', height: '25px', boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.05)' }}>
                      <p className='home-fb-announces-item-box-info-b-text' style={{ margin: 0 }}>{ item.jobName }</p>
                    </div>
                  </div>
                  <p className='home-fb-announces-item-box-desc'>{ item.description.length > 50 ? item.description.substring(0, 50) + '...' : item.description }</p>
                  <div className='home-fb-announces-item-box-info'>
                    <div className='home-fb-announces-item-box-info-b'>
                      <img src={LocationIconGrey} className='home-fb-announces-item-box-info-b-icon' />
                      <p className='home-fb-announces-item-box-info-b-text'>{ item.country }</p>
                    </div>

                    <div className='home-fb-announces-item-box-info-b' style={{ paddingLeft: '5px' }}>
                      <img src={ContractIconGrey} className='home-fb-announces-item-box-info-b-icon' style={{ width: '35px', height: '35px' }} />
                      <p className='home-fb-announces-item-box-info-b-text'>{ contracts.filter(contract => contract.value === item.desiredContract)[0].label }</p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          }
        </div>
        <button className='home-fb-btn' onClick={() => router.push('/signup')}>{t('openRecruiterAccount')}</button>
      </div>

      <img className='home-wave-image' src={WaveImg0} alt='wave-img' />

      <div className='home-sb'>
        <h1 className='home--title' id='title-sb'>{t('pricing')}</h1>
        <div className='home-recruiter-sb-pricingb'>
          <h3 className='home-recruiter-sb-pricingb-label'>{t('basicPricing')}</h3>
          <h2 className='home-recruiter-sb-pricingb-priceTxt'>500€</h2>

          <div className='home-recruiter-sb-pricingb-offerbox'>
            <p className='home-recruiter-sb-pricingb-offertxt'>{t('pricingOfferDuration')}</p>
            <p className='home-recruiter-sb-pricingb-offertxt'>{t('pricingOfferQualifiedCandidate')}</p>
            <p className='home-recruiter-sb-pricingb-offertxt'>{t('pricingOfferMatchingPerso')}</p>
            <p className='home-recruiter-sb-pricingb-offertxt'>{t('pricingOfferNoMoreFees')}</p>
          </div>
          <button className='home-recruiter-sb-pricing-btn' onClick={() => router.push('/signup')}>{t('postAnAnnounce')}</button>
        </div>
      </div>


      <div className='home-tb'>
        <img className='home-wave-image' id='second-wave' src={WaveImg1} alt='wave-img' ref={wave1Element} style={{ top: `-${waveStyle - 2}px` }} />
        <Footer />
      </div>
    </div>
  );
}


// @export
export default withTranslation('common')(Home);