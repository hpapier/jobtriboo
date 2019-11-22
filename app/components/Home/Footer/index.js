// @module import
import { useState } from 'react';


// @local import
import './index.css';
import { withTranslation } from '../../i18n';
import { handleInputEmail } from '../../../utils/input';
import { subscribeToNewspaper } from '../../../utils/request/home'


// @component
const Footer = ({ t }) => {

  const [email, setEmail] = useState('');
  const [emailState, setEmailState] = useState({ error: null, success: false, loading: false });

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

  return (
    <>
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
    </>
  );
}



// @export
export default withTranslation('common')(Footer);