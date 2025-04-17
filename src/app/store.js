import { configureStore, combineReducers} from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import {persistReducer, persistStore} from "redux-persist";
import storage from "redux-persist/lib/storage"; // uses local storage
import { FLUSH, REGISTER, REHYDRATE, PERSIST, PURGE, PAUSE } from "redux-persist";
// import tableReducer from "../features/tables/tableSlice";

const persistConfig = {
  key: "auth",
  storage,
  whitelist: ['token','authProvider'], // stores token,
}
//Wrap only auth reducer
const rootReducer = combineReducers({
  auth:persistReducer(persistConfig, authReducer),
  // add other reducers normally without persist 
  // tables: tableReducer,
})
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [FLUSH, REGISTER, REHYDRATE, PERSIST, PURGE, PAUSE ]
    }
  })
});

export const persistor = persistStore(store);
export default store;

