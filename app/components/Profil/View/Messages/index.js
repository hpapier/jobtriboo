// @module import
// @local import
import './index.css';
import { withTranslation } from '../../../i18n';


// @component
const Messages = () => {
  return (
    <div>
      Messages
    </div>
  );
}


// @export
export default withTranslation('common')(Messages);