import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserDetails } from '../features/user/userActions';
import { useNavigation } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
//@ts-ignore
const Main = () => {
  //@ts-ignore
  const { userInfo, access_token } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  // automatically authenticate user if token is found
  useEffect(() => {
    if (access_token) {
      //@ts-ignore
      dispatch(getUserDetails());
    }
  }, [access_token, dispatch]);

  return (
    <div>
      <Outlet />
    </div>
  );
};

export default Main;
