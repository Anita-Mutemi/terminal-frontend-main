import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const getFeed = createAsyncThunk(
  'v1/feed',
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
      const { data } = await axios.get(`/v1/feed/history`, config);

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
export const getFeedInitial = createAsyncThunk(
  'v1/feed/inital',
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
      const { data } = await axios.get(`/v1/feed/history`, config);

      if (data.projects.length === 0) {
        const { data } = await axios.get(`/v1/feed/history`, config);
        return data;
      } else {
        return data;
      }
    } catch (error: any) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  },
);
export const getFeedData = createAsyncThunk(
  'v1/feed/feed',
  async (arg, { getState, rejectWithValue }) => {
    try {
      // get user data from store
      const { user, projects }: any = getState();
      // configure authorization header with user's token
      const config = {
        headers: {
          Authorization: `Bearer ${user.access_token}`,
        },
      };
      const { data } = await axios.get(`/v1/feed`, config);
      if (projects.projects.length === 0) {
        // const { data } = await axios.get(`/v1/feed/history`, config);
        // return data;
      }
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
export const getResurfacing = createAsyncThunk(
  'v1/feed/resurfaced',
  async (arg, { getState, rejectWithValue }) => {
    try {
      // get user data from store
      const { user, projects }: any = getState();
      // configure authorization header with user's token
      const config = {
        headers: {
          Authorization: `Bearer ${user.access_token}`,
        },
      };
      const { data } = await axios.get(`/v1/feed/resurfaced`, config);
      if (projects.projects.length === 0) {
        // const { data } = await axios.get(`/v1/feed/history`, config);
        // return data;
      }
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
export const getHistoryFeed = createAsyncThunk(
  'v1/feed/history',
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
      const { data } = await axios.get(`/v1/feed/history`, config);

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
export const getHistoryFeedFunds = createAsyncThunk(
  'history/funds',
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
      const { data } = await axios.get(`/v1/feed/history`, config);

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
export const getGoodProjects = createAsyncThunk(
  'v1/feed/good',
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
      const { data } = await axios.get(`/v1/feed/history`, config);

      return data.projects.filter((project: any) => {
        return project.project_user_info.rating === 2;
      });
    } catch (error: any) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  },
);
export const getGreatProjects = createAsyncThunk(
  'v1/feed/great',
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
      const { data } = await axios.get(`/v1/feed/history`, config);

      const check = data.projects.filter((project: any) => {
        return project.project_user_info.rating === 3;
      });
      return check;
    } catch (error: any) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  },
);
export const getUnratedProjects = createAsyncThunk(
  'v1/feed/unrated/projects',
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
      const { data } = await axios.get(`/v1/feed/history`, config);

      const check = data.projects.filter((project: any) => {
        return project.project_user_info.rating === null;
      });
      return check;
    } catch (error: any) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  },
);
export const getUnratedProjectsNumber = createAsyncThunk(
  'v1/feed/unratedNumber',
  async (currentDate, { getState, rejectWithValue }) => {
    try {
      // Get user data from store
      const { user }: any = getState();
      // Configure authorization header with the user's token
      const config = {
        headers: {
          Authorization: `Bearer ${user.access_token}`,
        },
      };
      const { data } = await axios.get(`/v1/feed/history`, config);

      // Get projects issued within the past 1 week and got no rating
      const twoWeeksAgo = new Date();
      twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 7);

      const check = data.projects.filter((project: any) => {
        const projectDate = new Date(
          project.project_user_info.time_recommended,
        );
        return (
          projectDate >= twoWeeksAgo &&
          project.project_user_info.rating === null
        );
      });
      return check.length;
    } catch (error: any) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  },
);
export const getFavourites = createAsyncThunk(
  '/v1/projects/favourites',
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
      const { data } = await axios.get(`/v1/projects/favourites`, config);
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

export const postFavoriteProject = createAsyncThunk(
  '/v1/projects/favourite',
  //@ts-ignore
  async (values, { getState, rejectWithValue }) => {
    const { projects, user }: any = getState();
    console.log('test');
    try {
      const config = {
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${user.access_token}`,
        },
      };
      const { data } = await axios.post(
        `/v1/projects/${values}/favourite`,
        null,
        config,
      );

      const updatedProjects = projects.projects.projects.map((project: any) => {
        if (project.project.uuid === values) {
          var copy = JSON.parse(JSON.stringify(project));
          copy.project_user_info.favourite = !copy.project_user_info.favourite;
          return copy;
        }
        return project;
      });

      return updatedProjects;
    } catch (error: any) {
      // return custom error message from API if any
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  },
);
export const postFavoriteProjectFull = createAsyncThunk(
  '/v1/projects/favourite/fullpage',
  //@ts-ignore
  async (values, { getState, rejectWithValue }) => {
    const { projects, user }: any = getState();

    try {
      const config = {
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${user.access_token}`,
        },
      };
      const { data } = await axios.post(
        `/v1/projects/${values}/favourite`,
        null,
        config,
      );

      const updatedProjects = projects.projects.projects.map((project: any) => {
        if (project.project.uuid === values) {
          var copy = JSON.parse(JSON.stringify(project));
          copy.project_user_info.favourite = !copy.project_user_info.favourite;
          return copy;
        }
        return project;
      });

      return updatedProjects;
    } catch (error: any) {
      // return custom error message from API if any
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  },
);
export const postRating = createAsyncThunk(
  '/v1/projects/rating',
  //@ts-ignore
  async (values, { getState, rejectWithValue }) => {
    const { projects, user }: any = getState();
    function getFormData(object: any) {
      const formData = new FormData();
      Object.keys(object).forEach((key) => formData.append(key, object[key]));
      return formData;
    }
    //@ts-ignore
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.access_token}`,
        },
      };
      const { data } = await axios.post(
        //@ts-ignore
        `/v1/projects/${values.id}/rating?rating=${values.value}`,
        //@ts-ignore
        null,
        config,
      );
      const updatedProjects = projects.projects.projects.map((project: any) => {
        //@ts-ignore
        if (project.project.uuid === values.id) {
          var copy = JSON.parse(JSON.stringify(project));
          //@ts-ignore
          copy.project_user_info.rating = values.value;
          return copy;
        }
        return project;
      });
      return updatedProjects;
    } catch (error: any) {
      // return custom error message from API if any
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  },
);
export const postRatingFull = createAsyncThunk(
  '/v1/projects/rating/fullpage',
  //@ts-ignore
  async (values, { getState, rejectWithValue }) => {
    const { projects, user }: any = getState();
    function getFormData(object: any) {
      const formData = new FormData();
      Object.keys(object).forEach((key) => formData.append(key, object[key]));
      return formData;
    }
    //@ts-ignore
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.access_token}`,
        },
      };
      const { data } = await axios.post(
        //@ts-ignore
        `/v1/projects/${values.id}/rating?rating=${values.value}`,
        //@ts-ignore
        null,
        config,
      );
      const updatedProjects = projects.projects.projects.map((project: any) => {
        //@ts-ignore
        if (project.project.uuid === values.id) {
          var copy = JSON.parse(JSON.stringify(project));
          //@ts-ignore
          copy.project_user_info.rating = values.value;
          return copy;
        }
        return project;
      });
      return updatedProjects;
    } catch (error: any) {
      // return custom error message from API if any
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  },
);
export const postFeedback = createAsyncThunk(
  '/v1/projects/feedback',
  //@ts-ignore
  async (values, { getState, rejectWithValue }) => {
    const { projects, user }: any = getState();
    function getFormData(object: any) {
      const formData = new FormData();
      Object.keys(object).forEach((key) => formData.append(key, object[key]));
      return formData;
    }
    //@ts-ignore
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.access_token}`,
        },
      };
      const { data } = await axios.post(
        //@ts-ignore
        `/v1/projects/${values.id}/feedback?feedback=${values.value}`,
        //@ts-ignore
        null,
        config,
      );
      const updatedProjects = projects.projects.projects.map((project: any) => {
        //@ts-ignore
        if (project.project.uuid === values.id) {
          var copy = JSON.parse(JSON.stringify(project));
          //@ts-ignore
          copy.project_user_info.feedback = values.value;
          return copy;
        }
        return project;
      });
      return updatedProjects;
    } catch (error: any) {
      // return custom error message from API if any
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  },
);
