import React from 'react';
import { Table } from 'antd';
import styled, { useTheme } from 'styled-components';
import { Tooltip } from 'antd';

const StyledTable = styled(Table)`
  filter: saturate(0.35);
  margin-left: 2rem;
  cursor: 'not-allowed' !important;

  .ant-table-thead > tr > th {
    background-color: ${({ checked, theme }) => theme.additionalBackground};
    /* background: ${(props) =>
      props.theme.body}; // Use theme or a fixed color */
    color: ${({ checked, theme }) => theme.subText};
    cursor: 'not-allowed' !important;
  }
  .ant-table-thead > tr > td {
    background: ${({ checked, theme }) => theme.body};
    cursor: 'not-allowed' !important;
  }
  .ant-table-thead > td {
    /* background: ${({ checked, theme }) => theme.body}; */
    cursor: 'not-allowed' !important;
  }

  table:hover,
  tr:hover,
  thead:hover {
    background: ${({ theme }) => theme.body};
    cursor: 'not-allowed' !important;
  }

  .ant-table-tbody > tr.ant-table-row:hover > td {
    background: ${({ theme }) => theme.body};
    cursor: 'not-allowed' !important;
  }

  .ant-table-tbody > tr > td {
    background: ${(props) => props.theme.text}; // Use theme or a fixed color
    background-color: ${({ checked, theme }) => theme.background};
    color: ${({ checked, theme }) => theme.subText};
    cursor: 'not-allowed' !important;
  }

  .ant-table-tbody > tr:hover > td {
    background: none !imortant; /* Remove background change on hover */
    cursor: 'not-allowed' !important;
  }
`;

const DifferenceTable = () => {
  const theme = useTheme();
  const columns = [
    {
      title: <span style={{ fontSize: '12px' }}>Growth rate</span>, // Make header font size smaller
      dataIndex: 'growthRate',
      key: 'growthRate',
      fixed: 'left',
      width: 150,
      render: (text) => <span style={{ fontSize: '12px' }}>{text}</span>,
    },
    {
      title: <span style={{ fontSize: '12px' }}>24h</span>, // Make header font size smaller
      dataIndex: '24h',
      key: '24h',
      render: (text) => (
        <span
          style={{
            color: parseFloat(text) >= 0 ? 'green' : 'red',
            fontSize: '12px',
            lineHeight: '1.2',
          }}
        >
          {text}
        </span>
      ),
    },
    {
      title: <span style={{ fontSize: '12px' }}>7d</span>, // Make header font size smaller
      dataIndex: '7d',
      key: '7d',
      render: (text) => (
        <span
          style={{
            color: parseFloat(text) >= 0 ? 'green' : 'red',
            fontSize: '12px',
            lineHeight: '1.2',
          }}
        >
          {text}
        </span>
      ),
    },
    {
      title: <span style={{ fontSize: '12px' }}>30d</span>, // Make header font size smaller
      dataIndex: '30d',
      key: '30d',
      render: (text) => (
        <span
          style={{
            color: parseFloat(text) >= 0 ? 'green' : 'red',
            fontSize: '12px',
            lineHeight: '1.2',
          }}
        >
          {text}
        </span>
      ),
    },
    {
      title: <span style={{ fontSize: '12px' }}>90d</span>, // Make header font size smaller
      dataIndex: '90d',
      key: '90d',
      render: (text) => (
        <span
          style={{
            color: parseFloat(text) >= 0 ? 'green' : 'red',
            fontSize: '12px',
            lineHeight: '1.2',
          }}
        >
          {text}
        </span>
      ),
    },
    {
      title: <span style={{ fontSize: '12px' }}>180d</span>, // Make header font size smaller
      dataIndex: '180d',
      key: '180d',
      render: (text) => (
        <span
          style={{
            color: parseFloat(text) >= 0 ? 'green' : 'red',
            fontSize: '12px',
            lineHeight: '1.2',
          }}
        >
          {text}
        </span>
      ),
    },
    {
      title: <span style={{ fontSize: '12px' }}>365d</span>, // Make header font size smaller
      dataIndex: '365d',
      key: '365d',
      render: (text) => (
        <span
          style={{
            color: parseFloat(text) >= 0 ? 'green' : 'red',
            fontSize: '12px',
            lineHeight: '1.2',
          }}
        >
          {text}
        </span>
      ),
    },
  ];

  const data = [
    {
      'key': '1',
      'growthRate': 'Robotics',
      '24h': '+0.8%',
      '7d': '+6.7%',
      '30d': '-0.0%',
      '90d': '-24.3%',
      '180d': '-48.9%',
      '365d': '-55.5%',
    },
    {
      'key': '2',
      'growthRate': 'Software',
      '24h': '-100.0%',
      '7d': '+2242.5%',
      '30d': '+710.1%',
      '90d': '-98.5%',
      '180d': '-81.3%',
      '365d': '-83.4%',
    },
  ];

  return (
    <>
      <style>
        {`
        .ant-table,
        .ant-table-container,
        .ant-table-cell {
          border-color: ${theme.borderColor} !important; /* Using !important to ensure override */
        }
        `}
      </style>
      <div style={{ overflow: 'hidden' }}>
        <div style={{ width: '100%', position: 'relative' }}>
          <div
            style={{
              background: theme.body,
              opacity: 0.6,
              position: 'absolute',
              width: '100%',
              marginLeft: '2rem',
              borderRadius: '10px',
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 999,
            }}
          >
            <h3
              style={{
                position: 'absolute',
                color: theme.text,
                fontSize: '24px',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            >
              Coming soon ...
            </h3>
          </div>
          <StyledTable
            columns={columns}
            dataSource={data}
            bordered
            pagination={false}
            headerStyle={{ background: theme.additionalBackground }}
            size='small' // Use "small" size to make the table more compact
          />
        </div>
      </div>
    </>
  );
};

export default DifferenceTable;
