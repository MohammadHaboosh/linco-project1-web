import { configureStore } from '@reduxjs/toolkit';
import userReducer from "../features/User/store/userSlice.js" ;

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
});