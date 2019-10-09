import { connect } from 'react-redux'
import { setLoginState } from '../action'
import LoginTab from '../../components/login';

const mapDispatchToProps = dispatch => ({
  setLoginState: data => dispatch(setLoginState(data))
});

export default connect(null, mapDispatchToProps)(LoginTab);
