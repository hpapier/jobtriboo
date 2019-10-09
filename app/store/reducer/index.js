const initialState = {
  userInfo: {
    connected: false,
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    birthDate: '',
  },

  loginState: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case 'SET_USER_INFO':
      const { firstName, lastName, email, password, birthDate } = action.payload;
      return { ...state, userInfo: { email, firstName, lastName, email, password, birthDate }};
    case 'SET_LOGIN_STATE':
      console.log('SET_LOGIN_STATE');
      return { ...state, loginState: action.payload };
    default:
      return state;
  }
}