// @module import
// @local import
const CrossIcon = require('../../../../../../static/assets/cross-icon-blue.svg') as string;
import './index.css';


// @interface
interface ComponentProps {
  id: string,
  name: string,
  removeLoading?: string,
  removeFn: (id: string) => void
}

// @component
const SkillItem: (props: ComponentProps) => JSX.Element = ({ id, name, removeLoading = false, removeFn }) => {
  return (
    <div className='comp-skill-item-root'>
      <p className='csir-name'>{name}</p>
      <button className='csir-btn' disabled={removeLoading === id} onClick={() => removeFn(id)}>
          <img className='csirb-icon' src={CrossIcon} alt="remove-icon"/>
      </button>
    </div>
  );
}


// @export
export default SkillItem;