import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { privateGet } from "../../../utils/apiCaller";

export const fetchPrescriptions = createAsyncThunk(
  "prescriptions/fetch",
  async (token, { rejectWithValue }) => {
    try {
      const response = await privateGet("/patient/prescriptions", token);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch prescriptions");
    }
  }
);

const prescriptionSlice = createSlice({
  name: "prescriptions",
  initialState: {
    list: [],
    isLoading: false,
    error: null,
    status: "idle",
  },
  reducers: {
    clearPrescriptionError: (state) => {
      state.error = null;
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPrescriptions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.status = "loading";
      })
      .addCase(fetchPrescriptions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = action.payload || [];
        state.status = "succeeded";
      })
      .addCase(fetchPrescriptions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Something went wrong";
        state.status = "failed";
      });
  },
});

export const { clearPrescriptionError } = prescriptionSlice.actions;
export default prescriptionSlice.reducer;
