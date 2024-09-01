import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const TimeSpanIndicator = ({
  options,
  selectedValue = 'lineGraph',
  onChange,
  small,
  disabled = false,
}) => {
  const [selected, setSelected] = useState(selectedValue);

  useEffect(() => {
    setSelected(selectedValue);
  }, [selectedValue]);

  return (
    <StyledRatingWrapper small={small} disabled={disabled}>
      {options.map((option) => (
        <StyledRatingButton
          key={option.value}
          disabled={disabled}
          onClick={() => {
            if (!disabled) {
              setSelected(option.value);
              onChange(option.value);
            }
          }}
          checked={selected?.toLowerCase() === option?.value?.toLowerCase()}
        >
          {option.icon && <IconContainer>{option.icon}</IconContainer>}
          {!option?.icon && option.label}
        </StyledRatingButton>
      ))}
    </StyledRatingWrapper>
  );
};

export default TimeSpanIndicator;

const StyledRatingWrapper = styled.div`
  border: 1px solid ${({ theme }) => theme.borderColor};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'auto')};
  padding: ${({ small }) => (small ? '0.1rem' : '0.2rem')};
  border-radius: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 6rem;
  transform: ${({ small }) => (small ? 'scale(0.9)' : '')};
  height: 0.78rem;
  padding: 0.85rem 0rem 0.85rem 0rem;
  gap: 0.5rem;
`;

const StyledRatingButton = styled.button`
  display: flex;
  align-items: center;
  padding: 0.65rem 0.85rem;
  /* padding: 0.75rem 1.1rem; */
  border-radius: 100px;
  font-size: ${({ small }) => (small ? '0.6rem' : '0.7rem')};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'auto')};

  background-color: ${({ checked, theme }) => (checked ? theme.text : 'transparent')};
  color: ${({ checked, theme }) => (checked ? theme.body : theme.text)};
  border: none;
  transition: background-color 0.3s linear, transform 0.1s ease;
  &:hover {
    background-color: ${({ theme }) => theme.body};
  }
  &:active {
    background-color: ${({ theme }) => theme.body};
    transform: scale(1.1);
  }
`;

const IconContainer = styled.span`
  display: flex;
  align-items: center;
`;
