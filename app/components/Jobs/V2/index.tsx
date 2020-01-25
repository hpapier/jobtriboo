// @module import
import { useEffect, useState, useRef, MouseEvent } from 'react';
import { useRouter } from 'next/router';
import { WithTranslation } from 'next-i18next';


// @local import
import './index.css';
import AnnounceItem from '../../Dashboard/V2/Announces/Item';
import { withTranslation } from '../../i18n';
import { AnnounceProps } from '../../../types/announce';
import { getJobs } from '../../../utils/request/jobs';
import { getListValues } from '../../../utils/listValues';
import Checkbox from '../../CheckBox';
import Loading from '../../Loading';
import Input from '../../Form/Input';
import Error from '../../Error';

const ArrowDownIcon = require('../../../static/assets/bottom_arrow_icon.svg') as string;


// @interface
interface JobsProps extends WithTranslation {
  count: number,
  offers: Array<AnnounceProps>,
  initialQueries: {
    jobTitle: string | null,
    jobLocation: string | null
  }
}


// @component
const Jobs = ({ count, offers, initialQueries, t }: JobsProps): JSX.Element => {

  // Information state management
  const [jobTitle, setJobtitle]       = useState<string>(initialQueries.jobTitle === null ? '' : initialQueries.jobTitle);
  const [jobLocation, setJoblocation] = useState<string>(initialQueries.jobLocation === null ? '' : initialQueries.jobLocation);
  // const [offset, setOffset]           = useState<number>(0);
  const [categories, setCategories]   = useState<Array<string>>([]);
  const [contracts, setContracts]     = useState<Array<string>>([]);
  const [minSalary, setMinSalary]     = useState<string>('');
  const [offersData, setOffersData]   = useState<Array<AnnounceProps>>(offers);
  const [offersCount, setOffersCount] = useState<number>(count);
  const [expanded, setExpanded]       = useState<boolean>(true);


  // General state management.
  const [fetchMoreLoading, setFetchMoreLoading] = useState<boolean>(false);
  const [fetchLoading, setFetchLoading]         = useState<boolean>(false);
  const [genError, setGenError]                 = useState<string | null>(null);
  const isUnmounted                             = useRef<boolean>(false);
  const router                                  = useRouter();
  const refData                                 = useRef({ jobTitle, contracts, categories, jobLocation, minSalary, offset: offersData.length, fetchMoreLoading, fetchLoading, expanded, count: offersCount });


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
      // console.log('fetch');
      let dataQuery = null ;
      if (data !== null)
        dataQuery = { jobtitle: data.jobTitle, location: data.jobLocation, offset: data.offset, categories: data.categories, salaryMin: data.minSalary === '' ? 0 : parseInt(data.minSalary), contractsType: data.contracts };
      else
        dataQuery = { jobtitle: jobTitle, location: jobLocation, offset: 0, categories, salaryMin: minSalary === '' ? 0 : parseInt(minSalary), contractsType: contracts }

      let offersResponse: Response = await getJobs(dataQuery);
      if (offersResponse.status === 200) {
        const { count, announces } = await offersResponse.json();
        if (!isUnmounted.current) {
          setOffersData(type === 'more' ? [...offersData, ...announces ] : [ ...announces ]);
          setOffersCount(count);
          if (type === 'more') setFetchMoreLoading(false);
          if (type === 'new') setFetchLoading(false);
          setGenError(null);
        }
      }
      else
        throw offersResponse;
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
  const setContractsValue = (contract: string) => {
    const check: Array<string> = contracts.filter(item => contract === item);

    if (fetchLoading || fetchMoreLoading)
      return;

    if (check.length === 1)
      setContracts([ ...contracts.filter(item => contract !== item) ]);
    else
      setContracts([ ...contracts, contract ]);
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
  }, [categories, contracts]);


  // Update de reference data for the listeners.
  useEffect(() => {
    refData.current = { jobTitle, contracts, categories, jobLocation, minSalary, offset: offersData.length, count: offersCount, fetchMoreLoading, fetchLoading, expanded };
  })


  // Rendering function.
  return (
    <div id='component-jobs-page-root'>

      <div id='cjpr-head'>
        <h3 id='cjprh-jbtitle'>{t('joinYourTriboo')}</h3>

        <div id='cjprh-inputs'>
          <div className='cjprhi-input'>
            <h3 className='cjprhii-title'>{t('jobTitle')}</h3>
            <input className='cjprhii-element' placeholder={t('whatPlaceholder')} type="text" onChange={e => setJobtitle(e.target.value)} value={jobTitle} />
          </div>
          <div className='cjprhi-input'>
            <h3 className='cjprhii-title'>{t('location')}</h3>
            <input className='cjprhii-element' placeholder={t('wherePlaceholder')} type="text" onChange={e => setJoblocation(e.target.value)} value={jobLocation}/>
          </div>
          <button id='cjprhi-btn' onClick={() => handleRefetching('new')}>{t('search')}</button>
        </div>
      </div>

      <div id='cjpr-body'>
        <div id='cjprb-filters'>
          <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start'}} >
            <h3 className='cjprb-subtitle'>{t('filters')}</h3>
            <button className='cjprb-expand-btn' onClick={() => setExpanded(!expanded)}>
              <img src={ArrowDownIcon} alt='expand-icon' style={{ transform: expanded ? 'rotate(0deg)' : 'rotate(180deg)' }}/>
            </button>
          </div>
          <div className='cjprbf-box' style={{ display: expanded ? 'flex' : 'none' }}>
            <h5 className='cjprbfb-title'>{t('category')}</h5>
            {
              getListValues(t, 'category')
                .map((item: { value: string, label: string }, index: number) =>
                  <div className='cjprbfb-cb' key={index}>
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

          <div className='cjprbf-box' style={{ display: expanded ? 'flex' : 'none' }}>
            <h5 className='cjprbfb-title'>{t('contractType')}</h5>
            {
              getListValues(t, 'contractType')
                .map((item: { value: string, label: string }, index: number) =>
                  <div className='cjprbfb-cb' key={index}>
                    <Checkbox
                      label={item.label}
                      check={() => setContractsValue(item.value)}
                      isChecked={contracts.filter((el: string) => el === item.value).length === 1}
                      defaultChecked={false}
                    />
                  </div>
              )
            }
          </div>

          <div className='cjprbf-box' style={{ display: expanded ? 'flex' : 'none' }}>
            {/* <h5 className='cjprbfb-title'>{t('contractType')}</h5> */}
            <Input
              label={t('minSalary')}
              placeholder={('phMinSalary')}
              type='text'
              changeFn={(n: string) => setMinSalary((n.match(/^\d+$/) !== null || n === '' ? n : minSalary))}
              value={minSalary}
              autocomplete='off'
              margin='10px auto'
              error={false}
              errorMessages={{}}
              errorValue={null}
              onBlurFn={() => handleRefetching('new')}
              disabled={fetchLoading || fetchMoreLoading}
            />
          </div>
        </div>

        <div id='cjprb-announces'>
          <h3 className='cjprb-subtitle'>
            <span style={{ color: '#246BF8' }}>{offersCount}</span> {offersCount > 1 ? t('results') : t('result')}
          </h3>
          { fetchLoading ? <Loading color='blue' size='medium' /> : offersData.map((item, index) => <AnnounceItem key={index} data={item} type='public' clickFn={() => router.push('/jobs/' + item.publicId)} />) }
          { offersCount === 0 && genError === null && !fetchLoading ? <div className='cjprba-no-announce-found'>{t('noAnnounceFound')}</div> : null }
          <div style={{ height: '50px', margin: '0px auto' }}>{ fetchMoreLoading && <Loading color='blue' size='small' /> }</div>
          { genError !== null ? <Error margin='10px auto' errorValue={genError} errorMessages={{ '500': t('error500' )}} /> : null }
        </div>
      </div>

    </div>
  );
}


// @export
export default withTranslation('common')(Jobs);