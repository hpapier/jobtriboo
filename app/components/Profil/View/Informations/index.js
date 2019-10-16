// @module import
// @local import
import './index.css';
import { withTranslation } from '../../../i18n';


// @component
const Informations = () => {
  return (
    <div>
      Informations
    </div>
  );
}


// @export
export default withTranslation('common')(Informations);