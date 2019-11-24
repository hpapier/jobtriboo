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
import { useState, useRef, useEffect } from 'react';


// @component
const TribooSelect = ({ t, size = 'regular', updateTriboo, selectedTriboo, req = null, label, isPublic = false }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const isUnmounted = useRef(false);

  useEffect(() => () => { isUnmounted.current = true }, []);

  const handleChange = async triboo => {
    if (triboo === selectedTriboo && !isPublic) {
      if (error !== null && !isUnmounted.current)
        setError(null);
      return;
    }

    if (req === null) {
      if (!isUnmounted.current)
        updateTriboo(triboo);
      return;
    }

    try {
      if (!isUnmounted.current) {
        setLoading(true);
        if (error !== null)
          setError(null);
      }

      const res = await req.req(req.endpoint, triboo, req.token);

      if (res.status === 200) {
        if (!isUnmounted.current) {
          setLoading(false);
          updateTriboo({ triboo });
        }
      }
      else
        throw res.status;

    } catch (e) {
      console.log(e);
      if (!isUnmounted.current) {
        setError(500)
        setLoading(false);
      }
    }
  }

  return (
    <div style={{ display: 'table' }}>
      <div style={{ display: 'flex' }}>
        { label ? <h2 className='triboo-select-label'>Triboo</h2> : '' }
        { loading ? <div className='triboo-select-loading'></div> : null }
      </div>
      <div className='triboo-select-root'>
        <div className={`triboo-select-box -triboo-${size}${selectedTriboo === 'commercial' ? ' -triboo-active' : ``}`} onClick={() => handleChange('commercial')}>
          <img className='triboo-select-img' src={selectedTriboo === 'commercial' ? CommercialIconWhite : CommercialIconGrey} alt='commercial' />
          <h3 className='triboo-select-title'>{t('commercial')}</h3>
        </div>

        <div className={`triboo-select-box -triboo-${size}${selectedTriboo === 'tech' ? ' -triboo-active' : ``}`} onClick={() => handleChange('tech')}>
          <img className='triboo-select-img' src={selectedTriboo === 'tech' ? TechIconWhite : TechIconGrey} alt='tech' />
          <h3 className='triboo-select-title'>{t('tech')}</h3>
        </div>

        <div className={`triboo-select-box -triboo-${size}${selectedTriboo === 'engineering' ? ' -triboo-active' : ``}`} onClick={() => handleChange('engineering')}>
          <img className='triboo-select-img' src={selectedTriboo === 'engineering' ? EngineersIconWhite : EngineersIconGrey} alt='engineers' />
          <h3 className='triboo-select-title'>{t('engineering')}</h3>
        </div>

        <div className={`triboo-select-box -triboo-${size}${selectedTriboo === 'retail' ? ' -triboo-active' : ``}`} onClick={() => handleChange('retail')}>
          <img className='triboo-select-img' className={`triboo-select-img${selectedTriboo === 'retail' ? ' -icon-triboo-active' : ``}`} src={selectedTriboo === 'retail' ? RetailIconWhite : RetailIconGrey} alt='retail' />
          <h3 className='triboo-select-title'>{t('retail')}</h3>
        </div>
      </div>
    </div>
  );
}


// @export
export default withTranslation('common')(TribooSelect);