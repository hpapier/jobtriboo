// @module import
import React from 'react';
import { WithTranslation } from 'next-i18next';
import { useRouter } from 'next/router';


// @local import
import './index.css';
import { CompanyProps } from '../../../types/company';
import { AnnounceProps } from '../../../types/announce';
import { withTranslation } from '../../i18n';
import Announce from '../../Dashboard/V2/Announces/Item';
import { serverFileURL } from '../../../utils/config';


// @interface
interface CompanyIdDataProps extends CompanyProps {
  announces: Array<AnnounceProps>
}

interface CompanyIdProps extends WithTranslation {
  data: CompanyIdDataProps
}

// @component
const Company = (props: CompanyIdProps): JSX.Element => {
  console.log(props.data);
  const { name, announces, country, city, employeesNumber, category, email, description, link, logo } = props.data;
  const { t } = props;
  const router = useRouter();

  return (
    <div id='component-company-element-root'>
      <div id='ccer-summary'>
        <img className='ccers-logo' src={serverFileURL + logo} alt="company-logo" />
        <h1 className='ccers-name'>{name}</h1>
        <a href={link} className='ccers-link'>{link}</a>
        <div className='ccers-open-offers'>{`${announces.length} ${t(announces.length > 1 ? 'openOffers' : 'openOffer')}`}</div>

        <div className='ccers-info'>
          <h3 className='ccersi-title'>{country}, {city}</h3>
          <p className='ccersi-label'>{t('location')}</p>
        </div>
        <div className='ccers-info'>
          <h3 className='ccersi-title'>{t(employeesNumber)}</h3>
          <p className='ccersi-label'>{t('employeesNumber')}</p>
        </div>
        <div className='ccers-info'>
          <h3 className='ccersi-title'>{t(category)}</h3>
          <p className='ccersi-label'>{t('category')}</p>
        </div>
        <div className='ccers-info'>
          <h3 className='ccersi-title'>{email}</h3>
          <p className='ccersi-label'>{t('contactEmail')}</p>
        </div>
      </div>


      <div id='ccer-info'>
        <div className='cceri-box'>
          <h2 className='ccerib-title'>{t('aboutCompany')} <span style={{ color: '#246BF8' }}>{name}</span></h2>
          <p className='ccerib-information'>{description}</p>
        </div>

        <div className='cceri-box'>
          <h2 className='ccerib-title'><span style={{ color: '#00C9A7' }}>{announces.length}</span> {t(announces.length > 1 ? 'openOffers' : 'openOffer')}</h2>
          { announces.map((item: AnnounceProps, index: number) => <Announce key={index} data={{ ...item, companyInfo: props.data }} type='public' clickFn={() => router.push('/jobs/' + item.publicId)} /> ) }
        </div>
      </div>
    </div>
  );
}


// @export
export default withTranslation('common')(Company);