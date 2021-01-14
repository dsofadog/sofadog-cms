import { useState, useContext, useCallback, useEffect } from "react"

import { useOutsideClickRef } from 'rooks'
import { AccessControlContext, ConfirmationContext } from "contexts";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "rootReducer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDropzone } from "react-dropzone";

import {
    changeOrder,
    changeStatus,
    refresh,
    uploadVideo,
    remove
} from 'features/news-item/slices/news-item.slice'
import PreviewClip from "features/news-item/components/PreviewClip";
import { IconName } from "@fortawesome/fontawesome-svg-core";

type ActionProps = {
    loading: boolean;
    label: string;
    iconColor: string;
    iconName: IconName;
    onFire: () => void
}
const Action = (props: ActionProps) => {
    const {
        loading,
        label,
        iconColor,
        iconName,
        onFire,
    } = props

    return (
        <li
            onClick={() => { !loading && onFire() }}
            role="option"
            className={(loading ? 'cursor-not-allowed disabled:opacity-50 ' : 'hover:bg-gray-100 ') + 'text-gray-900 cursor-pointer select-none relative py-2 pl-4 pr-4 text-xs'}
        >
            <span className="font-normal block truncate flex items-center">
                <FontAwesomeIcon className={`h-4 w-4 mr-2 text-${iconColor}-400`} icon={['fas', iconName]} />
                {label}
            </span>
        </li>
    )
}

type ActionsProps = {
    newsItem: any;
    onEdit: () => void
}

const Actions = (props: ActionsProps) => {

    const { newsItem, onEdit } = props

    const dispatch = useDispatch()
    const { currentUser } = useSelector((state: RootState) => state.auth)
    const { hasRole, hasPermission } = useContext(AccessControlContext)
    const confirm = useContext(ConfirmationContext)



    const [ref] = useOutsideClickRef(() => setDropdownIsActive(false));

    const [dropdownIsActive, setDropdownIsActive] = useState<boolean>(false)
    const [video, setVideo] = useState(null);
    const [isClips, setIsClips] = useState(false);
    const [clips, setClips] = useState({ video: null, thumbnails: null });


    useEffect(() => {
        if (newsItem?.state === 'transcoding') {
            setVideo(null)
        }
    }, [newsItem?.state])


    const isStateOwner = () => {
        return newsItem?.owners[newsItem?.state] &&
            newsItem?.owners[newsItem?.state] == currentUser.email
    }

    const canViewClaimButton = () => {
        return hasPermission(newsItem?.state) &&
            !(newsItem?.owners[newsItem?.state])
    }

    const canViewUnclaimButton = () => {
        return hasPermission(newsItem?.state) && newsItem?.owners[newsItem?.state]
    }

    const canViewSubmitNewButton = () => {
        const permission = 'new'
        return [permission].includes(newsItem?.state) && hasPermission(permission) &&
            isStateOwner()
    }

    const canReviewNewButton = () => {
        const permission = 'awaiting_review_by_lead_journalist'
        return [permission].includes(newsItem?.state) &&
            hasPermission(permission) && isStateOwner()

    }

    const canReviewVideoButton = () => {
        const permission = 'awaiting_review_by_lead_video_editor'
        return [permission].includes(newsItem?.state) &&
            hasPermission(permission) && isStateOwner()

    }

    const canViewAwaitingVideoUpload = () => {
        const permission = 'awaiting_video_upload'
        return [permission].includes(newsItem?.state) &&
            hasPermission(permission) && isStateOwner()

    }

    const canViewPreviewClipsButton = () => {
        return [
            'awaiting_review_by_lead_video_editor',
            'ready_for_push',
            'pushed_to_feed',
            'removed_from_feed'
        ].includes(newsItem?.state) &&
            (hasRole('lead_journalist') ||
                hasRole('video_editor') ||
                hasRole('lead_video_editor') ||
                hasRole('super_admin'))
    }

    const canViewDownloadButton = () => {
        return [
            'awaiting_review_by_lead_video_editor',
            'ready_for_push',
            'pushed_to_feed',
            'removed_from_feed'
        ].includes(newsItem?.state)
    }

    const canViewPushToFeedButton = () => {
        return (
            ('ready_for_push' === newsItem?.state && hasPermission('ready_for_push')) ||
            ('removed_from_feed' === newsItem?.state && hasPermission('removed_from_feed'))
        ) && isStateOwner()
    }

    const canViewRemoveFromFeedButton = () => {
        return 'pushed_to_feed' === newsItem?.state && hasPermission('pushed_to_feed') && isStateOwner()
    }

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

    return (
        <>
            {isClips && (
                <div className="fixed z-30 inset-0 overflow-y-auto">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>&#8203;
						<div className="w-full h-screen overflow-y-auto inline-block align-bottom bg-white rounded-lg px-4 pb-4 text-left overflow-hidden shadow-xl transform transition-all md:align-middle md:max-w-6xl" role="dialog" aria-modal="true" aria-labelledby="modal-headline">
                            <div>
                                <div className="flex py-4 top-0 sticky bg-white z-10">
                                    <div className="w-1/2 px-4 sm:px-6 flex justify-start">
                                        <h2 className="text-gray-500 text-base font-bold uppercase tracking-wide">Clips</h2>
                                    </div>
                                    <div className="w-1/2 flex justify-end">
                                        <FontAwesomeIcon onClick={() => setIsClips(false)} className="w-4 h-4 text-gray-400 hover:text-indigo-600 cursor-pointer" icon={['fas', 'times']} />
                                    </div>
                                </div>
                                <div className="mt-2">

                                    <div className="h-full overflow-y-auto align-middle md:flex flex-wrap min-w-full px-4 sm:px-6 md:px-6 py-4">
                                        {clips?.video.sort((a, b) => a.aspect_ratio - b.aspect_ratio)
                                            .map((clip, i) => (
                                                <div key={i} className="mx-auto sm:mx-0 w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 h-82 sm:pr-4 mb-4">
                                                    <div className="w-full text-sm text-center">Aspect Ratio: {clip.aspect_ratio}</div>
                                                    <PreviewClip videoUrl={clip.url} />
                                                </div>
                                            ))}

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div ref={ref}>
                <div className="mt-1 relative">
                    <div className="flex">
                        <span className="relative z-0 inline-flex shadow-sm rounded-md text-xs flex-grow">
                            <button
                                disabled={newsItem?.state === 'transcoding' || newsItem?.loading}
                                onClick={() => setDropdownIsActive(!dropdownIsActive)}
                                type="button"
                                aria-haspopup="listbox"
                                aria-expanded="true"
                                aria-labelledby="listbox-label"
                                className={
                                    (newsItem?.state === 'transcoding' ? 'cursor-not-allowed disabled:opacity-50 ' : '') +
                                    (newsItem?.loading ? 'cursor-not-allowed disabled:opacity-50 ' : '') +
                                    'relative w-full bg-white border border-gray-300 rounded-l-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none'}>
                                <span className="truncate text-xs">
                                    Actions
                            </span>
                                <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                    <svg className="h-3 w-3 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fill-rule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" />
                                    </svg>
                                </span>
                            </button>
                            <button
                                disabled={newsItem?.loading}
                                onClick={onEdit}
                                type="button"
                                className={(newsItem?.loading ? 'cursor-not-allowed disabled:opacity-50 ' : '') + '-ml-px relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 focus:z-10 focus:outline-none'}
                            >
                                <span className="sr-only">Edit</span>
                                {/*  Heroicon name: chevron-right */}
                                <FontAwesomeIcon className="h-3 w-3 mx-1" icon={['fas', 'pen']} />
                            </button>
                            <button
                                disabled={newsItem?.loading}
                                onClick={() => {
                                    confirm({
                                        variant: 'danger'
                                    }).then(()=>{
                                        dispatch(remove(newsItem?.id))
                                    })
                                }}
                                type="button"
                                className={(newsItem?.loading ? 'cursor-not-allowed disabled:opacity-50 ' : '') + '-ml-px relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 focus:z-10 focus:outline-none'}
                            >
                                <span className="sr-only">Delete</span>
                                {/*  Heroicon name: chevron-right */}
                                <FontAwesomeIcon className="h-3 w-3 mx-1" icon={['fas', 'trash']} />
                            </button>
                            <button
                                disabled={newsItem?.loading}
                                onClick={() => {
                                    setDropdownIsActive(false)
                                    dispatch(refresh(newsItem.id))
                                }}
                                type="button"
                                className={(newsItem?.loading ? 'cursor-not-allowed disabled:opacity-50 ' : '') + '-ml-px relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 focus:z-10 focus:outline-none'}
                            >
                                <span className="sr-only">Refresh</span>
                                {/*  Heroicon name: chevron-right */}
                                <FontAwesomeIcon className={(newsItem?.loading ? 'animate-spin ' : '') + 'h-3 w-3 mx-1'} icon={['fas', 'sync-alt']} />
                            </button>

                            <button
                                disabled={newsItem?.loading}
                                onClick={() => {
                                    dispatch(changeOrder(newsItem?.id, 'increment_ordinal'))
                                }}
                                type="button"
                                className={(newsItem?.loading ? 'cursor-not-allowed disabled:opacity-50 ' : '') + '-ml-px relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 focus:z-10 focus:outline-none'}
                            >
                                <span className="sr-only">Increment</span>
                                {/*  Heroicon name: chevron-right */}
                                <FontAwesomeIcon className="h-3 w-3 mx-1" icon={['fas', 'caret-up']} />
                            </button>
                            <button
                                disabled={newsItem?.loading}
                                onClick={() => {
                                    dispatch(changeOrder(newsItem?.id, 'decrement_ordinal'))
                                }}
                                type="button"
                                className={(newsItem?.loading ? 'cursor-not-allowed disabled:opacity-50 ' : '') + '-ml-px relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 focus:z-10 focus:outline-none'}
                            >
                                <span className="sr-only">Decrement</span>
                                {/*  Heroicon name: chevron-right */}
                                <FontAwesomeIcon className="h-3 w-3 mx-1" icon={['fas', 'caret-down']} />
                            </button>
                        </span>
                    </div>

                    {/*
                    Select popover, show/hide based on select state.

                    Entering: ""
                        From: ""
                        To: ""
                    Leaving: "transition ease-in duration-100"
                        From: "opacity-100"
                        To: "opacity-0"
                    */}
                    <div className={(dropdownIsActive ? 'opacity-100' : 'transition ease-in duration-100 opacity-0') + ' absolute z-20 mt-1 w-full rounded-md bg-white shadow-lg always-show-scroll'}>
                        {dropdownIsActive && <ul
                            tabIndex={-1}
                            role="listbox"
                            aria-labelledby="listbox-label"
                            aria-activedescendant="listbox-item-3"
                            className="divide-y divide-gray-200 max-h-96 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                            {/*
                            Select option, manage highlight styles based on mouseenter/mouseleave and keyboard navigation.

                            Highlighted: "text-white bg-indigo-600", Not Highlighted: "text-gray-900"
                            */}
                            {canViewClaimButton() && <Action loading={newsItem?.loading} label='Claim' iconName='lock' iconColor='gray' onFire={() => dispatch(changeStatus(newsItem.id, 'claim'))} />}

                            {canViewUnclaimButton() && <Action loading={newsItem?.loading} label='Unclaim' iconName='unlock' iconColor='gray' onFire={() => dispatch(changeStatus(newsItem.id, 'unclaim'))} />}

                            {canViewSubmitNewButton() && <Action loading={newsItem?.loading} label='Submit' iconName='paper-plane' iconColor='blue' onFire={() => dispatch(changeStatus(newsItem.id, 'submit'))} />}

                            {canReviewNewButton() && <Action loading={newsItem?.loading} label='Approve' iconName='check-circle' iconColor='green' onFire={() => dispatch(changeStatus(newsItem.id, 'lead_journalist_approve'))} />}

                            {canReviewNewButton() && <Action loading={newsItem?.loading} label='Reject' iconName='times-circle' iconColor='red' onFire={() => dispatch(changeStatus(newsItem.id, 'lead_journalist_reject'))} />}

                            {canViewAwaitingVideoUpload() && <li role="option" className="text-gray-900 hover:text-white cursor-default select-none relative py-4 pl-4 pr-4">

                                <div className={`${hasPermission('awaiting_video_upload') && (newsItem?.owners?.awaiting_video_upload && newsItem?.owners?.awaiting_video_upload == currentUser.email) ? 'w-full block text-center justify-center items-center' : 'hidden'}`}>
                                    <div className={video !== null ? '' : 'hidden'}>
                                        <div className="flex justify-center items-center">
                                            {video && <video className="w-full" controls src={video.video_preview} />}
                                        </div>
                                        <div className="flex space-x-1">
                                            <span className="flex-grow relative z-0 inline-flex shadow-sm rounded-md">
                                                <button
                                                    disabled={newsItem?.loading}
                                                    onClick={() => setVideo(null)}
                                                    type="button"
                                                    className={(newsItem?.loading ? 'cursor-not-allowed disabled:opacity-50 ' : '') + 'flex-grow justify-center relative inline-flex items-center px-4 py-2 rounded-bl-md border border-gray-300 bg-white text-xs font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500'}
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    disabled={newsItem?.loading}
                                                    onClick={() => dispatch(uploadVideo(newsItem.id, video.video_file))}
                                                    type="button"
                                                    className={(newsItem?.loading ? 'cursor-not-allowed disabled:opacity-50 ' : '') + 'flex-grow justify-center -ml-px relative inline-flex items-center px-4 py-2 rounded-br-md border border-gray-300 bg-white text-xs font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500'}
                                                >
                                                    Upload
                                                </button>
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
                            </li>}

                            {canReviewVideoButton() && <Action loading={newsItem?.loading} label='Approve' iconName='check-circle' iconColor='green' onFire={() => dispatch(changeStatus(newsItem.id, 'lead_video_editor_approve'))} />}

                            {canReviewVideoButton() && <Action loading={newsItem?.loading} label='Reject' iconName='times-circle' iconColor='red' onFire={() => dispatch(changeStatus(newsItem.id, 'lead_video_editor_reject'))} />}

                            {canViewPreviewClipsButton() && <Action loading={newsItem?.loading} label='Preview clips' iconName='play-circle' iconColor='purple' onFire={() => {
                                setIsClips(true);
                                setClips({ video: [...newsItem?.clips], thumbnails: [...newsItem?.thumbnails] });
                            }} />}

                            {canViewDownloadButton() && <Action loading={newsItem?.loading} label='Download clip' iconName='file-download' iconColor='purple' onFire={() => {
                                window.open('https://cdn.so.fa.dog/sources/' + newsItem?.id, '_blank')
                            }} />}

                            {canViewPushToFeedButton() && <Action loading={newsItem?.loading} label='Push to feed' iconName='rss-square' iconColor='purple' onFire={() => dispatch(changeStatus(newsItem.id, 'push_to_feed'))} />}

                            {canViewRemoveFromFeedButton() && <Action loading={newsItem?.loading} label='Remove from feed' iconName='rss-square' iconColor='gray' onFire={() => dispatch(changeStatus(newsItem.id, 'remove_from_feed'))} />}

                        </ul>
                        }
                    </div>
                </div>
            </div>
        </>
    )
}


export default Actions