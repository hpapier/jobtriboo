// @module import
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router'


// @local import
import './index.css'
import { withTranslation } from '../i18n';
import SearchIconGrey from '../../static/assets/search_icon_grey.svg';
import LocationIconGrey from '../../static/assets/localization_icon_g.svg';
import DropdownIconGrey from '../../static/assets/bottom_arrow_icon.svg';
import RemoveIconGrey from '../../static/assets/remove_icon_grey.svg';
import TribooSelect from '../TribooSelect';
import CheckBox from '../CheckBox';
import AnnounceItem from '../Dashboard/View/Announces/AnnounceItem'
import { getJobs } from '../../utils/request/jobs';


// @component
const JobsComponent = ({ t, data }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const isUnmounted = useRef(false);
  const [jobs, setJobs] = useState(data.announces);
  const [count, setCount] = useState(data.count);
  const [offset, setOffset] = useState(0);


  /* Search State */
  const [search, setSearch] = useState('');


  /* Triboo State */
  const [tribooMenuOpened, setTribooMenuOpened] = useState(false);
  const [tribooSelected, setTribooSelected] = useState('');


  /* Contract State */
  const [contractMenuOpened, setContractMenuOpened] = useState(false);
  // const [contractSelected, setContractSelected] = useState(false);
  const contracts = [
    { value: 'internship', label: t('dsrCt.internship') },
    { value: 'cdd', label: t('dsrCt.cdd') },
    { value: 'cdi', label: t('dsrCt.cdi') },
    { value: 'contractor', label: t('dsrCt.contractor') }
  ];
  const [contractCheckBox, setContractCheckBox] = useState({
    internship: false,
    cdd: false,
    cdi: false,
    contractor: false
  });


  /* Location State */
  const [locationMenuOpened, setLocationMenuOpened] = useState(false);
  const [location, setLocation] = useState('');
  const [locationList, setLocationList] = useState([]);


  /* Salary State */
  const [salaryMenuOpened, setSalaryMenuOpened] = useState(false);
  const [salary, setSalary] = useState({ min: 15, max: 100 });


  /* Handle the menu change */
  const handleMenu = (value, fn)=> {
    setTribooMenuOpened(false);
    setContractMenuOpened(false);
    setLocationMenuOpened(false);
    setSalaryMenuOpened(false);

    fn(value)
  }


  const handleLocationSubmit = e => {
    e.preventDefault();
    if (locationList.filter(item => item === location).length !== 0)
      return;

    handleUpdateMechanism({ ...qdata, location: [...locationList, location] }, null, () => null);
    setLocationList([...locationList, location]);
    setLocation('');
  }


  const handleDeleteLocation = value => {
    const newLocation = locationList.filter(item => item !== value);
    handleUpdateMechanism({ ...qdata, location: newLocation }, null, () => null);
    setLocationList(newLocation);
  }


  /* Fetch jobs with the new conditions. */
  const handleUpdateMechanism = async (qdata, ndata, fn, add = false) => {
    if (!isUnmounted.current) {
      if (!add) {
        fn(ndata);
        setLoading(true);
        setError(false);
      }
    }

    try {
      const res = await getJobs(qdata);
      if (res.status === 200) {
        const rdata = await res.json();
        if (!isUnmounted.current) {
          if (add) {
            if (rdata.announces > 0) {
              setJobs([...jobs, ...rdata.announces]);
              setCount(rdata.count + count);
            }
          } else {
            setJobs(rdata.announces);
            setCount(rdata.count);
          }

          // setCount(rdata.count);
          setLoading(false);
          setError(false);
        }
      } else
        throw res.status;

    } catch (e) {
      console.log(e);
      if (!isUnmounted.current) {
        setLoading(false)
        setError(true);
      }
    }
  }

  const handleSearch = (qdata, inputValue) => {
    handleUpdateMechanism({ ...qdata, search: inputValue }, null, () => null);
    setSearch(inputValue);
  }
  
  const qdata = { offset, search: '', triboo: tribooSelected, contractsType: contractCheckBox, location: locationList, salary };

  useEffect(() => {
    window.addEventListener('scroll', (e) => {
      // console.log(e)
      // console.log(window.innerHeight + window.outerHeight)
      if ((document.body.clientHeight - window.scrollY) === window.innerHeight) {
        handleUpdateMechanism({ ...qdata, offset: jobs.length + 20 }, null, () => null, true);
        // if (!isUnmounted.current)
        //   setOffset(offset + 20);
      }
    }); 
    return () => {
      isUnmounted.current = true
      window.removeEventListener('scroll', (e) => console.log(e))
    };
  }, []);

  const router = useRouter();

  return (
    <div className='jobs-root'>
      <div className='jobs-box'>
        <h2 className='jobs-box-label'>{t('findYourDreamJobs')}</h2>
        <div className='jobs-box-menu'>
          <div className='jobs-box-menu-input'> 
            <img src={SearchIconGrey} alt='search-icon' className='jobs-box-menu-input-icon' />
            <input
              value={search}
              onChange={e => handleSearch(qdata, e.target.value)}
              className='jobs-box-menu-input-el'
              type='text'
              placeholder={t('phSearch')}
            />
          </div>

          <div className='jobs-box-m'>
            <div className='jobs-box-menu-box' style={{ width: '120px' }} onClick={() => handleMenu(!tribooMenuOpened, setTribooMenuOpened)}>
              {t('triboo')}
              <img
                src={DropdownIconGrey}
                alt='menu-icon'
                className={`jobs-box-menu-box-icon ${tribooMenuOpened ? `-icon-opened` : ``}`} />
            </div>
            <div
              className={`jobs-box-menu-box-list ${!tribooMenuOpened ? `-closed` : ``}`}
              style={{
                width: '600px',
                display: 'flex',
                justifyContent: 'center',
                padding: '20px 0px',
                borderRadius: '5px'
              }}
            >
              <TribooSelect isPublic size='small' updateTriboo={ndata => handleUpdateMechanism({ ...qdata, triboo: (ndata === tribooSelected) ? '' : ndata }, ((ndata === tribooSelected) ? '' : ndata), setTribooSelected)} selectedTriboo={tribooSelected} />
            </div>
          </div>

          <div className='jobs-box-m'>
            <div className='jobs-box-menu-box' style={{ width: '120px' }} onClick={() => handleMenu(!contractMenuOpened, setContractMenuOpened)}>
              {t('contract')}
              <img
                src={DropdownIconGrey}
                alt='menu-icon'
                className={`jobs-box-menu-box-icon ${contractMenuOpened ? `-icon-opened` : ``}`} />
            </div>
            <div style={{ width: '150px', borderRadius: '5px', padding: '10px 0px' }} className={`jobs-box-menu-box-list ${!contractMenuOpened ? `-closed` : ``}`}>
              {contracts.map((item, index) => <CheckBox key={index} label={item.label} size={{ width: '20px', height: '20px' }} checked={contractCheckBox[item.value]} setCheckState={ndata => handleUpdateMechanism({ ...qdata, contractsType: { ...contractCheckBox, [item.value]: !contractCheckBox[item.value] }}, ndata, () => setContractCheckBox({ ...contractCheckBox, [item.value]: !contractCheckBox[item.value]}))} />)}
            </div>
          </div>

          <div className='jobs-box-m'>
            <div className='jobs-box-menu-box' style={{ width: '140px' }} onClick={() => handleMenu(!locationMenuOpened, setLocationMenuOpened)}>
              {t('location')}
              <img
                src={DropdownIconGrey}
                alt='menu-icon'
                className={`jobs-box-menu-box-icon ${locationMenuOpened ? `-icon-opened` : ``}`} />
            </div>
            <div style={{ width: '280px', borderRadius: '5px', display: 'flex', alignItems: 'center', paddingBottom: '10px', flexDirection: 'column' }} className={`jobs-box-menu-box-list ${!locationMenuOpened ? `-closed` : ``}`}>
              <form className='jbmbl-location-ibox' onSubmit={handleLocationSubmit}>
                <img src={LocationIconGrey} alt='search-icon' style={{ margin: '0px 10px 0px 15px', opacity: .7 }} />
                <input
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  type='text'
                  className='jbmbl-location-input'
                  placeholder={t('phLocation')}
                />
              </form>
              <div className='jbmbl-location-item-box'>
                {
                  locationList.map((item, index) => 
                    <div key={index} className='jbmbl-location-item-box-el'>
                      {item}
                      <button className='jbmbl-location-item-box-el-btn' onClick={() => handleDeleteLocation(item)}>
                        <img src={RemoveIconGrey} alt='remove-icon' />
                      </button>
                    </div>
                  )
                }
              </div>
            </div>
          </div>

          <div className='jobs-box-m' style={{ justifyContent: 'flex-end' }}>
            <div className='jobs-box-menu-box' style={{ width: '120px' }} onClick={() => handleMenu(!salaryMenuOpened, setSalaryMenuOpened)}>
              {t('salary')}
              <img
                src={DropdownIconGrey}
                alt='menu-icon'
                className={`jobs-box-menu-box-icon ${salaryMenuOpened ? `-icon-opened` : ``}`} />
            </div>
            <div style={{ width: '300px', display: 'flex', justifyContent: 'center', paddingBottom: '20px', borderRadius: '5px' }} className={`jobs-box-menu-box-list ${!salaryMenuOpened ? `-closed` : ``}`}>
              <div style={{ margin: '0px 10px' }}>
                <h2 className='jbmb-label'>{t('minimum')}</h2>
                <input
                  value={salary.min}
                  type='number'
                  placeholder={15}
                  className='jobs-box-menu-box-list-input'
                  onChange={e => setSalary({ ...salary, min: e.target.value })}
                  onBlur={e => handleUpdateMechanism(qdata, null, () => null)}
                />
              </div>

              <div style={{ margin: '0px 10px' }}>
                <h2 className='jbmb-label'>{t('maximum')}</h2>
                <input
                  value={salary.max}
                  type='number'
                  placeholder={100}
                  className='jobs-box-menu-box-list-input'
                  onChange={e => setSalary({ ...salary, max: e.target.value })}
                  onBlur={e => handleUpdateMechanism(qdata, null, () => null)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='jobs-box' style={{ marginTop: '50px' }}>
        <h3 className='jobs-box-label -l-small'>{count} {count > 1 ? t('announceNumber') : t('announcesNumber')}</h3>
        <div>
          {
            loading ?
            (
              <div>
                <div className='jobs-box-loading'></div>
                <div className='jobs-box-loading-txt'>{t('fetchingNewData')}</div>
              </div>
            ) :
            jobs.map((item, index) => (
              <div key={index} className='jobs-item' onClick={() => router.push(`/jobs/${item.publicId}`)}>
                <AnnounceItem data={item} updateData={null} isPublic />
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
}


// @export
export default withTranslation('common')(JobsComponent);