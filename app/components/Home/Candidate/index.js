// @module import
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router'


// @local import
import TribooSelect from '../../TribooSelect';
import { withTranslation } from '../../i18n';
import WaveImg0 from '../../../static/assets/wave_0.svg'
import WaveImg1 from '../../../static/assets/wave_1.svg'
import LocationIconGrey from '../../../static/assets/localization_icon_g.svg';
import ContractIconGrey from '../../../static/assets/contract_icon_g.svg';
import CompanyItem from '../../Companies/CompanyItem'
import { handleInputEmail } from '../../../utils/input';
import { subscribeToNewspaper } from '../../../utils/request/home'
import '../index.css'


// @component
const Home = ({ t, data }) => {
  // Triboo state.
  const [selectedTriboo, setSelectedTriboo] = useState('commercial');
  const { announces, companies } = data;
  const preFiltredAnnounces = announces.filter(item => item.triboo === selectedTriboo);
  const filtredAnnounces = preFiltredAnnounces.filter((item, index) => {
    if (process.browser) {
      if (window.innerWidth < 600) {
        if (index > 0)
          return false;
        else
          return true;
      }
      else if (window.innerWidth < 1000) {
        if (index > 1)
          return false;
        else
          return true;
      }
      else
        return true;
    }
    else
      return true;
  });

  const [email, setEmail] = useState('');
  const [emailState, setEmailState] = useState({ error: null, success: false, loading: false });
  const router = useRouter();
  const isUnmounted = useRef(false);

  const filtredCompanies = companies.filter((item, index) => {
    if (process.browser) {
      if (window.innerWidth < 700) {
        if (index > 1)
          return false;
        else
          return true;
      }
      else if (window.innerWidth < 1050) {
        if (index > 3)
          return false;
        else
          return true;
      }
      else
        return true;
    }
    else
      return true;
  })

  const contracts = [
    { value: 'internship', label: t('dsrCt.internship') },
    { value: 'cdd', label: t('dsrCt.cdd') },
    { value: 'cdi', label: t('dsrCt.cdi') },
    { value: 'contractor', label: t('dsrCt.contractor') }
  ]

  const wave1Element = useRef(null);
  const [waveStyle, setWaveStyle] = useState(0);

  const handleNewSubmit = async e => {
    e.preventDefault();

    if (!handleInputEmail(email)) {
      setEmailState({ error: 'invalidFormat', success: false, loading: false });
      return;
    }

    try {
      setEmailState({ error: null, success: false, loading: true });
      const res = await subscribeToNewspaper(email);
      
      if (res.status === 200) {
        const { status } = await res.json();

        if (!isUnmounted.current) {
          if (status === 'alreadyExist') 
            setEmailState({ error: 'alreadyExist', success: false, loading: false });
          if (status === 'invalidFormat')
            setEmailState({ error: 'invalidFormat', success: false, loading: false });
          if (status === 'success') {
            setEmailState({ error: null, success: true, loading: false });
            setEmail('');
          }
        }

      } else
        throw res.status;

    } catch (e) {
      console.log(e);
      if (!isUnmounted.current)
        setEmailState({ error: 500, success: false, loading: false });
    }

  }

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
        <h1 className='home--title'>{t('joinYourTriboo')}</h1>
        <TribooSelect size={ process.browser ? (window.innerWidth < 600 && window.innerWidth > 400 ? 'tiny' : 'small') : 'small' } updateTriboo={triboo => setSelectedTriboo(triboo)} selectedTriboo={selectedTriboo} isPublic />
        <div className='home-fb-announces'>
          {
            filtredAnnounces.map((item, index) => (
              <div key={index} className='home-fb-announces-item'>
                <div className='home-fb-announces-item-img'></div>
                <div className='home-fb-announces-item-box'>
                  <h4 className='home-fb-announces-item-box-title'>{ item.title }</h4>
                  <p className='home-fb-announces-item-box-desc'>{ item.description.length > 50 ? item.description.substring(0, 50) + '...' : item.description }</p>
                  <div className='home-fb-announces-item-box-info'>
                    <div className='home-fb-announces-item-box-info-b'>
                      <img src={LocationIconGrey} className='home-fb-announces-item-box-info-b-icon' />
                      <p className='home-fb-announces-item-box-info-b-text'>{ item.location }</p>
                    </div>

                    <div className='home-fb-announces-item-box-info-b'>
                      <p className='home-fb-announces-item-box-info-b-icon'>€</p>
                      <p className='home-fb-announces-item-box-info-b-text'>{ `${item.salary.min}k - ${item.salary.max}k` }</p>
                    </div>

                    <div className='home-fb-announces-item-box-info-b'>
                      <img src={ContractIconGrey} className='home-fb-announces-item-box-info-b-icon' style={{ width: '35px', height: '35px' }} />
                      <p className='home-fb-announces-item-box-info-b-text'>{ contracts.filter(contract => contract.value === item.contractType)[0].label }</p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          }
        </div>
        <button className='home-fb-btn' onClick={() => router.push('/jobs')}>{t('seeMoreAnnounces')}</button>
      </div>

      <img className='home-wave-image' src={WaveImg0} alt='wave-img' />

      <div className='home-sb'>
        <h1 className='home--title' id='title-sb'>{t('findYourClan')}</h1>
        <div className='home-sb-companies'>
          {
            filtredCompanies.map((item, index) =>
              <div key={index} style={{ margin: '10px', position: 'relative' }}>
                <CompanyItem data={item} />
              </div>
            )
          }
        </div>
        <button className='home-sb-btn' onClick={() => router.push('/companies')}>{t('discoverMoreClan')}</button>
      </div>


      <div className='home-tb'>
        <img className='home-wave-image' id='second-wave' src={WaveImg1} alt='wave-img' ref={wave1Element} style={{ top: `-${waveStyle - 2}px` }} />
        
        <div className='home-tb-inputb'>
          <h3 className='home-tb-label'>{t('subToNewsLabel')}</h3>
          <form className='home-tb-b' onSubmit={handleNewSubmit}>
            <input value={email} onChange={e => setEmail(e.target.value)} className='home-tb-b-input' type='email' placeholder={t('newsPh')} />
            <button className='home-tb-b-btn' type='submit' disabled={emailState.loading}>{t('subscribe')}</button>
          </form>
          {
            emailState.error === null ||
            <div className='home-tb-errormsg'>
              { emailState.error === 'invalidFormat' ? t('invalidEmailFormat') : null }
              { emailState.error === 'alreadyExist' ? t('alreadyEmailExist') : null}
              { emailState.error === 500 ? t('error500') : null}
            </div>
          }
          {
            !emailState.success || <div className='home-tb-successmsg'>{t('successNwsEmail')}</div>
          }
        </div>

        {/* <div className='home-tb-aboutb'>
          <hr className='home-tb-aboutb-hr' />
          <h3>lol</h3>
        </div> */}
      </div>
    </div>
  );
}


// @export
export default withTranslation('common')(Home);