// @module import
import React, { useState, useEffect, useRef } from 'react';
import { useCookies } from 'react-cookie';
import { CardElement } from 'react-stripe-elements';


// @local import
import { getPaymentIntent } from '../../../../../../utils/request/announces';
import { withTranslation } from '../../../../../i18n';
import Loading from '../../../../../Loading';
import './index.css';


// @card style
const style = {
  base: {
    color: "#32325d",
    fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
    fontSmoothing: "antialiased",
    fontSize: "16px",
    "::placeholder": {
      color: "#aab7c4"
    }
  },
  invalid: {
    color: "#fa755a",
    iconColor: "#fa755a"
  }
};


// @component
const CardSection = ({ updateClientSecret, setPrice, t }) => {

  const [couponValue, setCouponValue] = useState('');
  const [cookies, _, __] = useCookies();
  const [couponError, setCouponError] = useState(false);
  const [couponLoading, setCouponLoading] = useState(false);
  const IsUnmounted = useRef(false);

  const handleSubmit = async e => {
    e.preventDefault();

    if (!IsUnmounted.current) {
      setCouponError(false);
      setCouponLoading(true);
    }

    try {
      const res = await getPaymentIntent(cookies.token, couponValue === '' ? null : couponValue);
      if (res.status === 200) {
        const data = await res.json();
        setPrice(data.amount);
        updateClientSecret(data.clientSecret);

        if (!IsUnmounted.current)
          setCouponLoading(false);

      } else if (res.status === 404) {

        setCouponError(404);
        setCouponLoading(false);

      } else
        throw res.status;
    } catch (e) {
      console.log(e);

      if (!IsUnmounted.current) {
        setCouponError(500);
        setCouponLoading(false);
      }

      return;
    }
  }

  useEffect(() => () => { IsUnmounted.current = true }, [])

  return (
    <div className='card-section-root'>
      <label className='card-section-label'>Card details</label>
      <CardElement className='MyCardElement' style={style} />

      <form onSubmit={handleSubmit} className='card-section-coupon-root'>
        <input className='card-section-coupon-input' placeholder={t('useCoupon')} value={couponValue} onChange={e => setCouponValue(e.target.value)} />
        <button className='card-section-coupon-btn'>{ couponLoading ? <Loading size='small' color='white' margin='0px auto' /> : t('addCoupon')}</button>
      </form>

      { couponError === 404 && <div className='card-section-coupon-errormsg'>{t('invalidCoupon')}</div>}
      { couponError === 500 && <div className='card-section-coupon-errormsg'>{t('error500')}</div>}
    </div>
  );
};


// @export
export default withTranslation('common')(CardSection);