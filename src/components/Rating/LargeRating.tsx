// @ts-nocheck
import React, { useState } from 'react';
import styled, { useTheme } from 'styled-components';
import { useOutletContext } from 'react-router-dom';

interface RatingInterface {
  value: String;
  id: String;
  handler: any;
  small?: boolean;
}

const marks = [
  {
    value: 1,
    label: 'UNFIT',
    color: '#392122',
    textColor: '#C3706A',
  },
  {
    value: 2,
    label: 'GOOD',
    color: '#53442F',
    textColor: '#8F775B',
  },
  {
    value: 3,
    label: 'GREAT',
    color: '#22383A',
    textColor: '#53736E',
  },
];

const LargeRating = ({ value, id, handler, small }: RatingInterface) => {
  const [selected, setSelected] = useState(value);
  const props = useOutletContext();

  const onChange = (id: String, selectedValue: number) => {
    if (selected === selectedValue) {
      setSelected();
      handler(id, 0);
      return;
    }
    handler(id, selectedValue);
    setSelected(selectedValue);
  };

  return (
    <StyledRatingWrapper>
      {marks.map((item: { value: number; label: string }) => (
        <StyledRatingButton
          key={item.label}
          value={item.value}
          darkMode={props.darkMode}
          checked={selected === item.value}
          onClick={() => onChange(id, item.value)}
        >
          {item.label}
        </StyledRatingButton>
      ))}
    </StyledRatingWrapper>
  );
};

export default LargeRating;

const StyledRatingWrapper = styled.div`
  padding: 0.2rem;
  border-radius: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
`;

const StyledRatingButton = styled.span`
  padding: 0.8rem;
  border-radius: 2px;
  border: 1px solid ${({ checked, theme, color, darkMode, value }) => theme.borderColor};
  font-size: 0.85rem;
  cursor: pointer;
  background-color: ${({ checked, theme, color, darkMode, value }) => {
    if (darkMode === 'light') {
      if (value === 1 && checked) {
        return theme.rating.unfit.color;
      }
      if (value === 2 && checked) {
        return theme.rating.good.color;
      }

      if (value === 3 && checked) {
        return theme.rating.great.color;
      }
    } else {
      if (value === 1 && checked) {
        return theme.rating.unfit.color;
      }
      if (value === 2 && checked) {
        return theme.rating.good.color;
      }

      if (value === 3 && checked) {
        return theme.rating.great.color;
      }
    }
  }};
  color: ${({ checked, theme, color, darkMode, value }) => {
    if (darkMode === 'light') {
      if (value === 1 && checked) {
        return theme.rating.unfit.textColor;
      }
      if (value === 2 && checked) {
        return theme.rating.good.textColor;
      }

      if (value === 3 && checked) {
        return theme.rating.great.textColor;
      }
    } else {
      if (value === 1 && checked) {
        return theme.rating.unfit.textColor;
      }
      if (value === 2 && checked) {
        return theme.rating.good.textColor;
      }

      if (value === 3 && checked) {
        return theme.rating.great.textColor;
      }
    }
  }};
  transition: background 0.3s linear;
  &:hover {
    background: ${({ theme }) => theme.body};
  }
  &:active {
    background: ${({ theme }) => theme.body};
    transform: scale(1.1);
  }
`;
