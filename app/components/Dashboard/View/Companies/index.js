// @module import
import { useEffect, useRef, useState } from 'react';
import { useCookies } from 'react-cookie';


// @local import
import { getRecruiterCompanies } from '../../../../utils/request/companies';
import { withTranslation } from '../../../i18n';
import CompanyItem from './CompanyItem';
import NewCompany from './NewCompany';
import './index.css';


// @component
const Companies = ({ t }) => {
  const isUnmounted = useRef(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [cookies, _, __] = useCookies();
  const [vstate, setvstate] = useState('companies'); 

  const fetchCompanies = async () => {
    if (!isUnmounted.current)
      setLoading(true);

    try {
      const res = await getRecruiterCompanies(cookies.token);
      if (res.status === 200) {
        const rdata = await res.json();
        if (!isUnmounted.current) {
          setLoading(false);
          setCompanies(rdata);
        }
      }
      else
        throw res.status;
    } catch (e) {
      console.log(e);
      if (!isUnmounted.current) {
        setLoading(false);
        setError(true);
      }
    }
  };

  useEffect(() => {
    fetchCompanies();
    return () => { isUnmounted.current = true };
  }, []);

  const handleView = () => {
    if (error)
      return <div>Error</div>;
    else if (loading)
      return <div>Loading</div>;
    else
      return (
        <div>
          { companies.length === 0 ? 
            t('noCompaniesYet') :
            companies.map((item, index) => <CompanyItem data={item} key={index} />)
          }
        </div>
      );
  }

  return (
    <div className='companies-root'>
      {
        vstate === 'companies' ?
        <div>
          <h2 className='companies-root-title'>{t('myCompanies')} ({companies.length})</h2>
          <button onClick={() => setvstate('new-company')}>{t('createCompanies')}</button>
          {handleView()}
        </div> : null
      }

      {
        vstate === 'new-company' ?
        <div>
          <h2 className='companies-root-title'>{t('newCompany')}</h2>
          <NewCompany closeWindow={() => setvstate('companies')} />
        </div> :
        null
      }
    </div>
  );
}


// @export
export default withTranslation('common')(Companies);