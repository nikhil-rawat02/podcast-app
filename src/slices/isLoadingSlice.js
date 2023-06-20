import { createSlice } from "@reduxjs/toolkit";

const initialState ={
    isloading : false
}

const isLoadingSlice = createSlice({
    name: "isloading",
    initialState,
    reducers:{
        setIsLoading: (state) => {
            state.isloading = !state.isloading;
        }
    }
});

export const {setIsLoading} = isLoadingSlice.actions;
export default isLoadingSlice.reducer;