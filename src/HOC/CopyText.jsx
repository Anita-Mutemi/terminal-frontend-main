// import React from 'react';
import { message } from 'antd';
// import { CopyOutlined } from '@ant-design/icons';
import { FaRegCopy } from 'react-icons/fa6';

const CopyWrapper = ({ children, textToCopy }) => {
  const handleCopyClick = () => {
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        message.success(`${textToCopy} copied to clipboard`);
      })
      .catch((err) => {
        message.error('Failed to copy text');
        console.error('Failed to copy text: ', err);
      });
  };

  return (
    <div
      style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
      onClick={handleCopyClick}
    >
      {children}
      <FaRegCopy
        style={{
          marginLeft: 5,
          marginBottom: 15,
          maxWidth: '0.89rem',
        }}
      />

      {/* <CopyOutlined
        style={{
          marginLeft: 5,
          marginBottom: 15,
          maxWidth: '0.89rem',
          display: 'inline-block !important',
        }}
      /> */}
    </div>
  );
};

export default CopyWrapper;
