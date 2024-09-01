// @ts-nocheck
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
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
    color: '#532c2d',
    textColor: '#C3706A',
  },
  {
    value: 2,
    label: 'GOOD',
    color: '#53442F',
    textColor: '#caa375',
  },
  {
    value: 3,
    label: 'GREAT',
    color: '#2c5357',
    textColor: '#71baaf',
  },
];

const Rating = ({ value, id, handler, small }: RatingInterface) => {
  const [selected, setSelected] = useState();

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

  useEffect(() => {
    setSelected(value);
  }, [id, value]);

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

export default Rating;

const StyledRatingWrapper = styled.div`
  border: 1px solid ${({ checked, theme, color, darkMode, value }) => theme.borderColor};
  padding: 0.2rem;
  border-radius: 5.5px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
`;

const StyledRatingButton = styled.span`
  padding: 0.3rem 0.6rem 0.3rem 0.6rem;
  border-radius: 2px;
  font-size: 0.7rem;
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
