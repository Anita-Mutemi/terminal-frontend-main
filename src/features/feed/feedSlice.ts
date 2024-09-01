import { createSlice } from '@reduxjs/toolkit';
import {
  getFeed,
  getFeedInitial,
  getFeedData,
  getGoodProjects,
  getGreatProjects,
  getUnratedProjectsNumber,
  getUnratedProjects,
  getHistoryFeed,
  getResurfacing,
  getFavourites,
  postFavoriteProject,
  postFavoriteProjectFull,
  postFeedback,
  postRating,
  postRatingFull,
} from './feedActions';

const initialState = {
  loading: false,
  showHistory: false,
  unratedProjects: 0,
  projects: {
    verticals: [],
    projects: [],
    funds: [],
  },
  error: null,
};

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: {
    // @ts-ignore
    [getFeed.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    // @ts-ignore
    [getFeed.fulfilled]: (state, { payload }) => {
      // fix this, it is a stupid workaround
      state.showHistory = false;
      state.loading = false;
      state.projects = payload;
    },
    // @ts-ignore
    [getFeed.rejected]: (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    },
    // @ts-ignore
    [getResurfacing.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    // @ts-ignore
    [getResurfacing.fulfilled]: (state, { payload }) => {
      // fix this, it is a stupid workaround
      state.showHistory = false;
      state.loading = false;
      state.projects = payload;
    },
    // @ts-ignore
    [getResurfacing.rejected]: (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    },
    // @ts-ignore
    [getFeedInitial.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    // @ts-ignore
    [getFeedInitial.fulfilled]: (state, { payload }) => {
      // fix this, it is a stupid workaround
      if (payload.projects.length > 0) {
        state.showHistory = payload.projects[0].project_user_info.archived;
      }
      state.loading = false;
      state.projects = payload;
    },
    // @ts-ignore
    [getFeedInitial.rejected]: (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    },
    // @ts-ignore
    [getUnratedProjects.pending]: (state, { payload }) => {
      state.loading = true;
      state.error = null;
    },
    // @ts-ignore
    [getUnratedProjects.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.projects.projects = payload;
    },
    // @ts-ignore
    [getUnratedProjects.rejected]: (state, { payload }) => {
      state.loading = false;
      state.error = true;
    },
    // @ts-ignore
    [getHistoryFeed.pending]: (state) => {
      state.showHistory = true;
      state.loading = true;
      state.error = null;
    },
    // @ts-ignore
    [getHistoryFeed.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.projects = payload;
    },
    // @ts-ignore
    [getHistoryFeed.rejected]: (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    },
    // @ts-ignore
    [getGoodProjects.pending]: (state) => {
      state.showHistory = false;
      state.loading = true;
      state.error = null;
    },
    // @ts-ignore
    [getGoodProjects.fulfilled]: (state, { payload }) => {
      state.showHistory = false;
      state.loading = false;
      state.projects.projects = payload;
    },
    // @ts-ignore
    [getGoodProjects.rejected]: (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    },
    // @ts-ignore
    [getGreatProjects.pending]: (state) => {
      state.showHistory = false;
      state.loading = true;
      state.error = null;
    },
    // @ts-ignore
    [getGreatProjects.fulfilled]: (state, { payload }) => {
      state.showHistory = false;
      state.loading = false;
      state.projects.projects = payload;
    },
    // @ts-ignore
    [getGreatProjects.rejected]: (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    },
    // @ts-ignore
    [getFavourites.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    // // @ts-ignore
    // [getUnratedProjectsNumber.pending]: (state) => {
    //   state.loading = true;
    //   state.error = null;
    // },
    // @ts-ignore
    [getUnratedProjectsNumber.fulfilled]: (state, { payload }) => {
      // state.loading = false;
      // state.error = null;
      state.unratedProjects = payload;
    },
    // @ts-ignore
    [getFavourites.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.projects.projects = payload;
    },
    // @ts-ignore
    [getFavourites.rejected]: (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    },
    // @ts-ignore
    [postFavoriteProject.fulfilled]: (state, { payload }) => {
      state.loading = false;
      // state.projects.projects = payload;
    },
    // @ts-ignore
    [postFavoriteProjectFull.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.projects.projects = payload;
    },
    // @ts-ignore
    [postRating.fulfilled]: (state, { payload }) => {
      state.loading = false;
      // state.projects.projects = payload;
    },
    // @ts-ignore
    [postRatingFull.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.projects.projects = payload;
    },
    // @ts-ignore
    [postFeedback.fulfilled]: (state, { payload }) => {
      state.loading = false;
      // state.projects.projects = payload;
    },
  },
});
export default feedSlice.reducer;
