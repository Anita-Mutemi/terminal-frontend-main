import React from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';
import * as RiIcons from 'react-icons/ri';
import * as TfiIcons from 'react-icons/tfi';

export const SidebarData = [
  {
    title: 'Vertical',
    path: '/dashboard',
    icon: <AiIcons.AiFillHome />,
    iconClosed: <TfiIcons.TfiAngleDown />,
    iconOpened: <TfiIcons.TfiAngleUp />,
    subNav: [
      {
        title: 'Users',
        path: '/overview/users',
        icon: <IoIcons.IoIosPaper />,
      },
      {
        title: 'Revenue',
        path: '/overview/revenue',
        icon: <IoIcons.IoIosPaper />,
      },
    ],
  },
];
