import React, { useState } from 'react';

import {
  Modal,
  Button,
  Input,
  Switch,
  Divider,
  Popconfirm,
  Typography,
  Tag,
} from 'antd';
const { Title, Text } = Typography;

function AIPromptModal({ list, isVisible, onClose, onUpdate, onDelete }) {
  const [promptName, setPromptName] = useState(list?.name || '');
  const [promptText, setPromptText] = useState(list?.prompt || '');
  const [active, setActive] = useState(list?.active || false);

  if (!list) return null; // Render nothing if list is not provided

  const handleSave = () => {
    onUpdate(list.id, {
      name: promptName,
      prompt: promptText,
      active: active,
    });
    onClose();
  };

  return (
    <Modal
      title={<Title level={4}>Edit Thesis</Title>}
      visible={isVisible}
      onCancel={onClose}
      footer={[
        <Popconfirm
          key='delete'
          title='Are you sure to delete this list?'
          onConfirm={() => onDelete(list.id)}
          okText='Yes'
          cancelText='No'
        >
          <Button danger>Delete</Button>
        </Popconfirm>,
        <Button
          key='save'
          type='primary'
          onClick={handleSave}
          style={{ background: 'rgb(28, 198, 164)' }}
        >
          Save
        </Button>,
      ]}
      style={{ maxWidth: '600px' }}
    >
      <div style={{ marginBottom: '1rem' }}>
        <Text strong>Thesis Name:</Text>
        <Input
          value={promptName}
          onChange={(e) => setPromptName(e.target.value)}
          style={{ marginTop: '0.5rem' }}
        />
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <Text strong>Thesis Description:</Text>
        <Input.TextArea
          value={promptText}
          onChange={(e) => setPromptText(e.target.value)}
          rows={4}
          style={{ marginTop: '0.5rem' }}
        />
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <Text strong>Active:</Text>
        <Switch
          checked={active}
          onChange={(checked) => {
            setActive(!active);
            onUpdate(list.id, { ...list, active: !active });
          }}
          style={{
            marginLeft: '0.5rem',
            background: active ? 'rgb(28, 198, 164)' : 'gray',
          }}
        />
      </div>
      <Divider />
      <div>
        <Text strong>Author:</Text> {list.author.username}
        <br />
        <Text strong>Created On:</Text>{' '}
        {new Date(list.created_on).toLocaleDateString()}
        {list.edited_on && (
          <>
            <br />
            <Text strong>Edited On:</Text>{' '}
            {new Date(list.edited_on).toLocaleDateString()}
          </>
        )}
        <br />
        <Text strong>Projects Count:</Text> {list.projects_count}
        <br />
        {list.active && (
          <Tag color='green' style={{ marginTop: '0.5rem' }}>
            Active
          </Tag>
        )}
      </div>
      <Divider />
      <div style={{ fontSize: '0.9rem', color: '#888' }}>
        <h4>Example Thesis:</h4>
        <p>
          "Early stage companies specialising in carbon capture technology
          within Europe."
        </p>
      </div>
    </Modal>
  );
}

export default AIPromptModal;
