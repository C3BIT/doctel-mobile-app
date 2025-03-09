import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { publicPost } from '../../../utils/apiCaller';
import { getUserData, removeUserData, saveUserData } from "../../../storage/storage";

export const sendOtp = createAsyncThunk(
  "patient/sendOtp",
  async (data, { rejectWithValue }) => {
    try {
      const response = await publicPost("/otp/send", data);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Something went wrong");
    }
  }
);

export const patientLogin = createAsyncThunk(
  "patient/login",
  async (data, { rejectWithValue }) => {
    try {
      const response = await publicPost("/patient/login", data);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Invalid OTP");
    }
  }
);

const storedData = getUserData();
const patientAuthSlice = createSlice({
  name: "patientAuth",
  initialState: {
    isAuthenticated: storedData?.isAuthenticated || false,
    isLoading: false,
    verifyLoading: false,
    user: storedData?.user || null,
    token: storedData?.token || null,
    phone: storedData?.phone || null,
    error: null,
    status: "idle",
  },
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.phone = null;
      state.status = "idle";
      removeUserData();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendOtp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.status = "sending_otp";
      })
      .addCase(sendOtp.fulfilled, (state) => {
        state.isLoading = false;
        state.status = "otp_sent";
      })
      .addCase(sendOtp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.message || "OTP sending failed";
        state.status = "error";
      })
      .addCase(patientLogin.pending, (state) => {
        state.verifyLoading = true;
        state.error = null;
        state.status = "logging_in";
      })
      .addCase(patientLogin.fulfilled, (state, action) => {
        console.log(action.payload)
        const { token, phone, user } = action.payload;
        state.verifyLoading = false;
        state.isAuthenticated = true;
        state.user = user;
        state.token = token;
        state.phone = phone;
        state.status = "logged_in";
        saveUserData(user, token, phone);
      })
      .addCase(patientLogin.rejected, (state, action) => {
        state.verifyLoading = false;
        state.error = "Unable to verify your credentials. Please try again.";
        state.status = "error";
      });
  },
});

export const { logout } = patientAuthSlice.actions;
export default patientAuthSlice.reducer;
