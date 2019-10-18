// @module import
// @local import
import CommercialIconWhite from '../../static/assets/triboo_commercial_icon_white.svg';
import TechIconWhite from '../../static/assets/triboo_tech_icon_white.svg';
import EngineersIconWhite from '../../static/assets/triboo_engineers_icon_white.svg';
import RetailIconWhite from '../../static/assets/triboo_retail_icon_white.svg';
import CommercialIconGrey from '../../static/assets/triboo_commercial_icon_grey.svg';
import TechIconGrey from '../../static/assets/triboo_tech_icon_grey.svg';
import EngineersIconGrey from '../../static/assets/triboo_engineers_icon_grey.svg';
import RetailIconGrey from '../../static/assets/triboo_retail_icon_grey.svg';
import { withTranslation } from '../i18n';
import './index.css';


// @component
const TribooSelect = ({ t, size = 'regular', selected, changeTriboo }) => {
  return (
    <div className='triboo-select-root'>
      <div className={`triboo-select-box${size === 'small' ? ` -triboo-small` : ``}${selected === 'commercial' ? ' -triboo-active' : ``}`} onClick={() => changeTriboo('commercial')}>
        <img className='triboo-select-img' src={selected === 'commercial' ? CommercialIconWhite : CommercialIconGrey} alt='commercial' />
        <h3 className='triboo-select-title'>{t('commercial')}</h3>
      </div>

      <div className={`triboo-select-box${size === 'small' ? ` -triboo-small` : ``}${selected === 'tech' ? ' -triboo-active' : ``}`} onClick={() => changeTriboo('tech')}>
        <img className='triboo-select-img' src={selected === 'tech' ? TechIconWhite : TechIconGrey} alt='tech' />
        <h3 className='triboo-select-title'>{t('tech')}</h3>
      </div>

      <div className={`triboo-select-box${size === 'small' ? ` -triboo-small` : ``}${selected === 'engineering' ? ' -triboo-active' : ``}`} onClick={() => changeTriboo('engineering')}>
        <img className='triboo-select-img' src={selected === 'engineering' ? EngineersIconWhite : EngineersIconGrey} alt='engineers' />
        <h3 className='triboo-select-title'>{t('engineering')}</h3>
      </div>

      <div className={`triboo-select-box${size === 'small' ? ` -triboo-small` : ``}${selected === 'retail' ? ' -triboo-active' : ``}`} onClick={() => changeTriboo('retail')}>
        <img className='triboo-select-img' className={`triboo-select-img${selected === 'retail' ? ' -icon-triboo-active' : ``}`} src={selected === 'retail' ? RetailIconWhite : RetailIconGrey} alt='retail' />
        <h3 className='triboo-select-title'>{t('retail')}</h3>
      </div>
    </div>
  );
}


// @export
export default withTranslation('common')(TribooSelect);