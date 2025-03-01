import { combineReducers } from "@reduxjs/toolkit";
import patientAuthReducer from "./features/auth/patientAuthSlice"

const rootReducer = combineReducers({
  auth: patientAuthReducer,
});

export default rootReducer;
