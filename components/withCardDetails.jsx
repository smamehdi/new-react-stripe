import React, { useState } from 'react';

// Higher-Order Component
const withCardDetails = (WrappedComponent) => {
  return (props) => {
    const [cardDetails, setCardDetails] = useState({
      cardNumber: '',
      expiryDate: '',
      cvv: '',
    });

    const handleChange = (event) => {
      const { name, value } = event.target;
      setCardDetails((prevDetails) => ({
        ...prevDetails,
        [name]: value,
      }));
    };

    const handleSubmit = async (event) => {
      event.preventDefault();
      props.onCardDetailsSubmit(cardDetails);
    };

    return (
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="cardNumber"
          placeholder="Card Number"
          value={cardDetails.cardNumber}
          onChange={handleChange}
        />
        <input
          type="text"
          name="expiryDate"
          placeholder="Expiry Date (MM/YY)"
          value={cardDetails.expiryDate}
          onChange={handleChange}
        />
        <input
          type="text"
          name="cvv"
          placeholder="CVV"
          value={cardDetails.cvv}
          onChange={handleChange}
        />
        <button type="submit">Pay</button>
      </form>
    );
  };
};

export default withCardDetails;
