// @ts-nocheck
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
// TODO: http service etc

// userAction.js

export const userLogin = createAsyncThunk(
  '/token',
  async (values, { rejectWithValue }) => {
    function getFormData(object) {
      const formData = new FormData();
      Object.keys(object).forEach((key) => formData.append(key, object[key]));
      return formData;
    }

    try {
      const { data } = await axios.post('/token', getFormData(values));
      localStorage.setItem('access_token', data.access_token);
      return data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 422) {
          const missingFields = error.response.data.detail.map(
            (detail) => detail.loc[1],
          );
          let errorMessage = '';
          // Check for specific missing fields and construct the error message
          if (
            missingFields.includes('username') &&
            missingFields.includes('password')
          ) {
            errorMessage = 'Email and Password are required';
          } else if (missingFields.includes('username')) {
            errorMessage = 'Email is required';
          } else if (missingFields.includes('password')) {
            errorMessage = 'Password is required';
          }

          return rejectWithValue(errorMessage);
        }

        // Handle other error statuses
        switch (error.response.status) {
          case 401:
            return rejectWithValue('Invalid credentials [401]');
          case 500:
            return rejectWithValue(
              'Server error. Please try again later. [500]',
            );
          case 502:
            return rejectWithValue(
              'Server is currently unreachable. Please try again later. [502]',
            );
          default:
            return rejectWithValue(
              error.response.data?.message || 'Something went wrong',
            );
        }
      } else {
        return rejectWithValue('An unexpected error occurred');
      }
    }
  },
);

export const getUserDetails = createAsyncThunk(
  '/users/me',
  async (arg, { getState, rejectWithValue }) => {
    try {
      // get user data from store
      const { user }: any = getState();
      // configure authorization header with user's token
      const config = {
        headers: {
          Authorization: `Bearer ${user.access_token}`,
        },
      };
      const { data } = await axios.get(`/users/me`, config);
      return data;
    } catch (error: any) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  },
);
