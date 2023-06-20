import React from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function AlbumCard( { album, podcasts, setAlbum } ) {
    
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const hadleOpenAlbum = (e) => {
        const albumId = e.target.dataset.setId;
        podcasts.map((album) => {
          if (album.albumId === albumId) {
            const currentAlbum = {
              albumId: album.albumId,
              albumTitle: album.albumTitle,
              albumAbout: album.albumDesc,
              albumImg: album.albumImg,
              albumCreator: album.albumCreator,
            }
            dispatch(setAlbum(currentAlbum));
            navigate(`../album/${albumId}`);
          }
        })
      }

    return (
        <div className="album" data-set-id={album.albumId} key={album.albumId} onClick={hadleOpenAlbum}>
            <img src={album.albumImg} data-set-id={album.albumId} alt="" />
            <span data-set-id={album.albumId} >{album.albumTitle}</span>
        </div>
    )
}

export default AlbumCard
