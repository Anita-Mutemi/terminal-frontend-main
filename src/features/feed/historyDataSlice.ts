// @ts-nocheck
import { createSlice } from '@reduxjs/toolkit';
import { getHistoryFeedFunds } from './feedActions';

const initialState = {
  loading: false,
  projects: {
    verticals: [],
    projects: [],
    funds: [],
  },
  error: null,
};

const feedSlice = createSlice({
  name: 'history',
  initialState,
  reducers: {},
  extraReducers: {
    [getHistoryFeedFunds.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [getHistoryFeedFunds.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.projects = payload;
    },
    [getHistoryFeedFunds.rejected]: (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    },
  },
});

export default feedSlice.reducer;
