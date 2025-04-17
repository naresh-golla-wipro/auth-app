import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import axiosInstance from "../../utils/api";

const initialState = {
  user: null,
  token: null,
  loading: false,
  error: null,
  authProvider: null,
  authorization: {
    roles: [],
    pages: [],
    permissions:[],
  },
  authLoading: false, // Separate loading state for auth data
  authError: null, // Separate error state for auth data
};


// export const fetchAuthorizationData = createAsyncThunk(
//   "auth/fetchAuthorizationData",
//   async (_, thunkAPI) => {
//     try {
//       const res = await axiosInstance.get("/api/authorization"); // New API endpoint
//       return res.data; // Assuming the API returns { roles, pages }
//     } catch (err) {
//       return thunkAPI.rejectWithValue(err.response.data.message);
//     }
//   }
// );

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      console.log("setCredentials--action.payload", action.payload);
      const { user, token, authProvider } = action.payload;
      state.user = user;
      state.token = token;
      state.authProvider = authProvider;
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.loading = false;
      state.error = null;
      state.authProvider = null;

      state.authorization = {
        roles: [],
        pages: [],
      };
    },
    updateAuthorization: (state, action) => {
      state.authorization = action.payload;
      state.authorization.permissions = getPermissionsFromRoles(action.payload?.roles || []); // Call getPermissionsFromRoles

    },
  },
  // extraReducers: (builder) => {
  //   builder
    // .addCase(fetchAuthorizationData.pending, (state,action)=>{
    //   state.authLoading = true,
    //   state.authError = null
    // })
    // .addCase(fetchAuthorizationData.fulfilled, (state, action)=>{
    //   state.authLoading = false,
    //   state.authorization.pages  = action.payload?.pages || [];
    //   state.authorization.roles = getPermissionsFromRoles(action.payload?.roles || [])
    // })
  // },
});

//map roles to permissions
const getPermissionsFromRoles = (roles) => {
  let permissions = [];
  if (roles.includes("superAdmin")) {
    permissions = ["add", "edit", "delete", "view"];
  } else if (roles.includes("editAdmin")) {
    permissions = ["edit", "view"];
  } else if (roles.includes("newAdmin")) {
    permissions = ["add", "view"];
  } else if (roles.includes("user")) {
    permissions = ["view"];
  }
  return permissions;
};

export const { setCredentials, logout, updateAuthorization } =
  authSlice.actions;
export default authSlice.reducer;
