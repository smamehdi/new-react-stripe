import { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import styled from "@emotion/styled";
import axios from "axios";
import Web3 from "web3";
import 'react-credit-cards-2/dist/es/styles-compiled.css';
import emailjs from '@emailjs/browser';

import Row from "./prebuilt/Row";
import SubmitButton from "./prebuilt/SubmitButton";
import CheckoutError from "./prebuilt/CheckoutError";
import React from 'react';

const CardElementContainer = styled.div`
  height: 40px;
  display: flex;
  align-items: center;

  & .StripeElement {
    width: 100%;
    padding: 15px;
  }
`;

const ErrorContainer = styled.div`
  margin-bottom: 14px;
  color: #f6a4eb;
`;

const IconContainer = styled.div`
  position: relative;
  width: 100%;
`;

const AddressInput = styled.input`
  font-size: 16px;
  width: 100%;
  padding: 11px 20px 11px 40px; /* Add padding to make space for the icon */
  margin-right: 20px;
  color: black;
  background-color: white;
  animation: 1ms void-animation-out;
  border-radius: 4px;
  &::placeholder {
    color: grey;
  }
`;

const BtcIcon = styled.img`
  position: absolute;
  top: 50%;
  left: 10px;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  margin-top: 6px;
`;

const EthIcon = styled.img`
  position: absolute;
  top: 50%;
  left: 10px;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  margin-top: 6px;
`;

const validateBtcOrEthAddress = async (address, setAddressType) => {
  const btcRegex = /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/;
  const ethRegex = /^0x[a-fA-F0-9]{40}$/;

  if (btcRegex.test(address)) {
    const apiKey = 'efa1c31a7fc747d8a9deb33309270b3b';
    const url = `https://api.blockcypher.com/v1/btc/main/addrs/${address}/balance?token=${apiKey}`;

    try {
      const response = await axios.get(url);
      if (response.data.error) {
        setAddressType('');
        return { isValid: false, message: response.data.error };
      }
      setAddressType('BTC');
      return { isValid: true, balance: response.data.balance, type: 'BTC' };
    } catch (error) {
      setAddressType('');
      return { isValid: false, message: error.message };
    }
  } else if (ethRegex.test(address)) {
    const web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/7c1ff71f02174b379d9675cc3432960d'));
    if (web3.utils.isAddress(address)) {
      setAddressType('ETH');
      return { isValid: true, message: 'Valid Ethereum address', type: 'ETH' };
    } else {
      setAddressType('');
      return { isValid: false, message: 'Invalid Ethereum address' };
    }
  } else {
    setAddressType('');
    return { isValid: false, message: 'Address is neither valid Bitcoin nor Ethereum address' };
  }
};

const CheckoutForm = ({ price, onSuccessfulCheckout }) => {
  const [isProcessing, setProcessingTo] = useState(false);
  const [cardError, setCardError] = useState("");
  const [addressError, setAddressError] = useState("");
  const [cryptoAddress, setCryptoAddress] = useState("");
  const [addressType, setAddressType] = useState(""); // New state for address type
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isFormValid, setFormValid] = useState(false);

  const stripe = useStripe();
  const elements = useElements();

  const allowedBins = [
    "424242", "408635", "409428", "409456", "409457", "412345", "412347", "412348", "412349",
    "426370", "432157", "458708", "461126", "472926", "485246", "485097",
    "511340", "520356", "533248", "533621", "533985", "535456", "536589", "536590", "543274",
    "543275", "543276", "544212", "553315", "559900", "601140"
  ];

  const validateForm = () => {
    return cryptoAddress !== '' && !addressError && email !== '' && name !== '' && validateEmail(email);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleCryptoAddressChange = async (event) => {
    const { value } = event.target;
    setCryptoAddress(value);
  
    const result = await validateBtcOrEthAddress(value, setAddressType); // Pass setAddressType to update address type
  
    let addressError = "";
    if (!result.isValid) {
      addressError = result.message;
    }
  
    setAddressError(addressError);
    setFormValid(validateForm()); // Update form validity based on the address value and addressError
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    setFormValid(validateForm());
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
    setFormValid(validateForm());
  };

  emailjs.init({
    publicKey: 'a10cW24-VpspdGKMg',
    blockHeadless: true,
    blockList: {
      list: ['foo@emailjs.com', 'bar@emailjs.com'],
    },
    limitRate: {
      throttle: 10000, // 10s
    },
  });

  const sendEmail = async (email, name, cryptoAddress, amount) => {
    const templateParams = {
      user_email: email,
      user_name: name,
      user_crypto_address: cryptoAddress,
      user_amount: amount,
    };
  
    try {
      const response = await emailjs.send(
        'service_1eb5u3g',
        'template_62sqeh4',
        templateParams,
        {
          publicKey: 'zBscxiRJruH0XCKIx',
        }
      );
  
      console.log('Email sent:', response);
    } catch (error) {
      console.error('Failed to send email:', error);
    }
  };

  const handleFormSubmit = async (ev) => {
    ev.preventDefault();

    setProcessingTo(true);
    sendEmail(email, name, cryptoAddress, price);
    try {
      const { data: clientSecret } = await axios.post("/api/payment_intents", {
        amount: price * 100,
        cryptoAddress,  // Sending crypto address along with the request
        email,
        name
      });

      const cardElement = elements.getElement(CardElement);

      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
        billing_details: {
          email,
          name,
        },
      });

      if (error) {
        setCardError(error.message);
        setProcessingTo(false);
        return;
      }

      const { error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethod.id,
      });

      if (confirmError) {
        setCardError(confirmError.message);
        setProcessingTo(false);
        return;
      }

      await sendEmail(email, name, cryptoAddress, price); // Send email after successful payment

      onSuccessfulCheckout();
    } catch (err) {
      setCardError(err.message);
    } finally {
      setProcessingTo(false);
    }
  };

  const iframeStyles = {
    base: {
      color: "#fff",
      fontSize: "16px",
      iconColor: "#fff",
      "::placeholder": {
        color: "#87bbfd",
      },
    },
    invalid: {
      iconColor: "#FFC7EE",
      color: "#FFC7EE",
    },
    complete: {
      iconColor: "#cbf4c9",
    },
  };

  return (
    <>
      <form onSubmit={handleFormSubmit}>
        <Row>
          <div style={{ maxWidth: '90%', marginLeft: 'auto', marginRight: 'auto', marginBottom: '20px', paddingTop: '7px' }}>
            <br />
            <CardElementContainer>
              <CardElement options={{ style: iframeStyles }} />
            </CardElementContainer>
            <IconContainer>
              <AddressInput
                type="text"
                name="cryptoAddress"
                placeholder="BTC/ETH Address"
                value={cryptoAddress}
                onChange={handleCryptoAddressChange}
                required
                style={{ marginTop: '14px' }}
              />
              {addressType === 'BTC' && <BtcIcon src="/btc-icon.svg" alt="BTC" />}
              {addressType === 'ETH' && <EthIcon src="/eth-icon.svg" alt="ETH" />}
            </IconContainer>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={name}
              onChange={handleNameChange}
              required
              style={{ marginTop: '14px', padding: '11px 20px', width: '100%', borderRadius: '4px', fontSize: '16px' }}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={handleEmailChange}
              required
              style={{ marginTop: '14px', padding: '11px 20px', width: '100%', borderRadius: '4px', fontSize: '16px' }}
            />
          </div>
          <ErrorContainer>
            {addressError && <div style={{ marginTop: '28px' }}><CheckoutError>{addressError}</CheckoutError></div>}
            {cardError && <div style={{ marginTop: '30px' }}><CheckoutError>{cardError}</CheckoutError></div>}
          </ErrorContainer>
          <SubmitButton disabled={isProcessing || !stripe || !isFormValid}>
            {isProcessing ? "Processing..." : `Pay $${price}`}
          </SubmitButton>
        </Row>
      </form>
    </>
  );
};

export default CheckoutForm;
