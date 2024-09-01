//@ts-nocheck
import { createGlobalStyle } from 'styled-components';
export const GlobalStyles = createGlobalStyle`
  body {
    background: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text};
    transition: all 0.40s linear;
  }
 .ant-btn-primary {
  &:hover {
    color:#40e0d0 !important;
    border-color: #40e0d0 !important;
  }
}
  `;
