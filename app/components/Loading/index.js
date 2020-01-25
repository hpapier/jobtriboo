// @module import
// @local import
import './index.css';


// @component
const Loading = ({ size = 'medium', color = 'blue', margin = '10px auto' }) => {
  return (
    <div className={`loading-component-root --size-${size} --color-${color}`} style={{ margin }}></div>
  );
};


// @export
export default Loading;