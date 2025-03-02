import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { publicPost } from '../../../utils/apiCaller';

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

const patientAuthSlice = createSlice({
  name: "patientAuth",
  initialState: {
    isAuthenticated: false,
    isLoading: false,
    verifyLoading: false,
    user: null,
    token: null,
    error: null,
    status: "idle",
  },
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      // Send OTP
      .addCase(sendOtp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.status = "sending_otp";
      })
      .addCase(sendOtp.fulfilled, (state, action) => {
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
        state.verifyLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.token = action.payload.token;
        state.status = "logged_in";
      })
      .addCase(patientLogin.rejected, (state, action) => {
        state.verifyLoading = false;
        state.error = "Login failed";
        state.status = "error";
      });
  },
});

export const { logout } = patientAuthSlice.actions;
export default patientAuthSlice.reducer;
