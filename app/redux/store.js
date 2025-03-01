import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";

const middlewares = [];

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }).concat(middlewares),
});

export default store;
