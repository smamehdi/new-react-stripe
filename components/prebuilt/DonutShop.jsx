import styled from "@emotion/styled";

import Image from "./Image";
import DonutQuantity from "./DonutQuantity";

const Shop = styled.div`
  padding: 0px 20px 40px 20px;
  margin-top: -30px;
  border-radius: 30px;
`;

const ShopName = styled.h1`
  font-size: 18px;
  color: #fff;
  font-style: normal;
  font-variant: normal;
  font-weight: 400;
  line-height: 26.4px;
`;

const Controls = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;


const DonutShop = ({ donuts, onSelect }) => {
  return (
    <Shop>
      <Image src="./donut.png" width="200" marginTop='-50px'/>
      <Controls>
        <DonutQuantity
          onSelect={onSelect}
          donuts={donuts}
        />
      </Controls>
    </Shop>
  );
};

export default DonutShop;
