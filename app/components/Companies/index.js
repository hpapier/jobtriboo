// @module import
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router'


// @local import
import './index.css'
import { withTranslation } from '../i18n';
import SearchIconGrey from '../../static/assets/search_icon_grey.svg';
import LocationIconGrey from '../../static/assets/location-icon-grey.svg';
import DropdownIconGrey from '../../static/assets/bottom_arrow_icon.svg';
import RemoveIconGrey from '../../static/assets/remove_icon_grey.svg';
import TribooSelect from '../TribooSelect';
import CheckBox from '../CheckBox';
import CompanyItem from './CompanyItem'
import { getCompanies } from '../../utils/request/companies';


// @component
const CompaniesComponent = ({ t, data }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const isUnmounted = useRef(false);
  const router = useRouter();

  const [companies, setCompanies] = useState(data.companies);
  const [count, setCount] = useState(data.count);
  const [offset, setOffset] = useState(0);
  const [windowSize, setWindowSize] = useState(0);


  /* Search State */
  const [search, setSearch] = useState('');


  /* Triboo State */
  const [tribooMenuOpened, setTribooMenuOpened] = useState(false);
  const [tribooSelected, setTribooSelected] = useState('');


  /* Contract State */
  const [sizeMenuOpened, setSizeMenuOpened] = useState(false);
  // const [contractSelected, setContractSelected] = useState(false);
  const sizes = [
    { label: t('companyEmployeesNumberTiny'), value: 'tiny' },
    { label: t('companyEmployeesNumberSmall'), value: 'small' },
    { label: t('companyEmployeesNumberMid'), value: 'mid' },
    { label: t('companyEmployeesNumberBig'), value: 'big' },
    { label: t('companyEmployeesNumberHuge'), value: 'huge' }
  ];
  const [sizeCheckBox, setSizeCheckBox] = useState({
    tiny: false,
    small: false,
    mid: false,
    big: false,
    huge: false
  });


  /* Location State */
  const [locationMenuOpened, setLocationMenuOpened] = useState(false);
  const [location, setLocation] = useState('');
  const [locationList, setLocationList] = useState([]);



  /* Handle the menu change */
  const handleMenu = (value, fn)=> {
    setTribooMenuOpened(false);
    setLocationMenuOpened(false);
    setSizeMenuOpened(false);

    fn(value)
  }


  /* Location Mechanism */
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


  /* Fetch companies with the new conditions. */
  const handleUpdateMechanism = async (qdata, ndata, fn, add = false) => {
    if (!isUnmounted.current) {
      if (!add) {
        fn(ndata);
        setLoading(true);
        setError(false);
      }
    }

    try {
      const res = await getCompanies(qdata);
      if (res.status === 200) {
        const rdata = await res.json();
        if (!isUnmounted.current) {
          if (add) {
            if (rdata.announces > 0) {
              setCompanies([...companies, ...rdata.companies]);
              setCount(rdata.count + count);
            }
          } else {
            setCompanies(rdata.companies);
            setCount(rdata.count);
          }

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


  /* Search Mechanism */
  const handleSearch = (qdata, inputValue) => {
    handleUpdateMechanism({ ...qdata, search: inputValue }, null, () => null);
    setSearch(inputValue);
  }


  /* Query data */
  const qdata = { offset, search, triboo: tribooSelected, country: locationList, size: sizeCheckBox };


  useEffect(() => {
    const tribeElement = document.getElementsByClassName('jbmbl-triboo');
    tribeElement[0].style.width = (windowSize > 640 || windowSize === 0 ? '600px' : `${windowSize - 40}px`);
  });

  /* Mount/Unmount handling */
  useEffect(() => {

    window.addEventListener('scroll', (e) => {
      if ((document.body.clientHeight - window.scrollY) === window.innerHeight)
        handleUpdateMechanism({ ...qdata, offset: companies.length + 20 }, null, () => null, true);
    });

    window.addEventListener('resize', e => {
      if (!isUnmounted.current)
        setWindowSize(e.srcElement.innerWidth)
    })

    setWindowSize(window.innerWidth);

    return () => {
      isUnmounted.current = true
      window.removeEventListener('scroll', (e) => console.log(e))
      window.removeEventListener('resize', (e) => console.log(e))
    };

  }, []);

  return (
    <div className='companies-comp-root'>
      <div className='companies-comp-box'>
        <h2 className='companies-comp-box-label'>{t('findYourDreamCompany')}</h2>
        <div className='companies-comp-box-menu'>
          <div className='companies-comp-box-menu-input'>
            <img src={SearchIconGrey} alt='search-icon' className='companies-comp-box-menu-input-icon' />
            <input
              value={search}
              onChange={e => handleSearch(qdata, e.target.value)}
              className='companies-comp-box-menu-input-el'
              type='text'
              placeholder={t('phSearch')}
            />
          </div>

          <div className='companies-comp-box-menu-element'>
            <div className='companies-comp-box-m'>
              <div className='companies-comp-box-menu-box' onClick={() => handleMenu(!tribooMenuOpened, setTribooMenuOpened)}>
                {t('triboo')}
                <img
                  src={DropdownIconGrey}
                  alt='menu-icon'
                  className={`companies-comp-box-menu-box-icon ${tribooMenuOpened ? `-icon-opened` : ``}`} />
              </div>
              <div
                className={`companies-comp-box-menu-box-list jbmbl-triboo ${!tribooMenuOpened ? `-closed` : ``}`}
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  padding: '20px 0px',
                  borderRadius: '5px'
                }}
              >
                <TribooSelect isPublic size='small' updateTriboo={ndata => handleUpdateMechanism({ ...qdata, triboo: (ndata === tribooSelected) ? '' : ndata }, ((ndata === tribooSelected) ? '' : ndata), setTribooSelected)} selectedTriboo={tribooSelected} />
              </div>
            </div>

            <div className='companies-comp-box-m'>
              <div className='companies-comp-box-menu-box' onClick={() => handleMenu(!sizeMenuOpened, setSizeMenuOpened)}>
                {t('size')}
                <img
                  src={DropdownIconGrey}
                  alt='menu-icon'
                  className={`companies-comp-box-menu-box-icon ${sizeMenuOpened ? `-icon-opened` : ``}`} />
              </div>
              <div style={{ width: '280px', borderRadius: '5px', padding: '10px 0px' }} className={`companies-comp-box-menu-box-list ${!sizeMenuOpened ? `-closed` : ``}`}>
                {
                  sizes.map((item, index) =>
                    <CheckBox
                      key={index}
                      label={item.label}
                      size={{ width: '20px', height: '20px' }}
                      checked={sizeCheckBox[item.value]}
                      setCheckState={ndata => handleUpdateMechanism({ ...qdata, size: { ...sizeCheckBox, [item.value]: !sizeCheckBox[item.value] }}, ndata, () => setSizeCheckBox({ ...sizeCheckBox, [item.value]: !sizeCheckBox[item.value]}))}
                    />
                  )
                }
              </div>
            </div>

            <div className='companies-comp-box-m'>
              <div className='companies-comp-box-menu-box' onClick={() => handleMenu(!locationMenuOpened, setLocationMenuOpened)}>
                {t('location')}
                <img
                  src={DropdownIconGrey}
                  alt='menu-icon'
                  className={`companies-comp-box-menu-box-icon ${locationMenuOpened ? `-icon-opened` : ``}`} />
              </div>
              <div style={{ width: '280px', right: '0px', borderRadius: '5px', display: 'flex', alignItems: 'center', paddingBottom: '10px', flexDirection: 'column' }} className={`companies-comp-box-menu-box-list ${!locationMenuOpened ? `-closed` : ``}`}>
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

          </div>



        </div>
      </div>

      <div className='companies-comp-box' style={{ marginTop: '50px' }}>
        <h3 className='companies-comp-box-label -l-small'>{count} {count > 1 ? t('companiesNumber') : t('companyNumber')}</h3>
        <div>
          {
            loading ?
            (
              <div>
                <div className='companies-comp-box-loading'></div>
                <div className='companies-comp-box-loading-txt'>{t('fetchingNewData')}</div>
              </div>
            ) :
            error ?
            <div className='companies-error-msg'>{t('error500')}</div> :
            companies.map((item, index) => (
              <div key={index} className='companies-item' onClick={() => router.push(`/companies/${item.name}`)}>
                <CompanyItem data={item} />
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
}


// @export
export default withTranslation('common')(CompaniesComponent);