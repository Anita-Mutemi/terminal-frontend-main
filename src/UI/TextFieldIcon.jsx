// Import React and styled-components
import React from 'react';
import styled from 'styled-components';

// Styled components
const TextFieldContainer = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #e4e4e4;
  border-radius: 4px;
  overflow: hidden;
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f1f1f1;
  padding: 0.91rem;
`;

const Input = styled.input`
  flex-grow: 1;
  border: none;
  outline: none;
  padding: 0.5em;
  padding-left: 1rem;
  font-size: 15px;

  ::placeholder {
    color: #7d7d7d;
  }
`;

// TextField component definition
const TextFieldIcon = React.forwardRef(({ icon: Icon, styles, ...props }, ref) => {
  return (
    <TextFieldContainer style={{ ...styles }}>
      {Icon && (
        <IconContainer>
          <Icon style={{ color: 'gray', fill: 'gray' }} />
        </IconContainer>
      )}
      <Input {...props} ref={ref} />
    </TextFieldContainer>
  );
});

export default TextFieldIcon;
