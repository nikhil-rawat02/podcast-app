import React from 'react'
import play from '../../images/play.png';
import './EpisodeInAlbum.css'

function EpisodeInAlbum({ title, description, image, audio, playAudio, setPlayingImage, setPlayingFile, setIsAudioPlaying}) {

    return (
        <div className='episode_in_album' >
            <div className="img_container">
                <img src={image} alt="" />
            </div>
            <div className="play_button" >
                <img src={play} alt=""
                    onClick={() => {
                        setPlayingFile("");
                        playAudio(audio);
                        setPlayingImage(image);
                        setIsAudioPlaying(false);
                        setIsAudioPlaying(prevState => !prevState);
                    }}
                />
            </div>
            <div className="episode_details">
                <h3>{title}</h3>
                <h6>{description}</h6>
            </div>
        </div>
    )
}

export default EpisodeInAlbum
