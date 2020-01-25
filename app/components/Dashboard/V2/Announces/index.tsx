// @module import
import React, { useState, useEffect, useRef } from 'react';
import { WithTranslation } from "next-i18next";


// @local import
import './index.css';
import { withTranslation } from '../../../i18n';
import NavInside from '../../../Navbar/V2/Inside';
import Loading from '../../../Loading';
import Error from '../../../Error';
import { getRecruiterAnnounces } from '../../../../utils/request/announces';
import { useCookies } from 'react-cookie';
import CreateAnnounce from './Create';
import AnnounceItem from './Item';
import AnnouceStatisticsPanel from './Statistics';
import { AnnounceProps } from '../../../../types/announce';


// @interface
interface ComponentProps extends WithTranslation {}


// @component
const Announces: (props: ComponentProps) => JSX.Element = ({ t }) => {

  // Specific State Management.
  const [announces, setAnnounces]       = useState([]);
  const [section, setSection]           = useState('list');
  const [panelData, setPanelData]       = useState<AnnounceProps | null>(null);


  // General State Management.
  const [fetchLoading, setFetchLoading] = useState(true);
  const [genError, setGenError]         = useState(null);
  const [cookies, _, __]                = useCookies();
  const isUnmounted                     = useRef(false);


  // Announce request handler.
  const handleAnnouncesFetching = async () => {

    if (!isUnmounted.current) {
      if (!fetchLoading) setFetchLoading(true);
      if (genError !== null) setGenError(null);
    }

    try {
      const response = await getRecruiterAnnounces(cookies.token);
      if (response.status === 200) {
        const announcesData = await response.json();
        if (!isUnmounted.current) {
          setFetchLoading(false);
          setGenError(null);
          setAnnounces(announcesData);
        }
      }
      else if (response.status === 401) {
        if (!isUnmounted.current) {
          setFetchLoading(false);
          setGenError('unauthorized');
        }
      }
      else
        throw response.status;
    }
    catch (e) {
      console.log(e);
      if (!isUnmounted.current) {
        setFetchLoading(false);
        setGenError('500');
      }
    }
  };


  // Handle the add announce mechanism
  const handleAddAnnounce = (announce: AnnounceProps) => {
    if (!isUnmounted.current) {
      setAnnounces([ ...announces, announce]);
      setSection('list');
    }
  }


  // Handle the announce removing
  const handleRemoveAnnounce = (id: string) => {
    if (!isUnmounted.current)
      setAnnounces([ ...announces.filter(item => item._id !== id) ]);
  }


  // Back from panel
  const handlePanelBack = () => {
    if (!isUnmounted.current) {
      setSection('list');
      setPanelData(null);
    }
  }


  const handlePanelSwitch = (data: AnnounceProps) => {
    if (!isUnmounted.current) {
      setPanelData(data);
      setSection('panel');
    }
  }


  // Didmount & unmount function.
  useEffect(() => {
    handleAnnouncesFetching();
    return () => { isUnmounted.current = true };
  }, [])


  // Rendering function.
  return (
    <div id='announce-root'>
      <NavInside
        title={t('announces')}
        subtitle={ section === 'list' ? `<p id='cnir-subtitle-number'>${announces.length}</p> ${t(announces.length > 1 ? 'announcesFound' : 'announceFound')}` : (section === 'new') ? t('newAnnounce') : t('announcePanel') }
        actionBtn={{ name: t('postAnnounce'), action: () => { setSection('new') }, loading: fetchLoading }}
      />

      <div id='ar-items'>
        {
          fetchLoading ?
          <Loading color='blue' size='medium' /> :
          null
        }

        {
          section === 'new' ?
          <CreateAnnounce changeView={setSection} addAnnounce={handleAddAnnounce} /> :
          null
        }

        {
          section === 'list' && genError === null && !fetchLoading ?
          announces.map(item => <AnnounceItem key={item._id} data={item} type='recruiter' removeAnnounce={handleRemoveAnnounce} clickFn={handlePanelSwitch} />) :
          null
        }

        {
          section === 'panel' ?
          <AnnouceStatisticsPanel changeView={handlePanelBack} data={panelData} /> :
          null
        }

        { announces.length === 0 && section === 'list' && genError === null && !fetchLoading ? <div className='ari-noannounces'>{t('noAnnounceYet')}</div> : null }

        { genError !== null ? <Error errorValue={genError} errorMessages={{ '500': t('error500'), 'unauthorized': t('unauthorized') }} margin='10px auto' /> : null }
      </div>
    </div>
  );
}


// @export
export default withTranslation('common')(Announces);