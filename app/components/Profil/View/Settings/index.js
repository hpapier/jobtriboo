// @module import
// @local import
import './index.css';
import { withTranslation } from '../../../i18n';


// @component
const Settings = () => {
  return (
    <div>
      Settings
    </div>
  );
}


// @export
export default withTranslation('common')(Settings);