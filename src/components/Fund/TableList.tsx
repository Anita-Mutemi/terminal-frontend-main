// @ts-nocheck
import React, { useState } from 'react';
import { Typography } from 'antd';
import styled, { useTheme } from 'styled-components';

const { Paragraph } = Typography;

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
  background: ${({ theme }) => theme.subBackground};
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const StyledTypography = styled(Paragraph)`
  font-size: 0.76rem;
`;

interface TableListInterface {
  data: Array<{ title: string; content: string }>;
}

const TableList: React.FC<TableListInterface> = ({ data }) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggleExpand = (title: string) => {
    setExpanded((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const renderContent = (item: { title: string; content: string }) => {
    const isExpanded = expanded[item.title];
    const content = item.content === '' ? 'N/A' : item.content;

    return (
      <>
        {isExpanded ? content : content.substring(0, 32)}
        {content.length > 30 && (
          <span
            style={{ color: '#40e0d0', cursor: 'pointer' }}
            onClick={() => toggleExpand(item.title)}
          >
            {isExpanded ? ' show less' : ' ... show more'}
          </span>
        )}
      </>
    );
  };

  if (!data || data.length === 0) {
    return <h4>Summary will be provided shortly.</h4>;
  }

  return (
    <StyledOl>
      {data.map((item) => {
        if (item.content !== '') {
          return (
            <StyledLi key={item.title}>
              <StyledTypography style={{ color: theme.subTitle, marginBottom: '0rem', textTransform: 'capitalize'
 }}>
                {item.title}
              </StyledTypography>
              <StyledTypography style={{ color: theme.text, marginBottom: '0rem' }}>
                {renderContent(item)}
              </StyledTypography>
            </StyledLi>
          );
        } else {
          return null;
        }
      })}
    </StyledOl>
  );
};

export default TableList;
