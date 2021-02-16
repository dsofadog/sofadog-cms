import React, { useEffect, useState, useRef } from 'react';

import ReactPlayer from 'react-player';
import Loader from 'component/common/Loader';
import tokenManager from 'utils/token-manager'

const PreviewClip = (props) => {

    const myRef = useRef(null);
    const [url, setUrl] = useState({ video: "", image: "" });

    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        const delay = () => {
            setTimeout(() => {
                setLoading(false)
                console.log('loading done', loading)
            }, 2000)
        }

        console.log('loading')
        delay()
    }, [])
    useEffect(() => {
        setUrl({ video: props.videoUrl, image: props.image });
    }, [props.videoUrl])

    return (
        <>
            <Loader active={loading} />

            <div className={(loading ? 'hidden ' : '') + 'flex flex-col rounded shadow-lg overflow-hidden'}>
                <div className={'relative flex-shrink-0'}>
                    <div className="relative block w-full h-full rounded overflow-hidden focus:outline-none focus:ring">

                        {!loading && <ReactPlayer
                            ref={myRef}
                            className='react-player'
                            width='auto'
                            height='600px'
                            url={tokenManager.attachToken(url.video)}
                            controls={true}
                            playsinline
                            playbackRate={1.0}
                            volume={0.8}
                        />}

                    </div>
                </div>
            </div>
        </>

    )
}

export default PreviewClip