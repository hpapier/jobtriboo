// @module import
import { useState, useEffect } from 'react';

// @local import
import './index.css';
import { stripeKey } from '../../../../../utils/config';
import { StripeProvider, Elements } from 'react-stripe-elements';
import NewAnnounceForm from './Form';


// @component
const CreateComponent = ({ changeView, addAnnounce }) => {
  const [stripeInstance, setStripeInstance] = useState(null);

  useEffect(() => {
    setStripeInstance((window as any).Stripe(stripeKey));
  }, []);

  return (
    <div style={{ width: '100%' }}>
      <StripeProvider stripe={stripeInstance} >
        <Elements>
          <NewAnnounceForm changeView={changeView} addAnnounce={addAnnounce} />
        </Elements>
      </StripeProvider>
    </div>
  );
};


// @export
export default CreateComponent;