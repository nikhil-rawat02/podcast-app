import { createSlice } from "@reduxjs/toolkit";

const initialState ={
    album : {
        albumId: "",
        albumTitle: "",
        albumAbout: "",
        albumImg: "",
        episode : []
    }
}

const AlbumSlice = createSlice({
    name : "album",
    initialState,
    reducers :{
        setAlbum :(state, action)=> {
            state.album = action.payload; 
        },
        setAlbumsEpisode :(state,action)=>{
            state.album.episode = action.payload;
        }
    }
});

export const {setAlbum} = AlbumSlice.actions;
export default AlbumSlice.reducer;