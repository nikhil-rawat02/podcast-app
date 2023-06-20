import React, { useEffect, useState } from 'react';
import Header from '../../Components/Header/Header';
import video from '../../images/home-video.mp4';
import './index.css';
import { collection, getDocs, query } from 'firebase/firestore/lite';
import { db } from '../../firebase';
import EpisodeCard from '../../Components/EpisodeCard/EpisodeCard';

const Index = () => {

  // fetch all the episodes and render on page
  const [displayEpisode, setDisplayEpisode] = useState([]);

  useEffect(() => {
    setDisplayEpisode([]);
    const q = query(
      collection(db, `podcasts`)
    );
    const docSnap = getDocs(q);
    docSnap.then((data) => {
      data.docs.forEach((albumsSnap) => {
        const albumId = albumsSnap._document.key.path.segments[6];
        const q = query(collection(db, `podcasts/${albumId}/episode`));
        const episodesSnap = getDocs(q);

        episodesSnap.then(episodeDocSnap => {
          episodeDocSnap._docs.forEach(eipsodeSnap => {
            const episode = eipsodeSnap._document.data.value.mapValue.fields;

            const episodeTitle = episode.title.stringValue;
            const episodeImage = episode.image.stringValue;
            const episodeAudio = episode.audio.stringValue;

            const episodeData = {
              "title": episodeTitle,
              "image": episodeImage,
              "audio": episodeAudio,
            }
            setDisplayEpisode(prevState => [...prevState, episodeData]);
          })
        })
          .catch(error => {
            console.log("Error while fetching data of episodes")
            console.log("Error code => ", error.code);
            console.log("Error Message => ", error.message);
          });
      })
    })
      .catch(error => {
        console.log("Error while Fetching Data of Podcast's Albums");
        console.log("Error code => ", error.code);
        console.log("Error message => ", error.message);
      })
  }, [])

  return (
    <div className='container'>
      <Header />
      <div className="home_container">
        <div className="display_video">
          <video muted autoPlay="autoplay">
            <source src={video} type="video/mp4" />
          </video>
        </div>
        <div className="shadow_effect"></div>
        <div className="podcast_info">
          <h1>"Time to tune in and </h1>
          <h2>turn up the podcast vibes"</h2>
          <h3>Welcome aboard the soundwave express!</h3>
        </div>
      </div>
      <div className="episodes_container">
        <p>Most Liked Podcasts</p>
        <div className="episodes_cards_container">

          {displayEpisode ?
            displayEpisode.map(element => (
              < EpisodeCard key={element.episodeAudio}
                episode={element} />
            )) : <p>No episodes to show</p>
          }
        </div>
      </div>
    </div>
  )
}

export default Index
