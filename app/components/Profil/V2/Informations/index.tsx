// @module import
import React, { useState, useRef, useEffect, MutableRefObject, MouseEvent } from 'react';
import { WithTranslation } from 'next-i18next';
import { useCookies } from 'react-cookie';
import { useRouter } from 'next/router';


// @local import
import Lang from '../../../Navbar/LangButton';
import { withTranslation } from '../../../i18n';
import './index.css';
import Info from './Info';
import { getCandidateInfo } from '../../../../utils/request/informations'
import Loading from '../../../Loading';
import Qualifications from './Qualifications';
import Experiences from './Experiences';
import Skills from './Skills';
import Other from './Other';
import NavInside from '../../../Navbar/V2/Inside';


// @interface
interface ComponentProps extends WithTranslation {}


// @component
const Informations: (props: ComponentProps) => JSX.Element = ({ t }) => {

  const userInfoObject = {
    picture: '',
    firstname: '',
    lastname: '',
    birthdate: null,
    email: '',
    phone: '',
    description: '',
    qualifications: [],
    experiences: [],
    skills: [],
    job: '',
    expertiseLevel: '',
    desiredContract: '',
    legalAvailability: '',
    expectedSalary: '',
    publicId: ''
  }

  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [userInfo, setUserInfo] = useState(userInfoObject);

  const [cookies, _, removeCookies]       = useCookies();
  const router                            = useRouter();

  const isUnmounted: MutableRefObject<boolean> = useRef(false);


  // Get the candidate informations.
  const handleCandidateInformation = async () => {

    if (!isUnmounted.current) {
      setLoading(true);
      setError(false);
    }

    try {
      const response = await getCandidateInfo(cookies.token);

      if (response.status === 200) {
        const { data } = await response.json();
        setUserInfo({
          picture: data.picture,
          firstname: data.firstname,
          lastname: data.lastname,
          birthdate: data.birthdate,
          email: data.email,
          phone: data.phone,
          description: data.description,
          qualifications: data.qualifications,
          experiences: data.experiences,
          skills: data.skills,
          job: data.job,
          expertiseLevel: data.expertiseLevel,
          desiredContract: data.desiredContract,
          legalAvailability: data.legalAvailability,
          expectedSalary: data.expectedSalary,
          publicId: data.publicId
        });
        if (!isUnmounted.current) {
          setLoading(false);
          setError(false);
        }
      }
      else
        throw response.status;
    } catch (e) {
      console.log(e);
      if (!isUnmounted.current) {
        setLoading(false);
        setError('500');
      }
    }
  }

  const handleLogout = () => {
    removeCookies('token', { path: '/' });
    router.push('/');
  }

  useEffect(() => {
    // Initial fetch
    handleCandidateInformation();

    return () => { isUnmounted.current = true; };
  }, []);

  return (
    <div id='information-root'>
      {/* <div id='ir-nav'>
        <div id='irn-titles'>
          <h1 id='irnt-title'>{t('profil-information-title')}</h1>
          <h2 id='irnt-subtitle'>{t('profil-information-subtitle')}</h2>
        </div>

        <div id='irn-action'>
          <button id='irn-profil' disabled={loading} onClick={() => router.push(`/candidate/${userInfo.publicId}`)}>
            <p id='irnp-txt'>{t('seeMyProfil')}</p>
          </button>
          <Lang />
          <button id='irn-logout' onClick={handleLogout}>{t('logout')}</button>
        </div>
      </div> */}

      <NavInside title={t('profil-information-title')} subtitle={t('profil-information-subtitle')} actionBtn={{ name: t('seeMyProfil' ), action: (event: any) => { router.push(`/candidate/${userInfo.publicId}`) }, loading }} />

      {
        loading ?
        <Loading color='blue' size='big' /> :
        <div id='ir-boxes'>
          <div id='irb-left'>
            <Info
              data={{
                picture: userInfo.picture,
                firstname: userInfo.firstname,
                lastname: userInfo.lastname,
                birthdate: userInfo.birthdate,
                email: userInfo.email,
                phone: userInfo.phone,
                description: userInfo.description
              }}
              />
              <Other data={{
                job: userInfo.job,
                expertiseLevel: userInfo.expertiseLevel,
                desiredContract: userInfo.desiredContract,
                legalAvailability: userInfo.legalAvailability,
                expectedSalary: userInfo.expectedSalary
              }}/>
          </div>

          <div id='irb-right'>
            <Qualifications data={userInfo.qualifications} />
            <Experiences data={userInfo.experiences} />
            <Skills data={userInfo.skills} />
          </div>
        </div>
        }
    </div>
  );
}


// @export
export default withTranslation('common')(Informations);