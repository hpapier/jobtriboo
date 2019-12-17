import React, { useState, useEffect } from 'react';
import {StripeProvider} from 'react-stripe-elements';
import {Elements} from 'react-stripe-elements';
import InjectedAnnounce from '../index';
import { stripeKey } from '../../../../../../utils/config'

const Stripe = ({ changeView, addAnnounce }) => {
  const [stripeInstance, setStripeInstance] = useState(null);

  useEffect(() => {
    setStripeInstance(window.Stripe(stripeKey));
  }, []);

  console.log(stripeInstance)
  return (
    <StripeProvider stripe={stripeInstance} >
      <Elements>
        <InjectedAnnounce changeView={changeView} addAnnounce={addAnnounce} />
      </Elements>
    </StripeProvider>
  );
};

export default Stripe;