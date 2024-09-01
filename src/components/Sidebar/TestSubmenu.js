import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled, { useTheme } from 'styled-components';
import * as TfiIcons from 'react-icons/tfi';

const SidebarLink = styled(Link)`
  display: flex;
  color: #e1e9fc;
  justify-content: ${({ sidebar }) => (sidebar ? 'space-between' : 'center')};
  align-items: center;
  list-style: none;
  height: 25px;
  text-decoration: none;
  font-size: 13.5px;
  border-radius: 5px;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  padding-left: 0.7rem;
  padding-right: 0.7rem;
  transition: all 0.2s linear;

  &:hover {
    background: ${({ theme }) => theme.subBackground};
    cursor: pointer;
  }

  &:active {
    transform: scale(0.98);
  }
`;

const SidebarLabel = styled.span`
  margin-left: 16px;
  white-space: nowrap;
  color: ${({ theme }) => theme.text};
`;

const LinkWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const SubMenuWrapper = styled.div`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  /* height: 100%; */
  /* max-height: ${({ maxSize }) => (maxSize ? '45rem' : '15rem')}; */
  list-style: none;
  text-decoration: none;
  font-size: 13px;
  border-radius: 5px;
  overflow: auto;
  overflow-x: hidden;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  padding-left: 0.7rem;
  padding-right: 0.7rem;
`;

const Wrapper = styled.div`
  height: auto;
`;

const TestSubmenu = ({
  title,
  Icon,
  subnavigation,
  sidebar,
  children,
  onClick,
  isOpen,
  isSubmenu,
}) => {
  const [subnav, setSubnav] = useState(isOpen);
  const showSubnav = () => setSubnav(!subnav);
  const theme = useTheme();
  return (
    <Wrapper maxSize={title === 'Investment Fund'} onClick={onClick}>
      <SidebarLink
        onClick={subnavigation && showSubnav}
        sidebar={sidebar}
        subnav={subnav}
      >
        <LinkWrapper>
          {!sidebar && (
            <div
              style={{
                background: theme.body,
                border: `0px solid ${theme.borderColor}`,
                borderRadius: '3px',
                padding: '6.5px 9.5px 6.5px 9.5px',
              }}
            >
              {Icon}
            </div>
          )}
          {sidebar && Icon}
          {sidebar && <SidebarLabel>{title}</SidebarLabel>}
        </LinkWrapper>
        {children && sidebar && (
          <div>
            {subnavigation && subnav ? (
              <TfiIcons.TfiAngleUp
                style={{ transform: 'scale(0.7)', fill: theme.sideBarSubMenuTitle }}
              />
            ) : subnavigation ? (
              <TfiIcons.TfiAngleDown
                style={{ transform: 'scale(0.7)', fill: theme.sideBarSubMenuTitle }}
              />
            ) : null}
          </div>
        )}
      </SidebarLink>
      {/* hide via css */}
      {children && subnav && sidebar && (
        <SubMenuWrapper maxSize={title === 'Investment Fund'}>{children}</SubMenuWrapper>
      )}
    </Wrapper>
  );
};

export default TestSubmenu;
