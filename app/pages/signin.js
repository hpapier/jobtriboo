// @module import
// @local import
import SignInComponent from '../components/SignIn'


// @page
const SignIn = () => {
  return (
    <div>
      <SignInComponent />

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
SignIn.getInitialProps = () => {
  return {
    namespacesRequired: ['common']
  };
};


// @export
export default SignIn;