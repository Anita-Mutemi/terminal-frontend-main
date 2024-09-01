import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const SidebarLink = styled(Link)`
  display: flex;
  color: #e1e9fc;
  justify-content: ${({ sidebar }) => (sidebar ? 'space-between' : 'center')};
  align-items: center;
  list-style: none;
  height: 20px;
  text-decoration: none;
  font-size: 14px;
  border-radius: 5px;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  padding-left: 0.7rem;
  padding-right: 0.7rem;

  &:hover {
    background: #eeeeee;
    cursor: pointer;
  }
`;

const SidebarLabel = styled.span`
  margin-left: 16px;
  color: var(--secondary-text);
`;

const LinkWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const DropdownLink = styled(Link)`
  height: 300px;
  display: flex;
  align-items: center;
  text-decoration: none;
  color: var(--secondary-text);
  font-size: 14px;
  border-left: 4px solid var(--prime);

  &:hover {
    cursor: pointer;
  }
`;

const SubMenu = ({ item, sidebar }) => {
  const [subnav, setSubnav] = useState(false);

  const showSubnav = () => setSubnav(!subnav);

  return (
    <>
      <SidebarLink to={item.path} onClick={item.subNav && showSubnav} sidebar={sidebar}>
        <LinkWrapper>
          {item.icon}
          {sidebar && <SidebarLabel>{item.title}</SidebarLabel>}
        </LinkWrapper>
        {sidebar && (
          <div>
            {item.subNav && subnav
              ? item.iconOpened
              : item.subNav
              ? item.iconClosed
              : null}
          </div>
        )}
      </SidebarLink>
      {subnav &&
        sidebar &&
        item.subNav.map((item, index) => {
          return (
            <DropdownLink to={item.path} key={index}>
              {item.icon}
              {sidebar && <SidebarLabel>{item.title}</SidebarLabel>}
            </DropdownLink>
          );
        })}
    </>
  );
};

export default SubMenu;
