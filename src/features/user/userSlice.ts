import { createSlice } from '@reduxjs/toolkit';
import { userLogin, getUserDetails } from './userActions';

const access_token = localStorage.getItem('access_token')
  ? localStorage.getItem('access_token')
  : null;

const initialState = {
  loading: false,
  userInfo: null, // for user object
  access_token, // for storing the JWT
  error: null,
  success: false, // for monitoring the registration process.
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('access_token'); // delete token from storage
      state.loading = false;
      state.userInfo = null;
      state.access_token = null;
      state.error = null;
    },
  },
  extraReducers: {
    // login user
    // @ts-ignore
    [userLogin.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    // @ts-ignore
    [userLogin.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.userInfo = payload;
      state.access_token = payload.access_token;
    },
    // @ts-ignore
    [userLogin.rejected]: (state, { payload }) => {
      state.loading = false;
      localStorage.removeItem('access_token'); // delete token from storage
      state.error = payload;
      state.userInfo = null;
      state.access_token = null;
    },
    // @ts-ignore
    [getUserDetails.pending]: (state) => {
      state.loading = true;
    },
    // @ts-ignore
    [getUserDetails.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.userInfo = payload;
    },
    // @ts-ignore
    [getUserDetails.rejected]: (state, { payload }) => {
      state.loading = false;
      localStorage.removeItem('access_token'); // delete token from storage
      state.userInfo = null;
      state.access_token = null;
    },
    // register user reducer...
  },
});
export const { logout } = userSlice.actions;
export default userSlice.reducer;
