import React from 'react';
import styled from 'styled-components';

const ErrorContainer = styled.div`
  width: auto;
  padding: 16px;
  margin: 16px 0;
  margin-right: 0.5rem;
  margin-left: 0.3rem;
  border: 1px solid #f00;
  border-radius: 4px;
  background-color: #fff0f0;
  color: #900;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
`;

const ErrorTitle = styled.h1`
  margin-top: 0;
  color: #d00;
`;

const ErrorDetails = styled.details`
  white-space: pre-wrap;
`;

const ErrorSummary = styled.summary`
  font-weight: bold;
  cursor: pointer;
`;
export class GeneralErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Catch errors in any components below and re-render with error message
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
    // You can also log error messages to an error reporting service here
  }

  render() {
    if (this.state.hasError) {
      // Error path
      return (
        <ErrorContainer>
          <ErrorTitle>{this.props.customMessage ?? 'Something went wrong'}</ErrorTitle>
          <ErrorDetails>
            <ErrorSummary>Click for error details</ErrorSummary>
            {this.state?.error && String(this?.state?.error?.toString())}
          </ErrorDetails>
        </ErrorContainer>
      );
    }
    // Normally, just render children
    return this.props.children;
  }
}
