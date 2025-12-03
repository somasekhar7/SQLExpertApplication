// import { configureStore } from '@reduxjs/toolkit';
// import authReducer from './slices/authSlice';
// import progressReducer from './slices/progressSlice';

// export const store = configureStore({
//   reducer: {
//     auth: authReducer,
//     progress: progressReducer,
//   },
// });

// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;

import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // localStorage
import authReducer from "./slices/authSlice";
import progressReducer from "./slices/progressSlice";
import { combineReducers } from "redux";

const rootReducer = combineReducers({
  auth: authReducer,
  progress: progressReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"], // persist auth only
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
