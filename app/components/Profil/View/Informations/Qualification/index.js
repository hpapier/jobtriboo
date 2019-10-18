// @module import
import { useState } from 'react';


// @local import
import { withTranslation } from '../../../../i18n';
import Input, { InputSelect, InputSkills, InputCv } from '../Input';
import TribooSelect from '../../../../TribooSelect';
import './index.css';


// @component
const Qualification = ({ t, data }) => {
  const [tribooSelected, setTribooSelected] = useState('commercial')
  const [jobName, setJobName] = useState();

  return (
    <div className='qualification-root'>
      <h2 className='qualification-title'>{t('qualifications')}</h2>
      <div className='qualification-box'>
        <div className='qualification-box-triboo'>
          <h2 className='qualification-box-triboo-title'>Triboo</h2>
          <TribooSelect size='small' selected={tribooSelected} changeTriboo={setTribooSelected} />
        </div>

        <div style={{ marginTop: '20px' }}>
          <Input label={t('jobName')} placeholder={t('phJobName')} value={jobName} setValue={setJobName} type='text' />
        </div>

        <div style={{ width: '860px', margin: '10px auto' }}>
          <InputSkills
            removeSkillFn={() => console.log('remove fn')}
            addSkillFn={() => console.log('add fn')}
            loadSkillsFn={() => console.log('load fn')}
            updateSkillFn={() => console.log('update fn')}
            currentSkills={[{ name: 'Business Dev', xp: 0.5 }, { name: 'Business Dev', xp: 0.5 }]}
            label={t('skills')}
          />
        </div>


        <InputSelect width={260} margin='20px 0px 0px 35px' list={['autodidacte', 'bac', 'master', 'doctorat']} label={t('studyLvl')} currentValue={'bac'} />
        <InputCv margin='20px 0px 0px 35px' label={t('cv')} cvTitle={'no cv yet'} updateFn={() => console.log('updateFN')}/>
        <InputSelect width={260} margin='20px 0px 0px 35px' list={['indifferent', 'CDI', 'CDD', 'freelance']} label={t('desiredContract')} currentValue={'indifferent'} />

        <InputSelect width={260} margin='15px 0px 0px 35px' list={['now', '0 to 1 month', '1 to 3 month', '3 to 6 month', '+ 6 month']} label={t('legalAvailability')} currentValue={'now'} />
        <InputSelect width={260} margin='15px 0px 0px 35px' list={['15k - 20k', '20k - 30k', '30k - 45k', '45k - 70k', '+ 70k']} label={t('expectedSalary')} currentValue={'15k - 20k'} />
      </div>
    </div>
  );
};


// @export
export default withTranslation('common')(Qualification);