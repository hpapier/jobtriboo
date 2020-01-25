// @module import
import React, { useState, useEffect, useRef, MutableRefObject } from 'react';
import { WithTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useCookies } from 'react-cookie';


// @local import
import './index.css';
import { withTranslation } from '../../../i18n';
import NavInside from '../../../Navbar/V2/Inside';
import Error from '../../../Error';
import { getRecruiterCompanies } from '../../../../utils/request/companies';
import Loading from '../../../Loading';
import Company from '../../../Companies/Item';


// @interface
interface ComponentProps extends WithTranslation {}


// @component
const Companies: (props: ComponentProps) => JSX.Element = ({ t }) => {

  // Information Component State.
  const [update, setUpdate]             = useState(null);
  const [newCompany, setNewCompany]     = useState(false);
  const [companies, setCompanies]       = useState([]);
  const [editLoading, setEditLoading]   = useState(null);


  // General Component State, Ref & Cookies management.
  const [fetchLoading, setFetchLoading]         = useState(true);
  const [genError, setGenError]                 = useState(null);
  const [cookies, _, __]                        = useCookies();
  const isUnmounted: MutableRefObject<boolean>  = useRef(false);


  // Companies fetching handler.
  const handleCompaniesFetching = async () => {
    if (!isUnmounted.current) {
      if (!fetchLoading) setFetchLoading(true);
      if (genError !== null) setGenError(null);
    }

    try {
      const response = await getRecruiterCompanies(cookies.token);
      if (response.status === 200) {
        const companiesData = await response.json();
        setCompanies(companiesData);

        if (!isUnmounted.current) {
          setFetchLoading(false);
          setGenError(null);
        }
      }
      else
        throw response;
    }
    catch (e) {
      console.log(e);
      if (!isUnmounted.current) {
        setFetchLoading(false);
        setGenError('500');
      }
    }
  }


  // Add a company mechanism.
  const addCompany = (data) => {
    setCompanies([ ...companies, data ]);
  }


  // Update a company mechanism.
  const updateCompany = (data) => {
    let updatedCompanies = [ ...companies ];
    let indexCompany = 0;

    updatedCompanies.forEach((item, index) => {
      if (item._id === data._id)
        indexCompany = index;
    });

    updatedCompanies[indexCompany] = data;
    setCompanies([ ...updatedCompanies ]);
  }


  // Remove a company mechanism.
  const removeCompany = (id: string) => {
    setCompanies([ ...companies.filter(item => item._id !== id) ]);
  }


  // Didmount & Unmount component handling.
  useEffect(() => {
    handleCompaniesFetching();
    return () => { isUnmounted.current = true };
  }, []);


  // Rendering function.
  return (
    <div id='company-root'>
      <NavInside
        title={t('companies')}
        subtitle={`<p id='cnir-subtitle-number'>${companies.length}</p> ${t(companies.length > 1 ? 'companiesFound' : 'companyFound')}`}
        actionBtn={{ name: t('createCompanies'), action: () => { setNewCompany(true) }, loading: fetchLoading }}
      />

      <div id='cr-items'>
        {
          fetchLoading ?
          <Loading color='blue' size='medium' /> :
          null
        }

        {
          newCompany ?
          <Company data={null} editable={{ current: 'new', validation: addCompany, cancel: () => setNewCompany(false), remove: removeCompany, fetchLoading: editLoading }} /> :
          null
        }

        { companies.length === 0 && !newCompany && !fetchLoading ? <div className='cri-nocompany'>{t('noCompanyYet')}</div> : null }

        { companies.map(item => <Company key={item._id} data={item} editable={{ current: update, validation: updateCompany, remove: removeCompany, cancel: () => setUpdate(null), fetchLoading: editLoading }} />)}

        { genError !== null ? <Error errorValue={genError} errorMessages={{ '500': t('error500') }} margin='10px auto' /> : null }
      </div>
    </div>
  );
}


// @export
export default withTranslation('common')(Companies);