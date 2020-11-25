import { useCallback, useEffect, useState, useContext } from "react";
import { useDropzone } from 'react-dropzone';
import CmsConstant from '../../utils/cms-constant';
import HttpCms from '../../utils/http-cms';
import PreviewClip from "./PreviewClip";

import { config as f_config, library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';

import CreateItem from "./CreateItem";
import { LayoutContext } from '../../contexts';
import Link from "next/link";



f_config.autoAddCss = false;
library.add(fas, fab);
//const categories = CmsConstant.Category;
const PreviewItem = (props) => {
    const { setLoading,appUserInfo,userIsSuperAdmin,currentUserPermission} = useContext(LayoutContext);
    const [item, setItem] = useState(null);
    const [sentences, setSentences] = useState(null);
    const [creditsData, setCreditsData] = useState(null);
    const [activeLang, setActiveLang] = useState(0);
    const [video, setVideo] = useState(null);
    const [isClips, setIsClips] = useState(false);
    const [clips, setClips] = useState({ video: null, thumbnails: null });
    const [isEdit, setIsEdit] = useState(false);
    const [comment, setComment] = useState(null);
    const [isExpand,setIsExpand] = useState(true);
    const [categories,setCategories] = useState(null);
    const [feeds,setFeeds] = useState(null);

    const status = CmsConstant.Status;

    useEffect(() => {
        console.log("props.feeds",props.feeds);
        if(props.item){
            setItem(props.item);
            setComment(item?.comments[item?.comments.length-1]);
            setFeeds(props.feeds);
        }
        
    }, [props]);

    useEffect(() => {
        //fetchComment(props.item.id);
        if (item) {
            showSentences(0);
            getFeedCategories();
            showCredits('news_credits', item.news_credits);
        }
    }, [item]);


    useEffect(() => {
        //fetchComment(props.item.id);
       
    }, []);
   
    function fetchComment(id) {
        console.log("calling fetch api");
       // setLoading(true);
        HttpCms.get(`/news_items/${id}/comments?token=${appUserInfo?.token}`)
      
            .then(response => {
                
                console.log(response.data, "response.data");
                if(response.data.comments.length > 0){
                    let c = response.data.comments[response.data.comments.length-1];
                    console.log("c ",c);
    
                    setComment({
                        text:c,
                        count:response.data.comments.length
                    });
                    console.log("comments ",comment);
                   // setLoading(false);
                }
               

            })
            .catch(e => {
                console.log(e);
                setLoading(false);
            });
    }

    function refreshData(e) {
        e.preventDefault();
        setLoading(true);
        HttpCms.get(`/news_items/${item.id}?token=${appUserInfo?.token}`)
            .then(response => {
                setItem(response.data.news_items[0]);
                console.log(response.data.news_items[0], "response.data.data");
                setLoading(false);
            })
            .catch(e => {
                console.log(e);
                setLoading(false);
            });
    }

    function showSentences(i) {
        //console.log(item.descriptions[i])
        setActiveLang(i);
        setSentences(item.descriptions[i]);
    }

    function showCredits(title, data) {
        //console.log(data)
        setCreditsData({ title: title, data: data });
        //console.log("creditsData: ",creditsData)
    }

    function showStatus(itemkey) {
        let statusReturn = '';
        status?.map((s, i) => {
            if (s.name === itemkey) {
                //console.log(s.name,itemkey)
                statusReturn = s.value;
            }
        });

        return statusReturn;
    }

    function actionPerformed(item, apiEndPoint, e) {
        if (apiEndPoint == "Preview Clips") {
            setIsClips(true);
            setClips({ video: item.clips, thumbnails: item.thumbnails });
            return false;
        }
        e.preventDefault();
        processedDataInfo(item, apiEndPoint, e);
    }

    function processedDataInfo(item, apiEndPoint, e) {
        e.preventDefault();
        props.processedData(item, apiEndPoint);
    }

    const handleVideoPreview = (e) => {
        let video_as_base64 = URL.createObjectURL(e[0]);
        let video_as_files = e[0];

        setVideo({
            video_preview: video_as_base64,
            video_file: video_as_files,
        });
    };

    function uplaodVideo(item, apiEndPoint, e) {
        e.preventDefault();
        props.uplaodVideo(item, apiEndPoint, video);
    }

    function deleteItem(item, e) {
        e.preventDefault();
        props.deleteItem(item)
    }

    function moveItem(item, apiEndPoint, e) {
        e.preventDefault();
        props.move(item, apiEndPoint);
    }

    const onDrop = useCallback(acceptedFiles => {
        handleVideoPreview(acceptedFiles);
    }, [])
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

    function actionRender(item) {
        // className="px-2 py-0.5 my-1 inline-flex text-xs leading-5 font-semibold rounded border border-indigo-800 bg-indigo-300 hover:bg-indigo-200 text-indigo-900 cursor-pointer"
        switch (item.state) {
            case "new": {
                return (
                           <>
                    { item?.owners?.new != undefined &&  item?.owners?.new !=appUserInfo?.user?.email && (
                        <p >Claimed by {item?.owners?.new}</p>
                    )
                    }  

                     <button onClick={(e) => actionPerformed(item, "claim", e)} className={`${currentUserPermission('new',"kkkk") && item?.owners?.new == undefined  ? 'px-2 py-0.5 my-1 inline-flex text-xs leading-5 font-semibold rounded border border-indigo-800 bg-indigo-300 hover:bg-indigo-200 text-indigo-900 cursor-pointer' : 'hidden'}`} >
                        Claim
                    </button>        
                    {/* {
                       JSON.stringify(item?.owners?.new) 
                       
                    }  sadasdsada    {appUserInfo.user?.email}      */}
                                                        
                    <button onClick={(e) => actionPerformed(item, "submit", e)} className={`${currentUserPermission('new',"kkkk") && ( item?.owners?.new !== undefined && item?.owners?.new ==appUserInfo?.user?.email )? 'px-2 py-0.5 my-1 inline-flex text-xs leading-5 font-semibold rounded border border-indigo-800 bg-indigo-300 hover:bg-indigo-200 text-indigo-900 cursor-pointer' : 'hidden'}`} >
                        Submit
                    </button>
                    </>

                );
            }
            case "awaiting_review_by_lead_journalist": {
                // return  'Approve | Reject'
                return (    
                        
                    <>
                    { item?.owners?.awaiting_review_by_lead_journalist != undefined &&  item?.owners?.awaiting_review_by_lead_journalist !=appUserInfo?.user?.email && (
                        <p >Claimed by {item?.owners?.awaiting_review_by_lead_journalist}</p>
                    )
                    }  

                     <button onClick={(e) => actionPerformed(item, "claim", e)} className={`${currentUserPermission('awaiting_review_by_lead_journalist',"") && item?.owners?.awaiting_review_by_lead_journalist == undefined  ? 'px-2 py-0.5 my-1 inline-flex text-xs leading-5 font-semibold rounded border border-indigo-800 bg-indigo-300 hover:bg-indigo-200 text-indigo-900 cursor-pointer' : 'hidden'}`} >
                        Claim
                    </button>              
                    <div className={`${currentUserPermission('awaiting_review_by_lead_journalist',"")  && ( item?.owners?.awaiting_review_by_lead_journalist !== undefined && item?.owners?.awaiting_review_by_lead_journalist ==appUserInfo?.user?.email ) ? 'flex space-x-2 items-center justify-center' : 'hidden'}`}>
                        <svg onClick={(e) => actionPerformed(item, "lead_journalist_approve", e)} className="h-8 w-8 text-green-400 hover:text-green-600 cursor-pointer" x-description="Heroicon name: check-circle" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                        </svg>
                        <svg onClick={(e) => actionPerformed(item, "lead_journalist_reject", e)} className="h-8 w-8 text-red-500 hover:text-red-600 cursor-pointer" x-description="Heroicon name: x-circle" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
                        </svg>
                    </div>
                    </>
                );
            }
            case "awaiting_video_upload": {
                return (   
                    <>
                    { item?.owners?.awaiting_video_upload != undefined &&  item?.owners?.awaiting_video_upload !=appUserInfo?.user?.email && (
                        <p >Claimed by {item?.owners?.awaiting_video_upload}</p>
                    )
                    }  

                     <button onClick={(e) => actionPerformed(item, "claim", e)} className={`${currentUserPermission('awaiting_video_upload',"") && item?.owners?.awaiting_video_upload == undefined  ? 'px-2 py-0.5 my-1 inline-flex text-xs leading-5 font-semibold rounded border border-indigo-800 bg-indigo-300 hover:bg-indigo-200 text-indigo-900 cursor-pointer' : 'hidden'}`} >
                        Claim
                    </button>                  
                         <div className={`${currentUserPermission('awaiting_video_upload',"kkkk") && ( item?.owners?.awaiting_video_upload !== undefined && item?.owners?.awaiting_video_upload ==appUserInfo?.user?.email )? 'block text-center justify-center items-center' : 'hidden'}`}>
                        {video != null ? (
                            <>
                                <div className="flex justify-center items-center">
                                    <video className="w-4/5" controls src={video.video_preview} />
                                </div>
                                <div className="flex justify-center space-x-1">
                                    <span onClick={(e) => uplaodVideo(item, 'upload_video', e)} className="px-2 py-0.5 my-1 inline-flex text-xs leading-5 font-semibold rounded border border-blue-800 bg-blue-100 hover:bg-blue-200 text-blue-800 cursor-pointer">
                                        Upload
									</span>
                                    <span onClick={() => setVideo(null)} className="px-2 py-0.5 my-1 inline-flex text-xs leading-5 font-semibold rounded border border-blue-800 bg-blue-100 hover:bg-blue-200 text-blue-800 cursor-pointer">
                                        Cancel
									</span>
                                </div>

                            </>
                        ) : (
                                <>
                                  
                                    <div className={`${!currentUserPermission('awaiting_video_upload') ? 'hidden' : 'w-full p-2'}`}>
                                        <div {...getRootProps()} className="w-full flex justify-center px-6 pt-5 pb-6 border-2 border-gray-100 border-dashed rounded-md">
                                            <input {...getInputProps()} />
                                            <div className="cursor-pointer text-center">
                                                <svg className="mx-auto h-12 w-12 text-gray-200" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                {
                                                    isDragActive ?
                                                        <p className="mt-1 text-sm text-gray-400">
                                                            Drop the files here ...
                                                        </p>
                                                        :
                                                        <>
                                                            <p className="mt-1 text-sm text-gray-400">
                                                                <button type="button" className="font-medium text-gray-50 hover:text-gray-100 pr-2 focus:outline-none focus:underline transition duration-150 ease-in-out">
                                                                    Upload a file
                                                                </button>
                                                                or drag and drop
                                                            </p>
                                                            <p className="mt-1 text-xs text-gray-200">
                                                                MP4, MOV, WMV up to 500MB
                                                            </p>
                                                        </>
                                                }

                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                    </div>
                    </>

                );
                // return  (<form encType="multipart/form-data" method="POST" action="/news_items/upload_video?token=abcdef" > <input name='source_file' type='file' /><input type="submit" /> </form>)
            }
            case "awaiting_review_by_lead_video_editor": {
                return (
                    <>
                    { item?.owners?.awaiting_review_by_lead_video_editor != undefined &&  item?.owners?.awaiting_review_by_lead_video_editor !=appUserInfo?.user?.email && (
                        <p >Claimed by {item?.owners?.awaiting_review_by_lead_video_editor}</p>
                    )
                    }  

                     <button onClick={(e) => actionPerformed(item, "claim", e)} className={`${currentUserPermission('awaiting_review_by_lead_video_editor',"") && item?.owners?.awaiting_review_by_lead_video_editor == undefined  ? 'px-2 py-0.5 my-1 inline-flex text-xs leading-5 font-semibold rounded border border-indigo-800 bg-indigo-300 hover:bg-indigo-200 text-indigo-900 cursor-pointer' : 'hidden'}`} >
                        Claim
                    </button>  
                    <div className={`${currentUserPermission('awaiting_review_by_lead_video_editor',"") && ( item?.owners?.awaiting_review_by_lead_video_editor !== undefined && item?.owners?.awaiting_review_by_lead_video_editor ==appUserInfo?.user?.email )? 'flex space-x-2 items-center justify-center' : 'hidden'}`}>
                    
                        <span onClick={(e) => actionPerformed(item, "Preview Clips", e)} className="px-2 py-0.5 my-1 inline-flex text-xs leading-5 font-semibold rounded border border-blue-800 bg-blue-100 hover:bg-blue-200 text-blue-800 cursor-pointer">
                            Preview Clips
						</span>
                        <svg onClick={(e) => actionPerformed(item, "lead_video_editor_approve", e)} className="h-8 w-8 text-green-400 hover:text-green-600 cursor-pointer" x-description="Heroicon name: check-circle" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                        </svg>
                        <svg onClick={(e) => actionPerformed(item, "lead_video_editor_reject", e)} className="h-8 w-8 text-red-500 hover:text-red-600 cursor-pointer" x-description="Heroicon name: x-circle" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
                        </svg>
                    </div>
                    </>
                );
            }
            case "ready_for_push": {
                return (
                    <>
                    { item?.owners?.ready_for_push != undefined &&  item?.owners?.ready_for_push !=appUserInfo?.user?.email && (
                        <p >Claimed by {item?.owners?.ready_for_push}</p>
                    )
                    }  

                     <button onClick={(e) => actionPerformed(item, "claim", e)} className={`${currentUserPermission('ready_for_push',"") && item?.owners?.ready_for_push == undefined  ? 'px-2 py-0.5 my-1 inline-flex text-xs leading-5 font-semibold rounded border border-indigo-800 bg-indigo-300 hover:bg-indigo-200 text-indigo-900 cursor-pointer' : 'hidden'}`} >
                        Claim
                    </button>  
                   
                    <span onClick={(e) => actionPerformed(item, "push_to_feed", e)} className={`${currentUserPermission('ready_for_push',"") && ( item?.owners?.ready_for_push !== undefined && item?.owners?.ready_for_push ==appUserInfo?.user?.email ) ? 'px-2 py-0.5 my-1 inline-flex text-xs leading-5 font-semibold rounded border border-green-800 bg-green-100 hover:bg-green-200 text-green-800 cursor-pointer' : 'hidden'}`}>
                        Push To Feed
                    </span>
                    </>
                );
            }
            case "pushed_to_feed": {
                return (
                    <>
                    { item?.owners?.pushed_to_feed != undefined &&  item?.owners?.pushed_to_feed !=appUserInfo?.user?.email && (
                        <p >Claimed by {item?.owners?.pushed_to_feed}</p>
                    )
                    }  

                     <button onClick={(e) => actionPerformed(item, "claim", e)} className={`${currentUserPermission('pushed_to_feed',"") && item?.owners?.ready_for_push == undefined  ? 'px-2 py-0.5 my-1 inline-flex text-xs leading-5 font-semibold rounded border border-indigo-800 bg-indigo-300 hover:bg-indigo-200 text-indigo-900 cursor-pointer' : 'hidden'}`} >
                        Claim
                    </button>  
                   
                    <span onClick={(e) => actionPerformed(item, "remove_from_feed", e)} className= {`${currentUserPermission('pushed_to_feed',"") && ( item?.owners?.pushed_to_feed !== undefined && item?.owners?.pushed_to_feed ==appUserInfo?.user?.email )  ? 'hiddpx-2 py-0.5 my-1 inline-flex text-xs leading-5 font-semibold rounded border border-red-800 bg-red-100 hover:bg-red-200 text-red-800 cursor-pointeren' : 'hidden'}`}>
                        Remove From Feed
                    </span>
                    </>
                );
            }
            case "removed_from_feed": {
                
                return (   
                    <>
                    { item?.owners?.removed_from_feed != undefined &&  item?.owners?.removed_from_feed !=appUserInfo?.user?.email && (
                        <p >Claimed by {item?.owners?.removed_from_feed}</p>
                    )
                    }  

                     <button onClick={(e) => actionPerformed(item, "claim", e)} className={`${currentUserPermission('removed_from_feed',"") && item?.owners?.removed_from_feed == undefined  ? 'px-2 py-0.5 my-1 inline-flex text-xs leading-5 font-semibold rounded border border-indigo-800 bg-indigo-300 hover:bg-indigo-200 text-indigo-900 cursor-pointer' : 'hidden'}`} >
                        Claim
                    </button>  

                    <span onClick={(e) => actionPerformed(item, "push_to_feed", e)} className= {`${currentUserPermission('removed_from_feed',"")  && ( item?.owners?.removed_from_feed !== undefined && item?.owners?.removed_from_feed ==appUserInfo?.user?.email ) ? 'px-2 py-0.5 my-1 inline-flex text-xs leading-5 font-semibold rounded border border-green-800 bg-green-100 hover:bg-green-200 text-green-800 cursor-pointer' : 'hidden'}`}>
                        Push To Feed
                    </span>
                    </>
                );
            }
            case "transcoding": {
                return (
                    <span onClick={(e) => refreshData(e)} className="px-2 py-0.5 my-1 inline-flex text-xs leading-5 font-semibold rounded border border-green-800 bg-green-100 hover:bg-green-200 text-green-800 cursor-pointer">
                        Refresh
                    </span>
                );
            }

            default: {
                return "";
            }
        }
    }

    function openCreateBox(flag) {
        setIsEdit(flag);
    }

    function updateNewsItem(item_data) {
        console.log("Update Item: ", item_data);
        props.updateItem(item.id,item_data,props.index);
        setIsEdit(false);
    }
    function getColorCode(){

        if(categories != null){
                return categories?.hex ? categories?.hex : '#e5e7eb';
           
        }else{
            return '#e5e7eb';
        }
       
    }
    function getFeedCategories(){
        let f = feeds?.findIndex(x => x.id === item.feed_id);
        console.log("categories ",feeds[f]);
        let c =feeds[f]?.categories.findIndex(x => x.number === item.category);
        console.log("feeds[f]?.categories[c] ",feeds[f]?.categories[c]);
        setCategories(feeds[f]?.categories[c]);
    }
    return (
        <>
            {!isEdit ?
                <>
                    {categories && item ? (
                        <div className="w-full mx-auto h-auto max-h-2xl">
                            <div className="flex flex-no-wrap justify-center">
                                <div className="w-1/12 mx-auto flex-none float-left">
                                    <div className="bg-purple-700 p-1 h-32 w-1 mx-auto"></div>
                                </div>
                            </div>
                            <div className="flex flex-no-wrap justify-center">
                                <div className="w-11/12 mx-auto flex-none float-left">
                                    <div className="md:flex shadow-lg mx-6 md:mx-auto w-full h-full">
                                    {/* border-${categories[item?.category].color} */}
                                        <div style={{borderColor: getColorCode()}} className={`relative w-full h-full md:w-4/5 px-4 py-2 bg-white rounded-l-lg border-l-8`}>
                                            <div className="mb-4 grid grid-cols-2">
                                                <div className="left-0 flex justify-start">
                                                    {isExpand ? 
                                                        <FontAwesomeIcon  onClick={()=>setIsExpand(false)} className="w-5 hover:text-gray-900 cursor-pointer" icon={['fas', 'chevron-down']} />
                                                        :
                                                        <FontAwesomeIcon onClick={()=>setIsExpand(true)} className="w-5 hover:text-gray-900 cursor-pointer" icon={['fas', 'chevron-up']} />
                                                    }
                                                    
                                                </div>
                                                <div className="right-0 flex justify-end space-x-2">
                                                    <button onClick={() => openCreateBox(true)} className="px-2 py-1 bg-blue-500 hover:bg-blue-700 text-white rounded text-xs cursor-pointer flex items-center">
                                                        <FontAwesomeIcon className="w-4 mr-1 cursor-pointer" icon={['fas', 'edit']} />
                                                        Edit
                                                    </button>
                                                    <button onClick={(e) => deleteItem(item, e)} className="px-2 py-1 bg-red-500 hover:bg-red-700 text-white rounded text-xs cursor-pointer">Delete</button>
                                                    {
                                                        props.index != 0 && (
                                                            <button className="px-2 py-0.5 text-gray-600 text-xs rounded">
                                                                <FontAwesomeIcon onClick={(e) => moveItem(item, "increment_ordinal", e)} className="w-5 hover:text-gray-900" icon={['fas', 'arrow-up']} />
                                                            </button>
                                                        )
                                                    }

                                                    {
                                                        props.index != props.totalData && (
                                                            <button className="px-2 py-0.5 text-gray-600 text-xs rounded">
                                                                <FontAwesomeIcon onClick={(e) => moveItem(item, "decrement_ordinal", e)} className="w-5 hover:text-gray-900" icon={['fas', 'arrow-down']} />
                                                            </button>
                                                        )
                                                    }
                                                </div>
                                            </div>
                                            <div className="flex items-center mb-4">
                                                <h2 className="text-base text-gray-800 font-medium mr-auto">{item?.title}</h2>
                                            </div>
                                            {item?.descriptions.length > 0 && (
                                                <div className="w-full mb-4">
                                                    <div className="p-4 shadow rounded border border-gray-300">
                                                        <div className="block">
                                                            <div className="border-b border-gray-200">
                                                                <nav className="flex -mb-px">
                                                                    {item?.descriptions.map((lang, i) => (
                                                                        <a key={i} href={void (0)} onClick={() => showSentences(i)} className={`${activeLang === i ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} cursor-pointer ml-8 group inline-flex items-center py-2 px-1 border-b-2 font-medium text-sm leading-5 focus:outline-none focus:text-indigo-800 focus:border-indigo-700 capitalize`} aria-current="page">
                                                                            <span>{lang.language}</span>
                                                                        </a>
                                                                    ))}
                                                                </nav>
                                                            </div>
                                                            <div className="mt-4" role="group" aria-labelledby="teams-headline">
                                                                {sentences?.sentences.map((sentence, i) => (
                                                                    <div key={i} className="flex items-center space-x-3 pl-3">
                                                                        <div className="flex-shrink-0 w-2.5 h-2.5 rounded-full bg-indigo-500"></div>
                                                                        <div className="truncate hover:text-gray-600 text-xs">
                                                                            <span>{sentence}</span>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {!isExpand && (
                                                <>
                                                    <div className="w-full mb-6">
                                                        <div className="p-4 shadow rounded border border-gray-300">
                                                            <div className="block">
                                                                <div className="border-b border-gray-200">
                                                                    <nav className="flex -mb-px">
                                                                        <a href={void (0)} onClick={() => showCredits('news_credits', item?.news_credits)} className={`${creditsData?.title === 'news_credits' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} cursor-pointer ml-8 group inline-flex items-center py-2 px-1 border-b-2 font-medium text-sm leading-5  focus:outline-none focus:text-indigo-800 focus:border-indigo-700`} aria-current="page">
                                                                            <span>News Credits</span>
                                                                        </a>
                                                                        <a href={void (0)} onClick={() => showCredits('visual_credits', item?.visual_credits)} className={`${creditsData?.title === 'visual_credits' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} cursor-pointer ml-8 group inline-flex items-center py-2 px-1 border-b-2 font-medium text-sm leading-5 focus:outline-none focus:text-gray-700 focus:border-gray-300`}>
                                                                            <span>Visual Credits</span>
                                                                        </a>
                                                                    </nav>
                                                                </div>
                                                                <div className="mt-4 max-h-24 overflow-y-scroll" role="group" aria-labelledby="teams-headline">
                                                                    {creditsData?.data.map((credit, i) => (
                                                                        <div key={i} className="flex items-center space-x-3 pl-3">
                                                                            <div className="flex-shrink-0 w-2.5 h-2.5 rounded-full bg-indigo-500"></div>
                                                                            <div className="truncate hover:text-gray-600 text-xs">
                                                                                <a href={credit.url} target="_blank">{credit.link_text}</a>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {
                                                            props.showComment &&(
                                                                <div className="w-full py-4">
                                                            <div className="w-full truncate">
                                                                    <span className="text-xs truncate" dangerouslySetInnerHTML={{ __html: (comment?.text) }}></span>
                                                            </div>
                                                            <div className="w-full flex text-center justify-end space-x-2">
                                                                    <span className="text-white w-6 h-6 rounded-full p-3 bg-blue-600 text-xs flex items-center justify-center">{item?.comments.length}</span>
                                                                <Link href={`/cms/[item_id]`} as={`/cms/${item.id}`}>
                                                                    <label className="text-sm font-bold text-gray-800 cursor-pointer hover:underline">Comments</label>
                                                                </Link>
                                                            </div>
                                                        </div>
                                                            )

                                    
                                                        }
                                                        
                                                    </div>
                                                    <div className="absolute mb-4 mr-4 bottom-0 inset-x-0">
                                                <div className="w-full space-x-2 flex justify-end">
                                                    {item?.tags.map(tag => (
                                                        <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium leading-4 bg-blue-100 text-blue-800">
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                                </>
                                            )}
                                        </div>
                                        {/* bg-${categories[item?.category].color} */}
                                        <div style={{backgroundColor: getColorCode()}}className={` w-full md:w-1/5 relative z-10 rounded-lg rounded-l-none`}>
                                            <div className="inset-x-0 top-0 transform">
                                                <div className="flex justify-center transform">
                                                {/* bg-${categories[item?.category].color} */}
                                                    <span style={{backgroundColor: getColorCode()}} className={` shadow inline-flex w-full h-10 flex items-center justify-center text-center px-4 py-1 text-sm leading-5 font-semibold tracking-wider uppercase text-white`}>
                                                        {showStatus(item?.state)}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="h-auto w-full flex items-start">
                                                {item?.state != "awaiting_video_upload" ?
                                                    <>
                                                        {item.thumbnails.length > 0 && (
                                                            <img className={`${isExpand ? 'w-1/2' : 'w-full'} h-auto mx-auto shadow-2xl`}
                                                                src={item.thumbnails[0].url} alt="" />
                                                        )}
                                                    </>
                                                    : null
                                                }

                                            </div>
                                            <div className="w-full flex justify-center my-8">
                                                {actionRender(item)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : null}

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
                                                {/* {clips?.video.map((clip, i) => (
                                            <div key={i} className="mx-auto sm:mx-0 w-full md:w-1/4 lg:w-1/5 h-82 sm:pr-4 mb-4">
                                                <div className="w-full text-sm text-center">Aspect Ratio: {clip.aspect_ratio}</div>
                                                <PreviewClip videoUrl={clip.url} image={clips.thumbnails[i].url} />
                                            </div>
                                        ))} */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </>
                :
                <>
                    <CreateItem state="edit" close={openCreateBox} update={updateNewsItem} data={props.item} />
                </>
            }

        </>
    )
}

export default PreviewItem