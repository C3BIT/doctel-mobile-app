import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { privateGet, privatePutFile } from '../../../utils/apiCaller';

export const fetchPatientProfile = createAsyncThunk(
  "patient/fetchProfile",
  async (token , { rejectWithValue }) => {
    try {
      const response = await privateGet("/patient/profile", token);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Something went wrong");
    }
  }
);

export const updatePatientProfile = createAsyncThunk(
  "patient/updateProfile",
  async ({ profileData, token }, { rejectWithValue }) => {
    try {
      const response = await privatePutFile("/patient/update/profile",token, profileData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to update profile");
    }
  }
);

const patientSlice = createSlice({
  name: "patient",
  initialState: {
    profile: null,
    isLoading: false,
    updateLoading: false,
    error: null,
    status: "idle",
  },
  reducers: {
    clearPatientProfileError: (state) => {
      state.error = null;
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPatientProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.status = "loading";
      })
      .addCase(fetchPatientProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchPatientProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to fetch profile";
        state.status = "failed";
      })
      
      .addCase(updatePatientProfile.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
        state.status = "updating";
      })
      .addCase(updatePatientProfile.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.profile = action.payload;
        state.status = "updated";
      })
      .addCase(updatePatientProfile.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload?.message || "Failed to update profile";
        state.status = "update_failed";
      });
  },
});

export const { clearPatientProfileError } = patientSlice.actions;
export default patientSlice.reducer;