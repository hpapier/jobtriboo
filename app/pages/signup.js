// @module import
// @local import
import SignUpComponent from '../components/Sign/SignUp';


// @page
const SignUp = () => {
  return (
    <div>
      <SignUpComponent />

      <style jsx global>{`
          body {
            padding: 0;
            margin: 0;
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