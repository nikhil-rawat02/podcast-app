import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import isLoadingReducer from "./slices/isLoadingSlice";
import podcastReducer from "./slices/podcastSlice";
import AlbumSlice from "./slices/AlbumSlice";
const store = configureStore({
   reducer:{
       user: userReducer,
        loading: isLoadingReducer,
        podcast: podcastReducer,
        album:AlbumSlice,
   },
});

export default store;