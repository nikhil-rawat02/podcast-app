import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { AiOutlineSearch } from "react-icons/ai";
import { collection, getDocs, query } from 'firebase/firestore/lite';
import { auth, db } from '../../firebase';
import { setPodcasts } from '../../slices/podcastSlice';
import { setAlbum } from '../../slices/AlbumSlice';
import Header from '../../Components/Header/Header'
import Input from '../../Components/Input';
import AlbumCard from '../../Components/AlbumCard/AlbumCard';
import './MyPodcast.css'

function MyPodcast() {

  const [searchContent, setSearchContent] = useState("");

  const podcasts = useSelector(state => state.podcast.podcasts);
  const dispatch = useDispatch();

  useEffect(() => {
    try{
      const q = query(collection(db, "podcasts"));
      const docSnap = getDocs(q);
  
      docSnap.then(data => {
        const albumsData = [];
  
        data.docs.forEach((docSnapRef) => {
          const data = docSnapRef._document.data.value.mapValue.fields;
          const albumTitle = data.albumTitle
            .stringValue;
          const albumDescription = data.albumDescription.stringValue;
          const albumImage = data.albumImage.stringValue;
          const albumCreator = data.createdBy.stringValue;
          const albumData = {
            "albumId": docSnapRef._document.key.path.segments[6],
            "albumTitle": albumTitle,
            "albumDesc": albumDescription,
            "albumImg": albumImage,
            "albumCreator": albumCreator,
          }
          albumsData.push(albumData);
        })
        dispatch(setPodcasts(albumsData));
  
      }).catch(error =>
        console.log(error)
      )
    }catch(error){
      console.log(error);
    }
    
  }, [dispatch]);  
  return (
    <>
      <Header />
      <div className="mypodcast_container">
        <h1 style={{ color:"white",textShadow:"2px 4px grey"}}>Discover Podcast</h1>
        <div className="mypodcast">
          {podcasts.map(album => {
            if (album.albumCreator === auth.currentUser.uid) {
              return (
                <AlbumCard key={album.albumId}
                album={album} 
                podcasts ={podcasts} 
                setAlbum={setAlbum}/>
              )
            }
          }
          )}
        </div>
      </div>
    </>
  )
}

export default MyPodcast
