// @module import
import { connect } from 'react-redux'


// @local import
import { setLoginState } from '../action'
import Navbar from '../../components/Navbar'


// @state dispatcher
const mapStateToProps = state => ({
  loginState: state.loginState
});


// @action dispatcher
const mapDispatchToProps = dispatch => ({
  setLoginState: state => dispatch(setLoginState(state))
});


// @export
export default connect(mapStateToProps, mapDispatchToProps)(Navbar);