import React, { useState, useEffect, useRef } from 'react';
import NProgress from "nprogress";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import useInfiniteScroll from 'react-infinite-scroll-hook';
import _ from 'lodash'

import PreviewVideo from 'features/stock-video-storage/components/PreviewVideo';
import VideosHeader from 'features/stock-video-storage/components/VideosHeader';
import VideoDialogForm from 'features/stock-video-storage/components/VideoDialogForm';

import NavHeader from 'component/common/NavHeader';
import tokenManager from 'utils/token-manager';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from 'rootReducer';

import {
    query as queryVideos,
    reset as resetVideos,
    showVideoForm
} from 'features/stock-video-storage/slices/stock-video-storage.slice'
import notify from 'utils/notify';
import PreviewClip from 'component/common/PreviewClip';

type Params = {
    token: string;
    page: number;
    tag: string;
}


const defaultPagination = {
    page: 0,
}

const StockVideos = () => {


    const {
        hasMoreVideos,
        notificationErrorMessage,
        fetchErrorMessage,
        progressBarLoading,
        scrollLoading,
        scrollLoadingMessage,
        videos,
        videoFormIsVisible: _videoFormIsVisible
    } = useSelector((state: RootState) => state.stockVideoStorage)

    const dispatch = useDispatch()

    const topRef = useRef()
    const [isVideoPreviewVisible, setIsVideoPreviewVisible] = useState(false);
    const [previewVideo, setPreviewVideo] = useState<{url: string; thumbnail: string}>(null);
    const [videoFormIsVisible, setVideoFormIsVisible] = useState<boolean>(false)

    const [params, setParams] = useState<Params>({
        token: tokenManager.getToken(),
        page: defaultPagination.page,
        tag: '',
    })
    const infiniteRef = useInfiniteScroll({
        loading: scrollLoading,
        hasNextPage: hasMoreVideos,
        onLoadMore: () => {
            console.log('in onLoadMore')
            setParams({
                ...params,
                token: tokenManager.getToken(),
                page: params.page + 1
            })
        },
        scrollContainer: 'window',
    });


    useEffect(() => {
        dispatch(resetVideos())
    }, []);

    useEffect(() => {
        if (!_videoFormIsVisible) {
            setTimeout(() => {
                setVideoFormIsVisible(false)
            }, 500)
        } else {
            setVideoFormIsVisible(true)
        }
    }, [_videoFormIsVisible])

    useEffect(() => {
        if (progressBarLoading) {
            NProgress.start()
        } else {
            NProgress.done()
        }
    }, [progressBarLoading])

    useEffect(() => {
        console.log('params updated')
        if (params.token) {
            fetchVideos()
        }
    }, [params])

    useEffect(() => {
        if (notificationErrorMessage) {
            notify('danger', notificationErrorMessage)
        }
    }, [notificationErrorMessage])

    const fetchVideos = async () => {
        if (!fetchErrorMessage) {
            dispatch(queryVideos(params))
        }
    }

    const scrollToTop = () => {
        (topRef as any).current.scrollIntoView({
            behavior: 'smooth'
        })
    };

    return (
        <>
            <div className="flex flex-col h-full h-screen bg-gray-50">
                <NavHeader />
                <VideosHeader
                    params={params}
                    onSubmitParams={(newParams) => {
                        dispatch(resetVideos())
                        setParams({...newParams, page: 0})
                    }}
                    onRefresh={() => {
                        dispatch(resetVideos())
                        setParams({
                            ...params,
                            page: 0
                        })
                    }}
                    onNewClicked={() => {
                        dispatch(showVideoForm())
                        scrollToTop();
                    }}
                />

                <div className="flex-1 overflow-y-auto">
                    {videoFormIsVisible && (
                        <VideoDialogForm />
                    )}

                    {isVideoPreviewVisible && (
                        <div className="fixed z-30 inset-0 overflow-y-auto">
                            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                                <div className="fixed inset-0 transition-opacity">
                                    <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                                </div>
                                <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>&#8203;
                                <div className="w-auto overflow-y-auto inline-block align-bottom bg-white rounded-lg px-4 pb-4 text-left overflow-hidden shadow-xl transform transition-all md:align-middle" role="dialog" aria-modal="true" aria-labelledby="modal-headline">
                                    <div>
                                        <div className="flex pt-4 top-0 sticky bg-white z-10">
                                            <div className="w-1/2 px-4 sm:px-6 flex justify-start">
                                                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
                                                    Video
                                                </h3>
                                            </div>
                                            <div className="w-1/2 flex justify-end">
                                                <FontAwesomeIcon onClick={() => setIsVideoPreviewVisible(false)} className="w-4 h-4 text-gray-400 hover:text-indigo-600 cursor-pointer" icon={['fas', 'times']} />
                                            </div>
                                        </div>
                                        <div className="py-4 flex justify-center">
                                            <div className="flex">
                                                {previewVideo && <div className="px-2">
                                                    <PreviewClip videoUrl={previewVideo.url} thumbnails={previewVideo.thumbnail} />
                                                </div>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={infiniteRef as React.RefObject<HTMLDivElement>} className="max-w-7xl mx-auto">
                        <div ref={topRef}></div>
                        {/* <div className="sfd-top invisible"></div> */}

                        <div className="m-8 ">



                            <ul className="space-y-12 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-12 sm:space-y-0 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-8">
                                {videos?.map(video => (
                                    <PreviewVideo
                                        onViewClick={() => {
                                            setIsVideoPreviewVisible(true);
                                            setPreviewVideo(video);
                                        }}
                                        key={video.id}
                                        video={video}
                                    />
                                ))}
                            </ul>

                            {scrollLoading && (

                                <div className="box-border p-4">
                                    <div className="flex flex-row justify-center items-center">
                                        <FontAwesomeIcon className="w-12 h-12 p-2 rounded-full" icon={['fas', 'spinner']} spin />
                                        <p>{scrollLoadingMessage}</p>
                                    </div>

                                </div>
                            )}
                        </div>
                    </div>

                    {fetchErrorMessage && (
                        <div className="box-border p-4">
                            <div className="flex flex-row justify-center items-center">
                                <FontAwesomeIcon className="w-12 h-12 p-2 rounded-full" icon={['fas', 'exclamation-circle']} />
                                <p>{fetchErrorMessage}</p>
                            </div>
                            <div className="flex flex-row justify-center items-center">
                                <button type="button" onClick={() => {
                                    dispatch(resetVideos())
                                    setParams({
                                        ...params,
                                        page: 0
                                    })
                                }} className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Retry</button>
                            </div>


                        </div>
                    )}

                    { !scrollLoading && !hasMoreVideos && videos.length===0 &&
                    <div className="box-border p-4">
                        <div className="flex flex-row justify-center items-center">
                        <p>No results found</p>
                        </div>
                        </div>
                    }
                </div>

                {
                    !scrollLoading && videos && (
                        <div className="fixed bottom-0 right-0 mb-4 mr-4 z-50 cursor-pointer">
                            <FontAwesomeIcon onClick={(e) => scrollToTop()}  className="w-12 h-12 p-2 rounded-full cursor-pointer text-white bg-blue-500 hover:bg-blue-600" icon={['fas', 'arrow-up']} />
                        </div>
                    )
                }



            </div >
        </>
    )
}

export default StockVideos