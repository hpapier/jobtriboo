// @module import
// @local import
import './index.css';


// @component
const MenuItem = ({ label, icon, isActive, switchSection }) => {
  return (
    <div className={`menu-item-root${isActive ? ` -root-active` : ``}`} onClick={switchSection}>
      <img src={icon} className={`menu-item-icon${isActive ? ` -icon-active` : ``}`} alt={label} />
      <div className={`menu-item-label${isActive ? ` -label-active` : ``}`}>{label}</div>
    </div>
  );
};


// @export
export default MenuItem;