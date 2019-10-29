// @module import
// @local import
import './index.css';


// @component
const CompanyItem = ({ data }) => {
  return (
    <div>
      { data.name }
    </div>
  );
}


// @export
export default CompanyItem;