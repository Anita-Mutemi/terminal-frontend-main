// @ts-nocheck
import { Typography } from '@mui/material';
import React from 'react';
import styled, { useTheme } from 'styled-components';

const StyledOl = styled.ol`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
  column-gap: 1rem;
  width: 100%;
`;

const StyledLi = styled.li`
  list-style-type: none;
  padding: 0.25rem;
  margin: 0rem;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  /* background: #f8f8f8; */
  background: ${({ theme }) => theme.subBackground};
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const StyledTypography = styled(Typography)`
  font-size: 0.76rem;
`;

interface TableListInterface {
  data: any;
}

const TableList = ({ data }: TableListInterface) => {
  const theme = useTheme();

  if (!data || data?.length === 0) {
    return <h4>Summary will be provided shortly.</h4>;
  }

  return (
    <StyledOl>
      {data?.map((item: { title: string; content: string }) => (
        <StyledLi key={item.title}>
          <StyledTypography sx={{ color: theme.subTitle }}>{item.title}</StyledTypography>
          <StyledTypography sx={{ color: theme.text }}>
            {item.content === '' ? 'N/A' : item.content}
          </StyledTypography>
        </StyledLi>
      ))}
    </StyledOl>
  );
};

export default TableList;
