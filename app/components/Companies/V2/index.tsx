// @module import
import { useEffect, useState, useRef, MouseEvent } from 'react';
import { useRouter } from 'next/router';
import { WithTranslation } from 'next-i18next';


// @local import
import './index.css';
import Company from '../Item';
import { withTranslation } from '../../i18n';
import { getListValues } from '../../../utils/listValues';
import Checkbox from '../../CheckBox';
import Loading from '../../Loading';
import Input from '../../Form/Input';
import Error from '../../Error';
import { getCompanies } from '../../../utils/request/companies';
import { CompanyProps } from '../../../types/company';

const ArrowDownIcon = require('../../../static/assets/bottom_arrow_icon.svg') as string;


// @interface
interface JobsProps extends WithTranslation {
  count: number,
  companies: Array<CompanyProps>
}


// @component
const Companies = ({ count, companies, t }: JobsProps): JSX.Element => {

  // Information state management
  const [companyName, setCompanyName]         = useState<string>('');
  const [companyLocation, setCompanyLocation] = useState<string>('');
  const [categories, setCategories]           = useState<Array<string>>([]);
  const [employeeNumber, setEmployeeNumber]  = useState<Array<string>>([]);
  const [companiesData, setCompaniesData]     = useState<Array<CompanyProps>>(companies);
  const [companiesCount, setCompaniesCount]   = useState<number>(count);
  const [expanded, setExpanded]               = useState<boolean>(true);


  // General state management.
  const [fetchMoreLoading, setFetchMoreLoading] = useState<boolean>(false);
  const [fetchLoading, setFetchLoading]         = useState<boolean>(false);
  const [genError, setGenError]                 = useState<string | null>(null);
  const isUnmounted                             = useRef<boolean>(false);
  const router                                  = useRouter();
  const refData                                 = useRef({ companyName, companyLocation, categories, employeeNumber, offset: companiesData.length, fetchMoreLoading, fetchLoading, expanded, count: companiesCount });


  // Handle the request mechanism.
  const handleRefetching = async (type: string, data = null) => {

    if (data !== null) {
      if (data.fetchLoading || data.fetchMoreLoading)
        return;
      else if (data.count === data.offset)
        return;
    }
    else if (fetchLoading || fetchMoreLoading)
      return;

    if (!isUnmounted.current) {
      if (type === 'more') setFetchMoreLoading(true);
      if (type === 'new') setFetchLoading(true);
      setGenError(null);
    }

    try {
      console.log('fetch');
      let dataQuery = null ;
      if (data !== null)
        dataQuery = { companyName: data.companyName, companyLocation: data.companyLocation, offset: data.offset, categories: data.categories, size: data.size };
      else
        dataQuery = { companyName, companyLocation, offset: 0, categories, size: employeeNumber };

      let companiesResponse: Response = await getCompanies(dataQuery);
      if (companiesResponse.status === 200) {
        const { count, data } = await companiesResponse.json();
        if (!isUnmounted.current) {
          setCompaniesData(type === 'more' ? [...companiesData, ...data ] : [ ...data ]);
          setCompaniesCount(count);
          if (type === 'more') setFetchMoreLoading(false);
          if (type === 'new') setFetchLoading(false);
          setGenError(null);
        }
      }
      else
        throw companiesResponse;
    }
    catch (e) {
      console.log(e);
      if (!isUnmounted.current) {
        if (type === 'more') setFetchMoreLoading(false);
        if (type === 'new') setFetchLoading(false);
        setGenError('500');
      }
    }
  };


  // Add or remove a category
  const setCategoryValue = (category: string) => {
    const check: Array<string> = categories.filter(item => category === item);

    if (fetchLoading || fetchMoreLoading)
      return;

    if (check.length === 1)
      setCategories([ ...categories.filter(item => category !== item) ]);
    else
      setCategories([ ...categories, category ]);
  }


  // Add or remove a contract type
  const setEmployeeNumberValue = (value: string) => {
    const check: Array<string> = employeeNumber.filter(item => value === item);

    if (fetchLoading || fetchMoreLoading)
      return;

    if (check.length === 1)
      setEmployeeNumber([ ...employeeNumber.filter(item => value !== item) ]);
    else
      setEmployeeNumber([ ...employeeNumber, value ]);
  }


  // Component Didmount/Unmount function.
  useEffect(() => {

    window.addEventListener('scroll', (e) => {
      if (document.body.clientHeight - window.scrollY <= (window.innerHeight + 50))
        if (!isUnmounted.current) handleRefetching('more', refData.current);
    });

    window.addEventListener('resize', (e) => {
      if (window.innerWidth >= 900 && !refData.current.expanded)
        if (!isUnmounted.current) setExpanded(true);
    });

    return () => {
      isUnmounted.current = true;
      window.removeEventListener('scroll', () => {});
      window.removeEventListener('resize', () => {});
    };
  }, []);


  // Refetch when a box is checked.
  useEffect(() => {
    handleRefetching('new');
  }, [categories, employeeNumber]);


  // Update de reference data for the listeners.
  useEffect(() => {
    refData.current = { companyName, companyLocation, categories, employeeNumber, offset: companiesData.length, count: companiesCount, fetchMoreLoading, fetchLoading, expanded };
  })


  // Rendering function.
  return (
    <div id='component-companies-page-root'>

      <div id='ccpr-head'>
        <h3 id='ccprh-jbtitle'>{t('findYourClan')}</h3>

        <div id='ccprh-inputs'>
          <div className='ccprhi-input'>
            <h3 className='ccprhii-title'>{t('companyName')}</h3>
            <input className='ccprhii-element' placeholder={t('whichCompanyPlaceholder')} type="text" onChange={e => setCompanyName(e.target.value)} value={companyName} />
          </div>
          <div className='ccprhi-input'>
            <h3 className='ccprhii-title'>{t('location')}</h3>
            <input className='ccprhii-element' placeholder={t('wherePlaceholder')} type="text" onChange={e => setCompanyLocation(e.target.value)} value={companyLocation}/>
          </div>
          <button id='ccprhi-btn' onClick={() => handleRefetching('new')}>{t('search')}</button>
        </div>
      </div>

      <div id='ccpr-body'>
        <div id='ccprb-filters'>
          <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start'}} >
            <h3 className='ccprb-subtitle'>{t('filters')}</h3>
            <button className='ccprb-expand-btn' onClick={() => setExpanded(!expanded)}>
              <img src={ArrowDownIcon} alt='expand-icon' style={{ transform: expanded ? 'rotate(0deg)' : 'rotate(180deg)' }}/>
            </button>
          </div>
          <div className='ccprbf-box' style={{ display: expanded ? 'flex' : 'none' }}>
            <h5 className='ccprbfb-title'>{t('category')}</h5>
            {
              getListValues(t, 'category')
                .map((item: { value: string, label: string }, index: number) =>
                  <div className='ccprbfb-cb' key={index}>
                    <Checkbox
                      label={item.label}
                      check={() => setCategoryValue(item.value)}
                      isChecked={categories.filter((el: string) => el === item.value).length === 1}
                      defaultChecked={false}
                    />
                  </div>
              )
            }
          </div>

          <div className='ccprbf-box' style={{ display: expanded ? 'flex' : 'none' }}>
            <h5 className='ccprbfb-title'>{t('contractType')}</h5>
            {
              getListValues(t, 'employeeNb')
                .map((item: { value: string, label: string }, index: number) =>
                  <div className='ccprbfb-cb --ccprbfb-cb-employeeNb' key={index}>
                    <Checkbox
                      label={item.label}
                      check={() => setEmployeeNumberValue(item.value)}
                      isChecked={employeeNumber.filter((el: string) => el === item.value).length === 1}
                      defaultChecked={false}
                    />
                  </div>
              )
            }
          </div>
        </div>

        <div id='ccprb-announces'>
          <h3 className='ccprb-subtitle'>
            <span style={{ color: '#246BF8' }}>{companiesCount}</span> {companiesCount > 1 ? t('results') : t('result')}
          </h3>
          { fetchLoading ? <Loading color='blue' size='medium' /> : companiesData.map((item, index) => <Company key={index} data={item} onClickFn={() => router.push('/companies/' + item.name)} />) }
          { companiesCount === 0 && genError === null && !fetchLoading ? <div className='ccprba-no-announce-found'>{t('noCompaniesFound')}</div> : null }
          <div style={{ height: '50px', margin: '0px auto' }}>{ fetchMoreLoading && <Loading color='blue' size='small' /> }</div>
          { genError !== null ? <Error margin='10px auto' errorValue={genError} errorMessages={{ '500': t('error500')}} /> : null }
        </div>
      </div>

    </div>
  );
}


// @export
export default withTranslation('common')(Companies);