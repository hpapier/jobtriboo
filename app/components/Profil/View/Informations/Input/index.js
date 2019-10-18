// @module import
import { useEffect, useState } from 'react';
import { withTranslation } from '../../../../i18n';


// @local import
import './index.css';
import RemoveIcon from '../../../../../static/assets/remove_icon_w.svg';
import SearchIcon from '../../../../../static/assets/search_icon_grey.svg';
import WhiteDropDownIcon from '../../../../../static/assets/dropdown_icon_w.svg';
import GreyDropDownIcon from '../../../../../static/assets/bottom_arrow_icon.svg';
import GreyImportIcon from '../../../../../static/assets/import_icon_grey.svg';



// @component
const Input = ({ label, placeholder, value, setValue, type }) => {
  return (
    <div className='info-input-root'>
      <label className='info-input-label'>{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => setValue(e.target.value)}
        className='info-input-element'
      />
    </div>
  );
};

export const InputPhone = ({ label, prefixValue, prefixSetValue, prefixPlaceholder, phoneValue, phoneSetValue, phonePlaceholder }) => {
  return (
    <div className='info-input-root'>
      <label className='info-input-label'>{label}</label>
      <div className='info-input-box'>
        <input
          type='text'
          placeholder={prefixPlaceholder}
          value={prefixValue}
          onChange={e => prefixSetValue(e.target.value)}
          className='info-input-element -prefix'
        />
        <input
          type='text'
          placeholder={phonePlaceholder}
          value={phoneValue}
          onChange={e => phoneSetValue(e.target.value)}
          className='info-input-element -phone'
        />
      </div>
    </div>
  );
};

const InputSkillsComponent = ({ t, loadSkillsFn, removeSkillFn, addSkillFn, updateSkillFn, currentSkills, label }) => {
  const xpList = [0.5, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
  const [xpListOpened, setXpListState] = useState(null);
  const handleCloseList = e => {
    console.log(e)
  }
  
  return (
    <div className='info-input-skills-root'>
      <h2 className='info-input-label'>{label}</h2>
      <form onSubmit={() => console.log('submit input')} className='info-input-skill-form'>
        <img src={SearchIcon} alt='search' className='info-input-skill-form-img' />
        <input type='text' placeholder={t('phSearch')} className='info-input-skill-form-input' />
      </form>
      {
        currentSkills.map((item, index) => (
          <div key={index} className='info-input-skill-item'>
            <div className='info-input-skill-item-box'>
              {item.name}
              <button className='info-input-skill-item-box-icon'>
                <img src={RemoveIcon} alt='remove-icon' />
              </button>
            </div>

            <button
              type='button'
              className='info-input-skill-item-btn'
              onClick={() => setXpListState(xpListOpened === index ? null : index)}
            >
              {item.xp < 1 ? `< 1 ` : item.xp } {t('year')}
              <img src={WhiteDropDownIcon} alt='dropdown-icon' className={ xpListOpened === index ? `-dropdown-active` : `` } />
            </button>

            {
              xpListOpened === index ?
              <div className='info-input-select-list' onClick={() => console.log('CLIKED')}>
                { xpList.map((item, index) => (
                    <div
                      className='info-input-select-list-item'
                      value={item}
                      key={index}
                    >
                      {item < 1 ? `< 1 ` : item } {item > 1 ? t('years') : t('year')}
                    </div>
                  ))
                }
              </div> :
              null
            }

          </div>
          )
        )
      }
    </div>
  );
};

export const InputSkills = withTranslation('common')(InputSkillsComponent);


export const InputSelect = ({ currentValue, list, label, width, margin }) => {
  const [listOpened, setListState] = useState(false);
  return (
    <div style={{ width: `${width}px`, margin }} className='info-input-select-root'>
      <div className='info-input-label'>{label}</div>

      <button className={`info-input-element ${`-select-element`}`} onClick={() => setListState(!listOpened)}>
        {currentValue}
        <img src={GreyDropDownIcon} alt='dropdown-icon' className={listOpened ? `-dropdown-active` : ``} />
      </button>

      {
        listOpened ?
        <div style={{ width: `${width}px`, bottom: '-100px'}} className='info-input-select-list'>
          { list.map((item, index) => <div className='info-input-select-list-item' key={index}>{item}</div>) }
        </div> :
        null
      }

    </div>
  );
}


export const InputCv = ({ margin, label, cvTitle, updateFn }) => {
  return (
    <div style={{ margin }} className='info-input-root'>
      <label className='info-input-label'>{label}</label>
      <div className='info-input-element -cv-element'>
        {cvTitle}
        <button className='info-input-icon'>
          <img className='info-input-icon-el' src={GreyImportIcon} />
        </button>
      </div>
  </div>
  );
}

// @export
export default Input;