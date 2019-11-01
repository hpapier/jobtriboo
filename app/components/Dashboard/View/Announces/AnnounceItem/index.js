// @module import
// @local import
import './index.css';


// @component$
const AnnounceItem = ({ data }) => {
  return (
    <div>
      {data.title}
    </div>
  );
}


// @export
export default AnnounceItem;