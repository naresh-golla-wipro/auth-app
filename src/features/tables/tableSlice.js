import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  data: [],
  loading: false,
  error: null,
};

const fetchDataTable = createAsyncThunk(
  "tables/fetchDataTable",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token; // getting token from auth state
      const response = await axios.get("http://localhost:3000/api/table1", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data; // array of table rows
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const tableSlice = createSlice({
  name: "tables",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDataTable.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDataTable.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchDataTable.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default tableSlice.reducer;
