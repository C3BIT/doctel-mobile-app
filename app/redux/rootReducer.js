import { combineReducers } from "@reduxjs/toolkit";
import patientAuthReducer from "./features/auth/patientAuthSlice"
import patientReducer from "./features/patient/patientSlice"
import prescriptionReducer from "./features/prescriptions/prescriptionSlice";
const rootReducer = combineReducers({
  auth: patientAuthReducer,
  patient: patientReducer,
  prescriptions: prescriptionReducer,
});

export default rootReducer;
