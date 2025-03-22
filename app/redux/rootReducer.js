import { combineReducers } from "@reduxjs/toolkit";
import patientAuthReducer from "./features/auth/patientAuthSlice"
import patientReducer from "./features/patient/patientSlice"

const rootReducer = combineReducers({
  auth: patientAuthReducer,
  patient: patientReducer
});

export default rootReducer;
