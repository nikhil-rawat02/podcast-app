import React, { useEffect, useRef, useState } from 'react'
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute } from 'react-icons/fa'
import './AudioPlayer.css';
function AudioPlayer({ audioSrc, image, isAudioPlaying, setIsAudioPlaying }) {
    const [isMute, setIsMute] = useState(true);
    const [duration, setDuration] = useState("");
    const [volume, setVolume] = useState(1);
    const [currentTime, setCurrentTime] = useState(0);
    const audioRef = useRef();
 
    const handleDuration = (e) => {
        setCurrentTime(e.target.value);
        audioRef.current.curentTime = e.target.value;
        console.log(e.target.value , audioRef.current.curentTime, "message");
    }

    const togglePlay = () => {
        if (isAudioPlaying) {
            setIsAudioPlaying(false);
        } else {
            setIsAudioPlaying(true);
        }
    }

    const toggleMute = () => {
        if (isMute) {
            setIsMute(false);
        } else {
            setIsMute(true);
        }
    }

    const handleVolume = (e) => {
        setVolume(e.target.value);
        audioRef.current.volume = e.target.value;
    }

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    }

    const handleTimeUpdate = (e) => {
        handleDuration(e)
        // setCurrentTime(audioRef.current.currentTime);
        // console.log(e.target , audioRef.current.curentTime, "message");
    }

    const handleLoadedMetadata = () => {
        setDuration(audioRef.current.duration);
    }

    const handleEnded = () => {
        setCurrentTime(0);
        setIsAudioPlaying(false);
    }   

    useEffect(() => {
        const audio = audioRef.current;
        audio.addEventListener("timeupdate", handleTimeUpdate);
        audio.addEventListener("loadedmetadata", handleLoadedMetadata);
        audio.addEventListener("ended", handleEnded);

        return () => {
            audio.removeEventListener("timeupdate", handleTimeUpdate);
            audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
            audio.removeEventListener("ended", handleEnded);
        }

    }, []);

    useEffect(() => {
        if (isAudioPlaying) {
            audioRef.current.play();
        } else {
            audioRef.current.pause();
        }
    }, [isAudioPlaying]);

    useEffect(() => {
        if (isMute) {
            setVolume(1);
            audioRef.current.volume = 1;
        } else {
            audioRef.current.volume = 0;
            setVolume(0);
        }
        console.log(volume);
    }, [isMute]);

    return (
        <div className='custom_audio_player'>
            <img src={image} alt='play' className='display_image_player' />
            <p onClick={togglePlay}>{!isAudioPlaying ? <FaPlay /> : <FaPause />}</p>
            <audio
                ref={audioRef}
                src={audioSrc} />
            <div className='duration_flex'>
                <p>{formatTime(currentTime)}</p>
                <input
                    type="range"
                    max={duration}
                    value={currentTime}
                    step={0.01}
                    onChange={handleDuration}
                    className='duration_range'
                />
                <p>-{formatTime(duration - currentTime)}</p>
            </div>
            <p onClick={toggleMute}>{isMute ? <FaVolumeUp /> : <FaVolumeMute />}</p>
            <div className="duration_flex">
                <input type="range"
                    value={volume}
                    max={1}
                    min={0}
                    step={0.01}
                    onChange={handleVolume}
                    className='volume_range' />
            </div>
        </div>
    )
}
export default AudioPlayer
