
import _ from 'lodash'
import { v4 as uuid } from 'uuid'
import { useState, useCallback } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { create, hideVideoForm } from 'features/stock-video-storage/slices/stock-video-storage.slice'
import { RootState } from 'rootReducer';

import SubmitButton from 'component/common/SubmitButton';
import { useDropzone } from 'react-dropzone';
import ProcessingButton from 'component/common/ProcessingButton';

type Props = {
    video?: any;
}

const VideoDialogForm = (props: Props) => {

    const { video: _video } = props
    const dispatch = useDispatch()

    const { videoFormIsVisible } = useSelector((state: RootState) => state.stockVideoStorage)
    const [video, setVideo] = useState(null);

    const [tag, setTag] = useState<string>('')
    const [tags, setTags] = useState<{ id: string; name: string }[]>([])

    const handleVideoPreview = (e) => {
        let video_as_base64 = URL.createObjectURL(e[0]);
        let video_as_files = e[0];

        setVideo({
            video_preview: video_as_base64,
            video_file: video_as_files,
        });
    };
    const onDrop = useCallback(acceptedFiles => {
        handleVideoPreview(acceptedFiles);
    }, [])
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

    const { progressBarLoading } = useSelector((state: RootState) => state.stockVideoStorage)

    const close = () => {
        dispatch(hideVideoForm())
    }

    const onKeyUp = (e) => {
        if (e.which === 13) {
            setTags([...tags, { id: uuid(), name: tag }])
            setTag('')
        }
    }

    const submit = async () => {

        dispatch(create(video.video_file, tags.map(tag => tag.name)))

    }

    return (
        <>

            <div className="fixed z-30 inset-0 overflow-y-auto">
                <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">


                    <div className={(!videoFormIsVisible ? 'animate__fadeOut' : 'animate__fadeIn') + ' animate__animated animate__faster fixed inset-0 transition-opacity'} aria-hidden="true">
                        <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                    </div>
                    <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                    <div className={(!videoFormIsVisible ? 'animate__fadeOutUp' : 'animate__fadeInDown') + ' animate__animated animate__faster inline-block align-bottom bg-white rounded-lg text-left shadow-xl transform transition-all sm:my-8 sm:align-middle  sm:w-full md:w-2/3'} role="dialog" aria-modal="true" aria-labelledby="modal-headline">
                        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">

                            <div className="hidden sm:block absolute top-0 right-0 pt-4 pr-4">
                                <button onClick={close} type="button" className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                    <span className="sr-only">Close</span>
                                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <div className="sm:flex sm:items-start mb-10">

                                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:mr-4 sm:text-left w-full">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
                                        Upload video
                                    </h3>

                                    <div className="mt-8">

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="col-span-1">

                                                <div className={'w-full block text-center justify-center items-center'}>
                                                    <div className={video !== null ? '' : 'hidden'}>
                                                        <div className="flex justify-center items-center">
                                                            {video && <video className="w-full" controls src={video.video_preview} />}
                                                        </div>
                                                        <div className="flex space-x-1">
                                                            <span className="flex-grow relative z-0 inline-flex shadow-sm rounded-md">
                                                                <button
                                                                    disabled={_video?.loading || progressBarLoading}
                                                                    onClick={() => setVideo(null)}
                                                                    type="button"
                                                                    className={(_video?.loading || progressBarLoading ? 'cursor-not-allowed disabled:opacity-50 ' : '') + 'flex-grow justify-center relative inline-flex items-center px-4 py-2 rounded-bl-md border border-gray-300 bg-white text-xs font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500'}
                                                                >
                                                                    Cancel
                                                                </button>
                                                                {/* <button
                                                                    disabled={_video?.loading}
                                                                    onClick={() => dispatch(create(video.video_file))}
                                                                    type="button"
                                                                    className={(_video?.loading ? 'cursor-not-allowed disabled:opacity-50 ' : '') + 'flex-grow justify-center -ml-px relative inline-flex items-center px-4 py-2 rounded-br-md border border-gray-300 bg-white text-xs font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500'}
                                                                >
                                                                    Upload
                                                                </button> */}
                                                            </span>

                                                        </div>

                                                    </div>
                                                    <div className={video === null ? '' : 'hidden'}>

                                                        <div className="w-full p-2">
                                                            <div {...getRootProps()} className="cursor-pointer hover:bg-gray-50 text-gray-400 hover:text-gray-500 transition duration-150 ease-in-out w-full flex justify-center px-6 pt-5 pb-6 border-2 border-gray-200 border-dashed rounded-md text-xs">
                                                                <input {...getInputProps()} />
                                                                <div className="text-center">
                                                                    <svg className="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                                                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                                    </svg>
                                                                    {
                                                                        isDragActive ?
                                                                            <p className="mt-1 text-xs">
                                                                                Drop the files here ...
                                                                            </p>
                                                                            :
                                                                            <>
                                                                                <button
                                                                                    type="button"
                                                                                    className="font-medium pr-2 focus:outline-none focus:underline"
                                                                                >
                                                                                    <span className="block">Upload a file</span>
                                                                                    <span className="block">or</span>
                                                                                    <span className="block font-medium"> drag and drop</span>
                                                                                </button>
                                                                                <p className="mt-1 text-xs">
                                                                                    <span className="block">MP4, MOV, WMV</span>
                                                                                    <span className="block">up to 500MB</span>
                                                                                </p>
                                                                            </>
                                                                    }

                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                            <div className="col-span-1">
                                                <div className="sm:col-span-3">
                                                    <label htmlFor="tag" className="block text-sm font-medium text-gray-700">
                                                        Tag
                                                    </label>
                                                    <div className="my-1 grid grid-cols-4 gap-3">
                                                        <div className="col-span-3">
                                                            <input value={tag} onKeyUp={(e) => onKeyUp(e)} onChange={(e: any) => {
                                                                setTag(e.target.value)
                                                                console.log(e.target.value)
                                                            }} type="text" name="first_name" id="first_name" autoComplete="given-name" className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" />
                                                        </div>
                                                        <div className="col-span-1">
                                                            <button className={(!tag ? 'cursor-not-allowed disabled:opacity-50 ' : '') + 'btn btn-purple'} disabled={!tag} type="button" onClick={() => {
                                                                setTags([...tags, { id: uuid(), name: tag }])
                                                                setTag('')
                                                            }}>Add</button>
                                                        </div>
                                                    </div>

                                                    {tags.map(tag => {
                                                        return (<span key={tag.id} className="mr-1 inline-flex rounded-md items-center py-0.5 pl-2.5 pr-1 text-sm font-medium bg-indigo-100 text-indigo-700">
                                                            {tag.name}
                                                            <button onClick={() => {
                                                                setTags(_.reject(tags, ['id', tag.id]))
                                                            }} type="button" className="flex-shrink-0 ml-0.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-indigo-400 hover:bg-indigo-200 hover:text-indigo-500 focus:outline-none focus:bg-indigo-500 focus:text-white">
                                                                <span className="sr-only">Remove large option</span>
                                                                <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                                                                    <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
                                                                </svg>
                                                            </button>
                                                        </span>)
                                                    })}
                                                </div>
                                            </div>

                                        </div>


                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 px-4 py-3 sm:px-10 sm:flex sm:flex-row-reverse">
                            <ProcessingButton
                                onClicked={submit}
                                disabled={!video}
                                color='purple'
                                label='Save'
                                loading={progressBarLoading}
                                type='button' />
                            <button onClick={close} type="button" className="mr-2 mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default VideoDialogForm