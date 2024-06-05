import React, { useState } from 'react';
import styled from "@emotion/styled";
import CheckoutError from "./CheckoutError";

const Button = styled.span`
  display: inline-block;
  width: 60px;  /* Adjusted to fit larger numbers */
  line-height: 38px;
  color: #fff;
  height: 40px;
  text-align: center;
  font-weight: bold;
  cursor: pointer;
  background-color: ${(props) => (props.isSelected ? '#ffb9f6' : 'transparent')};
  border: ${(props) => (props.isSelected ? 'none' : '1px solid #ffb9f6')};
  border-radius: 40px;
  user-select: none;
  margin: 7px;
  box-shadow: 0 6px 9px rgba(50, 50, 93, 0.06), 0 2px 5px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 #ffb9f6;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
`;

const ToggleButton = styled(Button)`
  border-radius: 50%;
  width: 40px;
  height: 40px;
  line-height: 40px;
`;

const ErrorContainer = styled.div`
`;

const DonutQuantity = ({ onSelect }) => {
  const values = [20, 25, 50, 75, 100, 150, 200, 250, 300, 350, 400, 450, 500];
  const [selectedButton, setSelectedButton] = useState(null);
  const [showExtraButtons, setShowExtraButtons] = useState(false);

  const handleButtonClick = (index) => {
    setSelectedButton(index);
    onSelect(values[index]);
  };

  const toggleExtraButtons = () => {
    setShowExtraButtons(!showExtraButtons);
  };

  return (
    <div>
      <ButtonGroup>
        {values.slice(0, 5).map((value, index) => (
          <Button
            key={index}
            isSelected={selectedButton === index}
            onClick={() => handleButtonClick(index)}
          >
            {value}
          </Button>
        ))}
      </ButtonGroup>
      <ButtonGroup>
        {values.slice(5, 10).map((value, index) => (
          <Button
            key={index + 5}
            isSelected={selectedButton === index + 5}
            onClick={() => handleButtonClick(index + 5)}
          >
            {value}
          </Button>
        ))}
      </ButtonGroup>
      <ButtonGroup>
        {!showExtraButtons && (
          <ToggleButton onClick={toggleExtraButtons}>+</ToggleButton>
        )}
        {showExtraButtons && (
          <>
            {values.slice(10).map((value, index) => (
              <Button
                key={index + 10}
                isSelected={selectedButton === index + 10}
                onClick={() => handleButtonClick(index + 10)}
              >
                {value}
              </Button>
            ))}
          </>
        )}
      </ButtonGroup>
      <ErrorContainer>
          <div style={{marginTop: '35px', marginBottom: '-12px'}}><CheckoutError noError>All amounts are in CAD$</CheckoutError></div>
        </ErrorContainer>
    </div>
  );
};

export default DonutQuantity;
