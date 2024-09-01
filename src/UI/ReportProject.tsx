import React from 'react';
import styled from 'styled-components';

const ReportProject = () => {
  return <ProjectWrapper>ReportProject</ProjectWrapper>;
};

const ProjectWrapper = styled.div`
  width: 100%;
  min-height: 15rem;
  background: ${({ theme }) => theme.body};
  border: 1px solid ${({ theme }) => theme.borderColor};
  border-radius: 5px;
`;


export default ReportProject;
