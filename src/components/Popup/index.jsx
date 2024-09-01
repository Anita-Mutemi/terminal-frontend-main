import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, notification, Space } from 'antd';

const Popup = (props) => {
  const [api, contextHolder] = notification.useNotification();
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(true); // Add state variable to control popup visibility

  const openNotificationWithIcon = (type) => {
    const personName = props.name;
    const numberOfProjects = props.number;
    const message = 'Unseen Venture Opportunities';
    const description = `${personName}, ${
      numberOfProjects === 1
        ? `There has been ${numberOfProjects} project`
        : `There have been ${numberOfProjects} projects`
    } awaiting your review for the past week!`;

    api[type]({
      message: message,
      description: description,
      // btn: true && ( // Show the button only if showPopup is true
      //   <Button type='primary' onClick={() => redirectToProjectsPage()}>
      //     Go to Projects
      //   </Button>
      // ),
      duration: 300, // Notification will stay for 10 seconds
      onClose: () => {
        setShowPopup(false); // Hide the popup when the notification is closed
      },
    });
  };

  const redirectToProjectsPage = () => {
    // Replace 'projectspage' with the actual URL or route to your project page
    props.callback();
    setShowPopup(false);
  };

  useEffect(() => {
    openNotificationWithIcon('info');
  }, []);

  // Render the popup only when showPopup is true
  return showPopup ? (
    <>
      {contextHolder}
      <Space>
        {/* Button is now shown only when showPopup is true */}
        {/* <Button onClick={() => openNotificationWithIcon('warning')}>Warning</Button> */}
      </Space>
    </>
  ) : null;
};

export default Popup;
