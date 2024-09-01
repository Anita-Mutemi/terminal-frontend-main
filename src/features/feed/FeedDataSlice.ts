import { createSlice } from '@reduxjs/toolkit';
import { getFeedData } from './feedActions';

const initialState = {
  loading: false,
  projects: {
    projects: [],
    funds: [],
  },
  error: null,
};

const feedDataSlice = createSlice({
  name: 'feedData',
  initialState,
  reducers: {
    getFeedData: (state, { payload }) => {
      state.projects = payload;
    },
  },
  extraReducers: {
    // @ts-ignore
    [getFeedData.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    // @ts-ignore
    [getFeedData.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.projects = payload;
    },
    // @ts-ignore
    [getFeedData.rejected]: (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    },
  },
});
export default feedDataSlice.reducer;
