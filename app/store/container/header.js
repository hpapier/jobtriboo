import { connect } from 'react-redux'
import { setLoginState } from '../action'
import Header from '../../components/header'

const mapStateToProps = state => ({
  loginState: state.loginState
});

const mapDispatchToProps = dispatch => ({
  setLoginState: state => dispatch(setLoginState(state))
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);