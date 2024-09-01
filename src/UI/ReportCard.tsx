// @ts-nocheck
import React from 'react';
import styled, { useTheme } from 'styled-components';
import { keyframes } from 'styled-components';
import { Link, useOutletContext } from 'react-router-dom';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';

interface ReportCardInterface {
  id: string;
  time: string;
  index: number;
  user: string;
  performance: number;
}

const ReportCard: React.FC<ReportCardInterface> = ({
  id,
  time,
  user,
  performance,
  index,
}) => {
  const theme = useTheme();
  const props = useOutletContext();

  const getColor = (number: number, isDarkMode: boolean): string => {
    const lightColors = ['#666', '#fafafa', '#fff'];
    const darkColors = ['#c5c5c5', '#b1b1b1', '#d7d7d7'];
    const colorRange = isDarkMode ? darkColors : lightColors;

    if (number <= 49) return colorRange[0];
    if (number <= 80) return colorRange[1];
    if (number <= 100) return colorRange[2];
    return '';
  };

  const getColorBackground = (number: number, isDarkMode: boolean): string => {
    const lightColors = ['#DAD1D1', '#416d6c', '#13b7b5'];
    const darkColors = ['#443f3f', '#2a4747', '#0d6966'];
    const colorRange = isDarkMode ? darkColors : lightColors;

    if (number <= 49) return colorRange[0];
    if (number <= 80) return colorRange[1];
    if (number <= 100) return colorRange[2];
    return '';
  };

  const isDarkMode = props.isDarkMode !== 'light';

  return (
    <Wrapper>
      <Container>
        <Indicator color={theme.subButtonColor}>
          <span style={{ fontWeight: 600 }}>{index}</span>
        </Indicator>
        <Indicator color={theme.subButtonColor}>
          <Title>Report: </Title> <Date>{time}</Date>
        </Indicator>
      </Container>
      <Container>
        {performance > 0 && (
          <Indicator
            color={
              performance > 80
                ? isDarkMode
                  ? '#504a16'
                  : '#ead79f'
                : isDarkMode
                ? '#242424'
                : '#e9e9e9'
            }
          >
            <FaIcons.FaCrown
              style={{
                transform: 'scale(1.1)',
                color:
                  performance > 80
                    ? isDarkMode
                      ? '#ffdb69'
                      : '#c8a507'
                    : isDarkMode
                    ? '#828171'
                    : '#c5bc9f',
              }}
            />
            <span
              style={{
                color:
                  performance > 80
                    ? isDarkMode
                      ? '#ffdb69'
                      : '#a3751b'
                    : isDarkMode
                    ? '#828171'
                    : '#726c59',
              }}
            >
              {user}
            </span>
          </Indicator>
        )}
        <Indicator color={getColorBackground(performance, isDarkMode)}>
          <span
            style={{
              color: getColor(performance, isDarkMode),
            }}
          >
            Team's performance:
          </span>
          <span
            style={{
              color: getColor(performance, isDarkMode),
            }}
          >
            {performance}%
          </span>
        </Indicator>
        <Link to={`/report/${id}`} style={{ textDecoration: 'none' }}>
          <Button>
            View report
            <AiIcons.AiFillFolderOpen
              style={{ transform: 'scale(1.1)' }}
            ></AiIcons.AiFillFolderOpen>
          </Button>
        </Link>
      </Container>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 96%;
  height: 3rem;
  padding: 0.5rem 0.5rem 0.5rem 1.5rem;
  border-radius: 5px;
  align-items: center;
  display: flex;
  justify-content: space-between;
  border: 0px solid ${({ theme }) => theme.borderColor};
  background: ${({ theme }) => theme.background};
`;

const Container = styled.div`
  display: flex;
  gap: 0.8rem;
`;

const Indicator = styled.button`
  color: ${({ theme }) => theme.text};
  display: flex;
  position: relative;
  gap: 0.5rem;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme, color }) => (color ? color : theme.subBackground)};
  text-align: center;
  text-decoration: none;
  border: 0px solid ${({ theme }) => theme.borderColor};
  border-radius: 5px;
  padding: 0.85rem 1rem 0.725rem 1rem;
`;
const Button = styled.button`
  color: ${({ theme }) => theme.text};
  display: flex;
  position: relative;
  gap: 0.5rem;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme, color }) => (color ? color : theme.subBackground)};
  text-align: center;
  cursor: pointer;
  text-decoration: none;
  border: 0px solid ${({ theme }) => theme.borderColor};
  border-radius: 5px;
  padding: 0.85rem 1rem 0.725rem 1rem;
`;

const Title = styled.span`
  font-weight: 600;
  font-size: 1rem;
`;
const Date = styled.span`
  font-weight: 400;
  font-size: 1rem;
`;

const glowAnimation = keyframes`
  0% {text-shadow: 0 0 4px #ffe594;}
  20% {text-shadow: 0 0 8px #fff794;}
  60% {text-shadow: 0 0 12px #fff}
  80% {text-shadow: 0 0 8px #fff794}
  100% {text-shadow: 0 0 4px #ffe594}
`;

export default ReportCard;
