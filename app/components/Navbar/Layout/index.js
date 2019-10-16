// @module import
// @local import
import './index.css';


// @component
const NavbarLayout = props => (
  <div className='navbar-layout-root'>
    {props.children}
  </div>
);


// @export
export default NavbarLayout;