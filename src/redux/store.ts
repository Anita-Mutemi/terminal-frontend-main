import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/user/userSlice';
import projectsReducer from '../features/feed/feedSlice';
import counterReducer from '../features/counter/counterSlice';
import feedSliceReducer from '../features/feed/FeedDataSlice';
import historySliceReducer from '../features/feed/historyDataSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    user: userReducer,
    projects: projectsReducer,
    feedData: feedSliceReducer,
    history: historySliceReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
