// @module import
// @local import
// import SignInComponent from '../components/Sign/SignIn';
import Login from '../components/Sign/V2/Login';

// @page
const SignIn = () => {
  return (
    <div>
      {/* <SignInComponent /> */}
      <Login />

      <style jsx global>{`
          body {
            padding: 0;
            margin: 0;
            background-color: #fff !important;
            font-family: Poppins, sans-serif !important;
          }
      `}</style>
    </div>
  );
};


// @request
SignIn.getInitialProps = () => {
  return {
    namespacesRequired: ['common']
  };
};


// @export
export default SignIn;