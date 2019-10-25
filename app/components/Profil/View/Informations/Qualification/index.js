// @module import
import { useState } from 'react';


// @local import
import { withTranslation } from '../../../../i18n';
import Input, { InputSelect, InputSkills } from '../Input';
import TribooSelect from '../../../../TribooSelect';
import { candidateInformationUpdate } from '../../../../../utils/request/informations';
import './index.css';
import { useCookies } from 'react-cookie';


// @component
const Qualification = ({ t, data, updateData }) => {
  const [jobName, setJobName] = useState();
  const [cookies, _, __] = useCookies('');

  return (
    <div className='qualification-root'>
      <h2 className='qualification-title'>{t('qualifications')}</h2>
      <div className='qualification-box'>
        <div className='qualification-box-triboo'>
          <TribooSelect
            label={true}
            size='small'
            updateTriboo={updateData}
            selectedTriboo={data.triboo}
            req={{ req: candidateInformationUpdate, endpoint: '/triboo', token: cookies.token }}
          />
        </div>

        <div style={{ marginTop: '20px' }}>
          <Input
            label={t('jobName')}
            placeholder={t('phJobName')}
            data={data.jobName}
            token={cookies.token}
            updateReq={{ req: candidateInformationUpdate, endpoint: '/jobName' }}
            updateData={nd => updateData({ jobName: nd })}
            type='text'
            checkFormat={null}
          />
        </div>

        <div style={{ width: '860px', margin: '10px auto' }}>
          <InputSkills
            label={t('skills')}
            token={cookies.token}
            requestFn={candidateInformationUpdate}
            updateData={nd => updateData({ skills: nd })}
            currentSkills={data.skills}
          />
        </div>


        <InputSelect
          width={260}
          margin='20px 0px 20px 35px'
          list={[
            { value: 'selflearner', label: t('stdLvl.selfLearner') },
            { value: 'post-bac', label: t('stdLvl.postBac') },
            { value: 'bac', label: t('stdLvl.bac') },
            { value: 'licence', label: t('stdLvl.licence') },
            { value: 'master', label: t('stdLvl.master') },
            { value: 'phd', label: t('stdLvl.phd') }
          ]}
          label={t('studyLvl')}
          updateReq={{ req: candidateInformationUpdate, endpoint: '/studyLvl', token: cookies.token }}
          updateData={nd => updateData({ studyLvl: nd })}
          currentData={data.studyLvl}
        />
        {/* <InputCv
          margin='20px 0px 0px 35px'
          label={t('cv')}
          updateData={data.cv}
        /> */}
        <InputSelect
          width={260}
          margin='20px 0px 20px 35px'
          list={[
            { value: 'indifferent', label: t('dsrCt.indifferent') },
            { value: 'internship', label: t('dsrCt.internship') },
            { value: 'cdd', label: t('dsrCt.cdd') },
            { value: 'cdi', label: t('dsrCt.cdi') },
            { value: 'contractor', label: t('dsrCt.contractor') }
          ]}
          label={t('desiredContract')}
          updateReq={{ req: candidateInformationUpdate, endpoint: '/desiredContract', token: cookies.token }}
          updateData={nd => updateData({ desiredContract: nd })}
          currentData={data.desiredContract}
        />

        <InputSelect
          width={260}
          margin='20px 0px 20px 35px'
          list={[
            { value: 'now', label: t('lglAvb.now') },
            { value: 'short', label: t('lglAvb.short') },
            { value: 'mid', label: t('lglAvb.mid') },
            { value: 'long', label: t('lglAvb.long') },
            { value: 'xlong', label: t('lglAvb.xlong') }
          ]}
          label={t('legalAvailability')}
          updateReq={{ req: candidateInformationUpdate, endpoint: '/availability', token: cookies.token }}
          updateData={nd => updateData({ availability: nd })}
          currentData={data.availability}
        />

        <InputSelect
          width={260}
          margin='20px 0px 20px 35px'
          list={[
            { value: 'esclave', label: t('expSalary.esclave') },
            { value: 'demiEsclave', label: t('expSalary.demiEsclave') },
            { value: 'richEsclave', label: t('expSalary.richEsclave') },
            { value: 'littleDignity', label: t('expSalary.littleDignity') },
            { value: 'respectBeginning', label: t('expSalary.respectBeginning')}
          ]}
          label={t('expectedSalary')}
          updateReq={{ req: candidateInformationUpdate, endpoint: '/salaryExpected', token: cookies.token }}
          updateData={nd => updateData({ salaryExpected: nd })}
          currentData={data.salaryExpected}
        />
      </div>
    </div>
  );
};


// @export
export default withTranslation('common')(Qualification);