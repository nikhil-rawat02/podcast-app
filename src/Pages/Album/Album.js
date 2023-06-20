import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom';
import { AiOutlineClose } from 'react-icons/ai';
import { v4 as uuid } from 'uuid';
import { toast } from 'react-toastify';
import { addDoc, collection, doc, getDoc, getDocs, query } from 'firebase/firestore/lite';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { auth, db, storage } from '../../firebase';
import { setAlbum } from '../../slices/AlbumSlice';
import { setIsLoading } from '../../slices/isLoadingSlice';
import FileSelectInput from '../../Components/FileSelectInput/FileSelectInput';
import EpisodeInAlbum from '../../Components/EpisodeInAlbum/EpisodeInAlbum';
import AudioPlayer from '../../Components/AudioPlayer/AudioPlayer';
import Button from '../../Components/Button/Button';
import Header from '../../Components/Header/Header'
import Input from '../../Components/Input';
import pod from '../../images/add-episode.png'
import audioImg from '../../images/episode-audio-mg.png';
import './Album.css';

function Album() {

  const param = useParams();
  const [albumId, setAlbumId] = useState();
  const [albumImg, setAlbumImg] = useState("");
  const [isAddEpisodeOpen, setIsAddEpisodeOpen] = useState(false);
  const [episodeName, setepisodeName] = useState("");
  const [episodeAbout, setepisodeAbout] = useState("");
  const [imageFileSelected, setImageFileSelected] = useState("");
  const [audioFileSelected, setAudioFileSelected] = useState("");
  const [episodes, setEpisodes] = useState([]);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  const [playingFile, setPlayingFile] = useState("");
  const [playingImage, setPlayingImage] = useState("");

  const dispatch = useDispatch();
  const album = useSelector(state => state.album.album);
  const isLoading = useSelector(state => state.loading.isloading);

   

  // use effect to get all episode data from the firebase
  const loadEpisode = () => {
    try {
      const q = query(
        collection(db, `podcasts/${param.id}/episode`)
      );
      const docSnap = getDocs(q);
      docSnap.then((data) => {
        const episodesData = [];
        data.docs.forEach((docSnapRef) => {
          const data = docSnapRef._document.data.value.mapValue.fields;

          const episodeTitle = data.title
            .stringValue;
          const episodeDescription = data.description.stringValue;
          const episodeImage = data.image.stringValue;
          const episodeAudio = data.audio.stringValue;
          const episodeId = data.id.stringValue;
          const episodeData = {
            "episodeId": episodeId,
            "title": episodeTitle,
            "description": episodeDescription,
            "image": episodeImage,
            "audio": episodeAudio,
          }

          episodesData.push(episodeData);
        })
        setEpisodes(episodesData);
      })
        .catch((error) => {
          toast.error(error);
          console.log(error)
        })
    } catch (error) {
      console.log(error);
    }
  }

  const handleSubmitEpisode = async (e) => {
    e.preventDefault();
    if (episodeName && audioFileSelected) {

      try {
        // 1. update episode cover image and audio in storage
        dispatch(setIsLoading(true));
        let episodeImageUrl = audioImg;
        let episodeAudioUrl = "";
        if (audioFileSelected) {
          const docRef = Date.now();
          const episodeImageRef = ref(storage, `episodes/${auth.currentUser.uid}/${albumId}/image/${docRef}`);
          const episodeAudioRef = ref(storage, `episodes/${auth.currentUser.uid}/${albumId}/audio/${docRef}`);

          if (imageFileSelected) {
            await uploadBytes(episodeImageRef, imageFileSelected);
            episodeImageUrl = await getDownloadURL(episodeImageRef);
          }
          await uploadBytes(episodeAudioRef, audioFileSelected);
          episodeAudioUrl = await getDownloadURL(episodeAudioRef);
        }


        // 2. get public url of both image and audio and add episode in podcast collection firestore 
        const episodeData = {
          id: uuid(),
          title: episodeName,
          description: episodeAbout,
          image: episodeImageUrl,
          audio: episodeAudioUrl,
        }
        await addDoc(
          collection(db, "podcasts", albumId, "episode"),
          episodeData
        );

        // get all episodes of album from data base and set in redux 
        loadEpisode();
        dispatch(setIsLoading(false));
        handleOpenAddEpisode();
        toast.success("new Episode added");
      }
      catch (error) {
        toast.error("some error occured, episode not added try again")
        dispatch(setIsLoading(false));
        console.log(error);
      }
    } else {
      toast.error("Episode name and audio is necessary to create episode");
    }
  }

  const handleAddAudioFile = (e) => {
    setAudioFileSelected(e.target.files[0]);
  }

  const handleAddCoverImageFile = (e) => {
    setImageFileSelected(e.target.files[0]);
  }

  const handleOpenAddEpisode = () => {
    setepisodeName("");
    setepisodeAbout("");
    setImageFileSelected("");
    setAudioFileSelected("");
    setIsAddEpisodeOpen(!isAddEpisodeOpen);
  }

  // use effect to fetch album data from firebase
  useEffect(() => {
    // get data using param.id from db`
    try {
      const docRef = doc(db, "podcasts", param.id);
      const docSnap = getDoc(docRef);
      docSnap.then((docSnapRef) => {
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
        setAlbumId(param.id);
        setAlbumImg(albumImage);
        dispatch(setAlbum(albumData));
        //load episodes
        loadEpisode();
      }).catch(error=> console.log(error.message))
    } catch (error) {
      console.log(error);
    }

  },[]);

  useEffect(()=>{

    setIsAudioPlaying(prevState => !prevState);
    setTimeout(() => {
      setIsAudioPlaying(prevState => !prevState);
    },100);

  },[playingFile]);

  return (
    <div className='div'>
      <Header />
      <div className="album_container">

        <div className="album_cover">
          <div className="album_details">
            <div className="album_img">
              <img src={albumImg} alt="" />
            </div>
          </div>
          <div className="album_title">
            <div style={{ textAlign: "end", marginRight: "10px" }}>
              {/* className,callback, buttonText,icon, type */}
              {
                album.albumCreator === auth.currentUser.uid &&
                <Button callback={handleOpenAddEpisode} buttonText="Add Episode" />
              }
            </div>
            <h1>{album.albumTitle}</h1>
            <h3>{album.albumDesc}</h3>
          </div>
        </div>

        <div className="episodes">
          <h2 style={{ textAlign: "center", margin: "10px 0" }}>Episodes</h2>
          {episodes.length < 1
            ?
            <p style={{textAlign:"center", marginTop:"20px"}}>No episode avaiable right now</p>
            :
            episodes.map((episode) => (
              <EpisodeInAlbum key={episode.episodeId}
                episodeId={episode.episodeId}
                title={episode.title}
                description={episode.description}
                image={episode.image}
                audio={episode.audio}
                setPlayingImage={setPlayingImage}
                playAudio={setPlayingFile}
                setPlayingFile = {setPlayingFile}
                setIsAudioPlaying = {setIsAudioPlaying}
              />
            ))
          }
        </div>

        {isAddEpisodeOpen && <div className="add_episode_container">
          <div className="add_episode">
            <div className="add_episode_navbar">
              <AiOutlineClose cursor={"pointer"} onClick={handleOpenAddEpisode} />
            </div>
            <div className="img" style={{ height: "350px", width: "320px" }}>
              <img src={pod} alt="" />
            </div>
            <form>
              <label htmlFor="EpisodeName">Episode's Name</label>
              <Input type="text" state={episodeName} setState={setepisodeName} name="episodeName" placeholder={`Episode's name`} style={{ width: "55vw" }} />
              <label htmlFor="episodeabout">About This Episode</label>
              <Input type="text" state={episodeAbout} setState={setepisodeAbout} required={true} name="episodeabout" placeholder='About episode' style={{ width: "55vw" }} />
              <label htmlFor="episodeCover">
                {imageFileSelected ? `File ${imageFileSelected.name} is selected` : "Add episode image"
                }</label>
              <FileSelectInput type="file" accept="image/*" name="episodeCover" placeholder="Add cover Image" onChange={handleAddCoverImageFile} style={{ width: "55vw" }} />
              <label htmlFor="episodeAudio">
                {audioFileSelected ? `File ${audioFileSelected.name} is selected` : "Add episode audio"
                }</label>
              <FileSelectInput type="file" accept="audio/*" name="episodeAudio" placeholder="Add Audio File" onChange={handleAddAudioFile} style={{ width: "55vw" }} />
              <Button callback={handleSubmitEpisode} buttonText={isLoading ? "wait..." : "Submit"} isLoading={isLoading} type="submit" />
            </form>
          </div>
        </div>
        }

        <div className="player">
          {
            playingFile && <AudioPlayer isAudioPlaying ={isAudioPlaying}  setIsAudioPlaying = {setIsAudioPlaying} audioSrc={playingFile} image={playingImage} />
          }
        </div>
      </div>

    </div>
  )
}

export default Album
