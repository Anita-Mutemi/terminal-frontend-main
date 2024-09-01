import React from 'react';
import { Button, Tag } from 'antd';
import { useTheme } from 'styled-components';
import { EditOutlined } from '@ant-design/icons';
import { Badge, Space } from 'antd';

function AIListSidebarItem({ list, onEdit, isSelected, onSelect }) {
  const truncatedName =
    list.name.length > 10 ? `${list.name.substring(0, 14)}...` : list.name;

  const theme = useTheme();

  const itemStyle = {
    borderLeft: `3px solid theme.borderColor`, // Replace with actual color value
    marginLeft: '0.3rem',
    padding: '0.5rem',
    display: 'flex',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: '0.9rem',
    backgroundColor: isSelected ? theme.subBackground : 'transparent', // Highlight if selected
  };

  return (
    <div style={itemStyle} onClick={() => onSelect(list)}>
      <Badge
        status={list.active ? 'success' : 'error'}
        text={truncatedName}
        style={{ color: theme.text }}
      />

      {/* <span
        style={{ cursor: 'pointer' }}
        onClick={() => {
        }}
      >
        {truncatedName}
        {list.active && (
          <Tag color='green' style={{ marginLeft: '0.5rem' }}>
            Active
          </Tag>
        )}
      </span> */}
      <Button
        type='link'
        icon={
          <EditOutlined
            style={{ fill: 'rgb(28, 198, 164)', color: 'rgb(28, 198, 164)' }}
          />
        }
        onClick={() => onEdit(list)}
        style={{ padding: 0, border: 'none' }}
      />
    </div>
  );
}

export default AIListSidebarItem;
