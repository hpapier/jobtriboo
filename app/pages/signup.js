// @module import
// @local import
// import SignUpComponent from '../components/Sign/SignUp';
import Register from '../components/Sign/V2/Register';


// @page
const SignUp = () => {
  return (
    <div>
      {/* <SignUpComponent /> */}
      <Register />

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
SignUp.getInitialProps = () => {
  return {
    namespacesRequired: ['common']
  };
};


// @export
export default SignUp;