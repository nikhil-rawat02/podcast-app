import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { signOut } from 'firebase/auth';
import { collection, getDocs, query } from 'firebase/firestore/lite';
import { auth, db } from '../../firebase';
import { setAlbum } from '../../slices/AlbumSlice';
import { setPodcasts } from '../../slices/podcastSlice';
import { setUser } from '../../slices/userSlice';
import CreatePodcastComponent from '../../Components/CreatePodcastComponent/CreatePodcastComponent';
import ConfirmUpdate from '../../Components/ConfirmUpdate/ConfirmUpdate';
import AlbumCard from '../../Components/AlbumCard/AlbumCard';
import Header from '../../Components/Header/Header';
import logout from '../../images/logout.png';
import createPodcast from '../../images/microphone.webp';
import plus from '../../images/plus.png';
import './Dashboard.css';

function Dashboard() {

    const [showInput, setShowInput] = useState(false);
    const [search, setSearch] = useState("");
    const [showpodcasts, setShowPodcasts] = useState([]);
    const inputRef = useRef(null);
    const [isCreatePodcastOpen, setIsCreatePodcastOpen] = useState(false);
    const [openAlbum, setOpenAlbum] = useState(false);
    const [albumName, setAlbumName] = useState("");
    const [albumAbout, setAlbumAbout] = useState("");
    const [fileSelected, setFileSelected] = useState("");
    const [albumId, setAlbumId] = useState("");

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const podcasts = useSelector(state => state.podcast.podcasts);

    const handleOpenAlbum = () => {
        setOpenAlbum(false);
    }

    const handleLogout = () => {
        try {
            signOut(auth)
                .then(() => {
                    dispatch(setUser(null));
                })
                .catch(error => {
                    // add toast with switch case to handle all errors      
                    toast.error("")
                    console.log(error)
                })
        } catch (error) {
            console.log(error);
        }
    }
    const handleSearch = (e) => {
        const searchString = e.target.value;
        setSearch(searchString);
        const searchedStringResult = podcasts.filter((album) => {
            if (album.albumTitle.toLowerCase().includes(searchString.toLowerCase())) {
                return album;
            }
        })
        console.log(searchedStringResult);
        setShowPodcasts(searchedStringResult);

    }
    const handleOnClickCreatePodcast = () => {
        setIsCreatePodcastOpen(!isCreatePodcastOpen);
        if (!isCreatePodcastOpen) {
            setAlbumName("");
            setAlbumAbout("");
            setFileSelected("");
        }
    }

    const handleOpenSearchBar = () => {
        setShowInput(true);
    }

    useEffect(() => {
        const loadData = () => {
            try {
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
                            'episodes': []
                        }
                        albumsData.push(albumData);
                    })
                    setShowPodcasts(albumsData);
                    dispatch(setPodcasts(albumsData));
                }).catch(error =>
                    console.log(error)
                );

            } catch (error) {
                console.log(error);
            }
        }
     
        return () => loadData();

    }, [dispatch]);

    useEffect(() => {
        const handleClickOutSide = (event) => {
            if (inputRef.current && !inputRef.current.contains(event.target)) {
                setShowInput(false);
            }
        };
        if (showInput) {
            setTimeout(() => {
                document.addEventListener("click", handleClickOutSide);
            }, 1000);
        }
        return () => {
            document.removeEventListener("click", handleClickOutSide);
        };

    }, [showInput]);
    return (
        <div>
            <Header />
            <div className="dashboard_container">
                <div className="top_bar">
                    {showInput ?
                        (
                            <input className={showInput ? 'active_search' : ""} ref={inputRef} type="text" placeholder='Search' value={search} onChange={handleSearch} />
                        )
                        :
                        (<h1 onClick={handleOpenSearchBar} >Search</h1>)
                    }
                    <div>
                        <div className="create_podcast" onClick={handleOnClickCreatePodcast}>
                            <img src={createPodcast} alt="" className='podcast_mic' />
                            <img src={plus} alt="" className='podcast_mic_plus' />
                        </div>
                        <img src={logout} alt=""
                            style={{ width: "35px", height: "35px", filter: "invert(100%)", cursor: "pointer" }}
                            onClick={handleLogout}
                        />
                    </div>

                </div>

                <div className="album_episode">
                    <h3>All Podcasts</h3>
                    <div className='mypodcast'>
                        {showpodcasts.map(album => (
                            <AlbumCard
                                key={album.albumId}
                                album={album}
                                podcasts={podcasts}
                                setAlbum={setAlbum}
                            />
                        ))
                        }
                    </div>
                </div>
            </div>

            {isCreatePodcastOpen &&
                < CreatePodcastComponent
                    setAlbumId={setAlbumId}
                    albumName={albumName}
                    setAlbumName={setAlbumName}
                    albumAbout={albumAbout}
                    setAlbumAbout={setAlbumAbout}
                    fileSelected={fileSelected}
                    setFileSelected={setFileSelected}
                    setOpenAlbum={setOpenAlbum}
                    handleOnClickCreatePodcast={handleOnClickCreatePodcast}
                />
            }

            {openAlbum &&
                < ConfirmUpdate
                    title="Your Album has been created"
                    buttonText='Add episodes'
                    submitCallback={() => { navigate(`../album/${albumId}`); }}
                    closeConfirmCallBack={handleOpenAlbum}
                />
            }
        </div>
    )
}

export default Dashboard
