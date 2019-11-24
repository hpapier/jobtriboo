// @module import
import { useState } from 'react';
import { useCookies } from 'react-cookie';


// @local import
import { withTranslation } from '../../../../i18n';
import Input, { InputSelect, InputSkills } from '../Input';
import TribooSelect from '../../../../TribooSelect';
import { candidateInformationUpdate } from '../../../../../utils/request/informations';
import './index.css';


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

        <div className='qualification-box-jobname'>
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

        <div className='qualification-box-skills'>
          <InputSkills
            label={t('skills')}
            token={cookies.token}
            requestFn={candidateInformationUpdate}
            updateData={nd => updateData({ skills: nd })}
            currentSkills={data.skills}
          />
        </div>

        <div className='qualification-box-element'>
          <InputSelect
            width='calc(100% - 40px)'
            margin='0px'
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
        </div>

        <div className='qualification-box-element'>
          <InputSelect
            width='calc(100% - 40px)'
            margin='0px'
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
        </div>

        <div className='qualification-box-element'>
          <InputSelect
            width='calc(100% - 40px)'
            margin='0px'
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
        </div>

        <div className='qualification-box-element'>
          <InputSelect
            width='calc(100% - 40px)'
            margin='0px'
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
    </div>
  );
};


// @export
export default withTranslation('common')(Qualification);