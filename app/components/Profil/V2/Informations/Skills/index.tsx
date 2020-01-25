// @module import
import React, { useState, FormEvent, useRef, useEffect } from 'react';
import { WithTranslation } from 'next-i18next';


// @local import
import { withTranslation } from '../../../../i18n';
import Input from '../../../../Form/Input';
import './index.css';
import { addSkill, removeSkill } from '../../../../../utils/request/candidate';
import { useCookies } from 'react-cookie';
import SkillItem from './Item';


// @interface
interface ComponentProps extends WithTranslation {
  data: Array<{
    _id: string,
    name: string
  }>
}


// @component
const Skills: (props: ComponentProps) => JSX.Element = ({ t, data }) => {
  const [skillValue, setSkillValue]       = useState('');
  const [fetchLoading, setFetchLoading]   = useState(false);
  const [removeLoading, setRemoveLoading] = useState(null);
  const [genError, setGenError]           = useState(null);
  const [skills, setSkills]               = useState(data);

  const [cookies, _, __] = useCookies();
  const isUnmounted = useRef(false);


  // Unmount function
  useEffect(() => () => { isUnmounted.current = true; }, []);


  // Handle the skill form submition
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (skillValue === '' || (skills.filter(item => item.name.toLowerCase() === skillValue.toLowerCase()).length !== 0))
      return;

    if (!isUnmounted.current) {
      setFetchLoading(true);
      if (genError !== null) setGenError(null);
    }

    try {
      const response = await addSkill(skillValue, cookies.token);
      if (response.status === 200) {
        const newSkill = await response.json();
        if (!isUnmounted.current) {
          setFetchLoading(false);
          setSkills([ ...skills, newSkill ]);
          setSkillValue('');
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


  // Handle the remove skill action.
  const handleRemoveSkill = async (id: string) => {

    if (!isUnmounted.current) {
      setRemoveLoading(id);
      if (genError !== null) setGenError(null);
    }

    try {
      const response = await removeSkill(id, cookies.token);
      if (response.status === 204) {
        if (!isUnmounted.current) {
          setRemoveLoading(null);
          setSkills(skills.filter(item => item._id !== id ));
        }
      }
      else
        throw response;
    }
    catch (e) {
      console.log(e);
      if (!isUnmounted.current) {
        setRemoveLoading(null);
        setGenError('500');
      }
    }
  }


  // Rendering
  return (
    <div id="skills-root">
      <h4 id="sr-title">{t('skills')}</h4>

      <form onSubmit={handleSubmit}>
        <Input
          placeholder={t('phSkills')}
          label={t('skills')}
          type='text'
          changeFn={setSkillValue}
          value={skillValue}
          autocomplete='off'
          margin='20px auto 0px auto'
          disabled={fetchLoading}
          error={false}
          errorValue={''}
          errorMessages={{}}
          onBlurFn={e => {}}
        />
      </form>
      <div id='sr-list'>
        { skills.map(item => <SkillItem key={item._id} name={item.name} removeLoading={removeLoading} removeFn={handleRemoveSkill} id={item._id} />) }
      </div>
    </div>
  )
};


// @export
export default withTranslation('common')(Skills);