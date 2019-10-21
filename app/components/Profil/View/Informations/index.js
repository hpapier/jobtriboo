// @module import
import { useState, useEffect, useRef } from 'react';


// @local import
import './index.css';
import { withTranslation } from '../../../i18n';
import { request } from '../../../../utils/request';
import { useCookies } from 'react-cookie';
import ProfilPicture from './ProfilPicture';
import Description from './Description';
import Qualification from './Qualification';
import Coordinates from './Coordinates';


// @component
const Informations = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(0);
  const [userData, setUserData] = useState();

  const [cookies, _, __] = useCookies();
  const componentIsMounted = useRef(true);



  const fetchUserData = async () => {
    try {
      const res = await request('/api/userInfo', { method: 'GET', headers: { 'Authorization': cookies.token }}  );
      const { data } = await res.json();
      console.log(data);

      if (componentIsMounted.current) {
        setUserData(data);
        setLoading(false);
      }
    } catch (e) {
      if (componentIsMounted.current) {
        setLoading(false);
        setError(500);
      }
    }
  }

  useEffect(() => {
    fetchUserData();
    return () => { componentIsMounted.current = false };
  }, []);

  return (
    <div>
      {
        loading ?
        <div>loading</div> :
        <div className='information-root'>
          <ProfilPicture link={userData.picture} updateLink={ndata => setUserData({ ...userData, picture: ndata })} />
          <Description data={userData.description} />
          <Coordinates
            data={{
              firstName: userData.firstName,
              lastName: userData.lastName,
              country: userData.country,
              age: userData.age,
              email: userData.email,
              prefix: userData.prefixPhoneNumber,
              phone: userData.phoneNumber
            }}
          />
          <Qualification
            data={{
              triboo: userData.triboo,
              jobName: userData.jobName,
              skills: userData.skills,
              studyLvl: userData.studyLvl,
              cv: userData.cv,
              desiredContract: userData.desiredContract,
              salaryExpected: userData.salaryExpected,
              availability: userData.availability
            }}
          />
        </div>
      }
    </div>
  );
};


// @export
export default withTranslation('common')(Informations);