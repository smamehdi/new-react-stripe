import { useState, useEffect } from "react";
import Router from "next/router";
import styled from 'styled-components';

import Layout from "../components/Layout";
import Row from "../components/prebuilt/Row";
import DonutShop from "../components/prebuilt/DonutShop";
import CheckoutForm from "../components/CheckoutForm";
import getDonutPrice from "../utils/get-donut-price";
import Image from 'next/image';

const MainPage = props => {
  const [donuts, setDonuts] = useState([20, 25, 50, 75, 100, 150, 200, 250, 300, 350, 400, 450, 500]);
  const [selectedDonut, setSelectedDonut] = useState(0);
  const handleSelectedDonut = ( value ) => {
    setSelectedDonut(value);
  }
  useEffect(() => {
    const handleContextMenu = (e) => {
      e.preventDefault();
    };

    const handleKeyDown = (e) => {
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'C' || e.key === 'J')) ||
        (e.ctrlKey && e.key === 'U')
      ) {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <Layout title="Donut Shop">
        <Image src="/logocandy.png" alt="GiftCandy Logo" width={250} height={250} style={{
          margin: 'auto',
          display: 'block',
          marginTop: '-110px',
          marginBottom: '-54px',
        }}/>
      <Row>
        <DonutShop
          donuts={donuts}
          onSelect={handleSelectedDonut}
        />
      </Row>
      <CheckoutForm
        price={selectedDonut}
        onSuccessfulCheckout={() => Router.push("/success")}
      />
    </Layout>
  );
};

export default MainPage;
