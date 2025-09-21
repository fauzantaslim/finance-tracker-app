import { configureStore } from "@reduxjs/toolkit";
import loadingReducer from "./slices/loadingSlice";
import authReducer from "./slices/authSlice";

const store = configureStore({
  reducer: {
    loading: loadingReducer,
    auth: authReducer,
  },
});
console.log("create store :", store.getState());
// subscribe
store.subscribe(() => {
  console.log("store change", store.getState());
});

export default store;
// Type exports removed for JavaScript
