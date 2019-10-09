import { connect } from 'react-redux'
import { setUserInfo, setLoginState } from '../action'
import ModalConnexion from '../../components/modalConnexion'

const mapDispatchToProps = dispatch => ({
  storeUserInfo: dataObject => dispatch(setUserInfo(dataObject)),
  setLoginState: data => dispatch(setLoginState(data))
});

export default connect(null, mapDispatchToProps)(ModalConnexion);