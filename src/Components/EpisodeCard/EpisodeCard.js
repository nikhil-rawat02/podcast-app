import React from 'react'
import { toast } from 'react-toastify';

function EpisodeCard({ episode }) {
    const handlePlayAudio = () => {
        toast.warn("Login to play Audio!")
    }
    return (
        <div className='episode_card' onClick={handlePlayAudio}>
            <img src={episode.image} alt="" />
        </div>
    )
}

export default EpisodeCard
