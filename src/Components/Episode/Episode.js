import React from 'react'
import episodeImage from '../../images/episode.png'
import './Episode.css'
function Episode({ img, name, creator }) {

  return (
    <div className='episode' >
      <img src={episodeImage} alt="" />
      <p className='episode_name'>{name}</p>
      <p className='episode_creator'>{creator}</p>
    </div>
  )
}

export default Episode
