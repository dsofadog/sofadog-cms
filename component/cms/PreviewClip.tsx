import React, { useEffect, useState, useRef } from 'react';
import ReactPlayer from 'react-player';
import Hls from "hls.js";

const PreviewClip = (props) => {

    const myRef = useRef(null);
    const [playing, setPlaying] = useState(false)
    const [controls, setControls] = useState(false)
    const [url, setUrl] = useState({video: "",image: ""});

    useEffect(() => {
        setUrl({video:props.videoUrl, image: props.image});
        var video = myRef;
        var hls = new Hls({
            xhrSetup: function(xhr, url) {
              xhr.withCredentials = true;
            }
          });
          hls.loadSource(props.videoUrl);
          hls.attachMedia(video);
          hls.on(Hls.Events.MANIFEST_PARSED, function() {
            handlePlay();            
          });
    }, [props.videoUrl])

    function handlePlayPause() {
        setPlaying(!myRef.current.playing)
    }

    function handlePlay() {
        setPlaying(true)
        setControls(true)
    }

    function handlePause() {
        setPlaying(false)
        setControls(false)
    }

    function handleEnded() {
        setControls(false)
    }

    return (
        <div className="flex flex-col rounded shadow-lg overflow-hidden">
            <div className="relative flex-shrink-0">
                <div className="relative block w-full h-full rounded overflow-hidden focus:outline-none focus:shadow-outline">
                    <ReactPlayer
                        ref={myRef}
                        className='react-player'
                        width='100%'
                        height='100%'
                        url={url.video}
                        pip={false}
                        playing={playing}
                        controls={controls}
                        playsinline
                        controlsList="nodownload"
                        light={false}
                        loop={true}
                        playbackRate={1.0}
                        volume={0.8}
                        muted={false}
                        onPlay={handlePlay}
                        onPause={handlePause}
                        onEnded={handleEnded}
                    />
                    
                    {!playing && (
                        <div onClick={handlePlayPause} className="absolute inset-0 w-full h-full flex items-center justify-center">
                            <svg className="h-12 w-12 text-indigo-500" fill="currentColor" viewBox="0 0 84 84">
                                <circle opacity="0.9" cx="42" cy="42" r="42" fill="white" />
                                <path d="M55.5039 40.3359L37.1094 28.0729C35.7803 27.1869 34 28.1396 34 29.737V54.263C34 55.8604 35.7803 56.8131 37.1094 55.9271L55.5038 43.6641C56.6913 42.8725 56.6913 41.1275 55.5039 40.3359Z" />
                            </svg>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default PreviewClip