// @module import
import { useEffect, useRef, useState } from 'react';
import { useCookies } from 'react-cookie';


// @local import
import { getRecruiterCompanies } from '../../../../utils/request/companies';
import { withTranslation } from '../../../i18n';
import CompanyItem from './CompanyItem';
import NewCompany from './NewCompany';
import AddIconGrey from '../../../../static/assets/remove_icon_grey.svg'
import './index.css';


// @component
const Companies = ({ t }) => {
  const isUnmounted = useRef(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [cookies, _, __] = useCookies();
  const [vstate, setvstate] = useState('companies');
  const [up, setUp] = useState(false);

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
    isUnmounted.current = false;
    fetchCompanies();
    return () => { isUnmounted.current = true };
  }, [up]);

  const handleView = () => {
    if (error)
      return <div className='companies-error'>{t('error500')}</div>;
    else if (loading)
      return <div className='companies-loading'></div>;
    else
      return (
        <div>
          { companies.length === 0 ?
            <div className='companies-empty'>{t('noCompaniesYet')}</div> :
            companies.map((item, index) => <CompanyItem updateCompaniesList={ndata => setCompanies(ndata)} data={item} key={index} />)
          }
        </div>
      );
  }

  return (
    <div className='companies-root'>
      {
        vstate === 'companies' ?
        <div className='companies-list-box'>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <h2 className='companies-root-title'>{t('myCompanies')} ({companies.length})</h2>
            <button className='companies-create-btn' onClick={() => setvstate('new-company')}>
              {t('createCompanies')}
              <img src={AddIconGrey} className='companies-create-btn-icon' alt='plus-icon' />
            </button>
          </div>
          {handleView()}
        </div> : null
      }

      {
        vstate === 'new-company' ?
        <div className='companies-list-box'>
          <h2 className='companies-root-title'>{t('newCompany')}</h2>
          <NewCompany closeWindow={() => {
              setUp(!up);
              setvstate('companies')
            }}
          />
        </div> :
        null
      }
    </div>
  );
}


// @export
export default withTranslation('common')(Companies);