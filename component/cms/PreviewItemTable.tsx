import { useCallback, useEffect, useState, useContext } from "react";
import Link from "next/link";

import { useDropzone } from "react-dropzone";

import { config as f_config, library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";

import { LayoutContext } from "contexts";
import CmsConstant from "utils/cms-constant";
import HttpCms from "utils/http-cms";
import CreateItem from "./CreateItem";
import PreviewClip from "./PreviewClip";


f_config.autoAddCss = false;
library.add(fas, fab);
//const categories = CmsConstant.Category;
const PreviewItemTable = (props) => {
  const {
    setLoading,
    appUserInfo,
    userIsSuperAdmin,
    currentUserPermission,
  } = useContext(LayoutContext);
  const [item, setItem] = useState(null);
  const [sentences, setSentences] = useState(null);
  const [creditsData, setCreditsData] = useState(null);
  const [activeLang, setActiveLang] = useState(0);
  const [video, setVideo] = useState(null);
  const [isClips, setIsClips] = useState(false);
  const [clips, setClips] = useState({ video: null, thumbnails: null });
  const [isEdit, setIsEdit] = useState(false);
  const [comment, setComment] = useState(null);
  const [isExpand, setIsExpand] = useState(true);
  const [categories, setCategories] = useState(null);
  const [feeds, setFeeds] = useState(null);

  const status = CmsConstant.Status;

  useEffect(() => {
    if (props.item) {
      setItem(props.item);
      setComment(item?.comments[item?.comments.length - 1]);
      setFeeds(props.feeds);
    }
  }, [props]);

  useEffect(() => {
    //fetchComment(props.item.id);
    if (item) {
      showSentences(0);
      getFeedCategories();
      showCredits("news_credits", item.news_credits);
    }
  }, [item]);

  useEffect(() => {
    //fetchComment(props.item.id);
  }, []);

  function fetchComment(id) {
    console.log("calling fetch api");
    // setLoading(true);
    HttpCms.get(`/news_items/${id}/comments?token=${appUserInfo?.token}`)

      .then((response) => {
        console.log(response.data, "response.data");
        if (response.data.comments.length > 0) {
          let c = response.data.comments[response.data.comments.length - 1];
          console.log("c ", c);

          setComment({
            text: c,
            count: response.data.comments.length,
          });
          console.log("comments ", comment);
          // setLoading(false);
        }
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      });
  }

  function refreshData(e) {
    e.preventDefault();
    props.getSigleItem(item.id);
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
    let statusReturn = "";
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
    props.deleteItem(item);
  }

  function moveItem(item, apiEndPoint, e) {
    e.preventDefault();
    props.move(item, apiEndPoint);
  }

  const onDrop = useCallback((acceptedFiles) => {
    handleVideoPreview(acceptedFiles);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  function actionRender(item) {
    // className="px-2 py-0.5 my-1 inline-flex text-xs leading-5 font-semibold rounded border border-indigo-800 bg-indigo-300 hover:bg-indigo-200 text-indigo-900 cursor-pointer"
    switch (item?.state) {
      case "new": {
        return (
          <>
            {item?.owners?.new != undefined &&
              item?.owners?.new != appUserInfo?.user?.email && (
                <p>Claimed by {item?.owners?.new}</p>
              )}

            <button
              onClick={(e) => actionPerformed(item, "claim", e)}
              className={`${
                currentUserPermission("new", "") &&
                  item?.owners?.new == undefined
                  ? "px-2 py-0.5 my-1 inline-flex text-xs leading-5 font-semibold rounded border border-indigo-800 bg-indigo-300 hover:bg-indigo-200 text-indigo-900 cursor-pointer"
                  : "hidden"
                }`}
            >
              Claim
            </button>
            {/* {
                       JSON.stringify(item?.owners?.new) 
                       
                    }  sadasdsada    {appUserInfo.user?.email}      */}

            <button
              onClick={(e) => actionPerformed(item, "submit", e)}
              className={`${
                currentUserPermission("new", "kkkk") &&
                  item?.owners?.new !== undefined &&
                  item?.owners?.new == appUserInfo?.user?.email
                  ? "px-2 py-0.5 my-1 inline-flex text-xs leading-5 font-semibold rounded border border-indigo-800 bg-indigo-300 hover:bg-indigo-200 text-indigo-900 cursor-pointer"
                  : "hidden"
                }`}
            >
              Submit
            </button>
          </>
        );
      }
      case "awaiting_review_by_lead_journalist": {
        // return  'Approve | Reject'
        return (
          <>
            {item?.owners?.awaiting_review_by_lead_journalist != undefined &&
              item?.owners?.awaiting_review_by_lead_journalist !=
              appUserInfo?.user?.email && (
                <p>
                  Claimed by {item?.owners?.awaiting_review_by_lead_journalist}
                </p>
              )}

            <button
              onClick={(e) => actionPerformed(item, "claim", e)}
              className={`${
                currentUserPermission(
                  "awaiting_review_by_lead_journalist",
                  ""
                ) &&
                  item?.owners?.awaiting_review_by_lead_journalist == undefined
                  ? "px-2 py-0.5 my-1 inline-flex text-xs leading-5 font-semibold rounded border border-indigo-800 bg-indigo-300 hover:bg-indigo-200 text-indigo-900 cursor-pointer"
                  : "hidden"
                }`}
            >
              Claim
            </button>
            <div
              className={`${
                currentUserPermission(
                  "awaiting_review_by_lead_journalist",
                  ""
                ) &&
                  item?.owners?.awaiting_review_by_lead_journalist !==
                  undefined &&
                  item?.owners?.awaiting_review_by_lead_journalist ==
                  appUserInfo?.user?.email
                  ? "flex space-x-2 items-center justify-center"
                  : "hidden"
                }`}
            >
              <svg
                onClick={(e) =>
                  actionPerformed(item, "lead_journalist_approve", e)
                }
                className="h-8 w-8 text-green-400 hover:text-green-600 cursor-pointer"
                x-description="Heroicon name: check-circle"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <svg
                onClick={(e) =>
                  actionPerformed(item, "lead_journalist_reject", e)
                }
                className="h-8 w-8 text-red-500 hover:text-red-600 cursor-pointer"
                x-description="Heroicon name: x-circle"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
          </>
        );
      }
      case "awaiting_video_upload": {
        return (
          <>
            {item?.owners?.awaiting_video_upload != undefined &&
              item?.owners?.awaiting_video_upload !=
              appUserInfo?.user?.email && (
                <p>Claimed by {item?.owners?.awaiting_video_upload}</p>
              )}

            <button
              onClick={(e) => actionPerformed(item, "claim", e)}
              className={`${
                currentUserPermission("awaiting_video_upload", "") &&
                  item?.owners?.awaiting_video_upload == undefined
                  ? "px-2 py-0.5 my-1 inline-flex text-xs leading-5 font-semibold rounded border border-indigo-800 bg-indigo-300 hover:bg-indigo-200 text-indigo-900 cursor-pointer"
                  : "hidden"
                }`}
            >
              Claim
            </button>
            <div
              className={`${
                currentUserPermission("awaiting_video_upload", "kkkk") &&
                  item?.owners?.awaiting_video_upload !== undefined &&
                  item?.owners?.awaiting_video_upload == appUserInfo?.user?.email
                  ? "block text-center justify-center items-center"
                  : "hidden"
                }`}
            >
              {video != null ? (
                <>
                  <div className="flex justify-center items-center">
                    <video
                      className="w-4/5"
                      controls
                      src={video.video_preview}
                    />
                  </div>
                  <div className="flex justify-center space-x-1">
                    <span
                      onClick={(e) => uplaodVideo(item, "upload_video", e)}
                      className="px-2 py-0.5 my-1 inline-flex text-xs leading-5 font-semibold rounded border border-blue-800 bg-blue-100 hover:bg-blue-200 text-blue-800 cursor-pointer"
                    >
                      Upload
                    </span>
                    <span
                      onClick={() => setVideo(null)}
                      className="px-2 py-0.5 my-1 inline-flex text-xs leading-5 font-semibold rounded border border-blue-800 bg-blue-100 hover:bg-blue-200 text-blue-800 cursor-pointer"
                    >
                      Cancel
                    </span>
                  </div>
                </>
              ) : (
                  <>
                    <div
                      className={`${
                        !currentUserPermission("awaiting_video_upload")
                          ? "hidden"
                          : "w-full p-2"
                        }`}
                    >
                      <div
                        {...getRootProps()}
                        className="w-full flex justify-center px-6 pt-5 pb-6 border-2 border-gray-100 border-dashed rounded-md"
                      >
                        <input {...getInputProps()} />
                        <div className="cursor-pointer text-center">
                          <svg
                            className="mx-auto h-12 w-12 text-gray-200"
                            stroke="currentColor"
                            fill="none"
                            viewBox="0 0 48 48"
                          >
                            <path
                              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          {isDragActive ? (
                            <p className="mt-1 text-sm text-gray-400">
                              Drop the files here ...
                            </p>
                          ) : (
                              <>
                                <p className="mt-1 text-sm text-gray-400">
                                  <button
                                    type="button"
                                    className="font-medium text-gray-50 hover:text-gray-100 pr-2 focus:outline-none focus:underline transition duration-150 ease-in-out"
                                  >
                                    Upload a file
                              </button>
                              or drag and drop
                            </p>
                                <p className="mt-1 text-xs text-gray-200">
                                  MP4, MOV, WMV up to 500MB
                            </p>
                              </>
                            )}
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
            {item?.owners?.awaiting_review_by_lead_video_editor != undefined &&
              item?.owners?.awaiting_review_by_lead_video_editor !=
              appUserInfo?.user?.email && (
                <p>
                  Claimed by{" "}
                  {item?.owners?.awaiting_review_by_lead_video_editor}
                </p>
              )}

            <button
              onClick={(e) => actionPerformed(item, "claim", e)}
              className={`${
                currentUserPermission(
                  "awaiting_review_by_lead_video_editor",
                  ""
                ) &&
                  item?.owners?.awaiting_review_by_lead_video_editor == undefined
                  ? "px-2 py-0.5 my-1 inline-flex text-xs leading-5 font-semibold rounded border border-indigo-800 bg-indigo-300 hover:bg-indigo-200 text-indigo-900 cursor-pointer"
                  : "hidden"
                }`}
            >
              Claim
            </button>
            <div
              className={`${
                currentUserPermission(
                  "awaiting_review_by_lead_video_editor",
                  ""
                ) &&
                  item?.owners?.awaiting_review_by_lead_video_editor !==
                  undefined &&
                  item?.owners?.awaiting_review_by_lead_video_editor ==
                  appUserInfo?.user?.email
                  ? "flex space-x-2 items-center justify-center"
                  : "hidden"
                }`}
            >
              <span
                onClick={(e) => actionPerformed(item, "Preview Clips", e)}
                className="px-2 py-0.5 my-1 inline-flex text-xs leading-5 font-semibold rounded border border-blue-800 bg-blue-100 hover:bg-blue-200 text-blue-800 cursor-pointer"
              >
                Preview Clips
              </span>
              <svg
                onClick={(e) =>
                  actionPerformed(item, "lead_video_editor_approve", e)
                }
                className="h-8 w-8 text-green-400 hover:text-green-600 cursor-pointer"
                x-description="Heroicon name: check-circle"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <svg
                onClick={(e) =>
                  actionPerformed(item, "lead_video_editor_reject", e)
                }
                className="h-8 w-8 text-red-500 hover:text-red-600 cursor-pointer"
                x-description="Heroicon name: x-circle"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
          </>
        );
      }
      case "ready_for_push": {
        return (
          <>
            {item?.owners?.ready_for_push != undefined &&
              item?.owners?.ready_for_push != appUserInfo?.user?.email && (
                <p>Claimed by {item?.owners?.ready_for_push}</p>
              )}

            <button
              onClick={(e) => actionPerformed(item, "claim", e)}
              className={`${
                currentUserPermission("ready_for_push", "") &&
                  item?.owners?.ready_for_push == undefined
                  ? "px-2 py-0.5 my-1 inline-flex text-xs leading-5 font-semibold rounded border border-indigo-800 bg-indigo-300 hover:bg-indigo-200 text-indigo-900 cursor-pointer"
                  : "hidden"
                }`}
            >
              Claim
            </button>

            <span
              onClick={(e) => actionPerformed(item, "push_to_feed", e)}
              className={`${
                currentUserPermission("ready_for_push", "") &&
                  item?.owners?.ready_for_push !== undefined &&
                  item?.owners?.ready_for_push == appUserInfo?.user?.email
                  ? "px-2 py-0.5 my-1 inline-flex text-xs leading-5 font-semibold rounded border border-green-800 bg-green-100 hover:bg-green-200 text-green-800 cursor-pointer"
                  : "hidden"
                }`}
            >
              Push To Feed
            </span>
          </>
        );
      }
      case "pushed_to_feed": {
        return (
          <>
            {item?.owners?.pushed_to_feed != undefined &&
              item?.owners?.pushed_to_feed != appUserInfo?.user?.email && (
                <p>Claimed by {item?.owners?.pushed_to_feed}</p>
              )}

            <button
              onClick={(e) => actionPerformed(item, "claim", e)}
              className={`${
                currentUserPermission("pushed_to_feed", "") &&
                  item?.owners?.ready_for_push == undefined
                  ? "px-2 py-0.5 my-1 inline-flex text-xs leading-5 font-semibold rounded border border-indigo-800 bg-indigo-300 hover:bg-indigo-200 text-indigo-900 cursor-pointer"
                  : "hidden"
                }`}
            >
              Claim
            </button>

            <span
              onClick={(e) => actionPerformed(item, "remove_from_feed", e)}
              className={`${
                currentUserPermission("pushed_to_feed", "") &&
                  item?.owners?.pushed_to_feed !== undefined &&
                  item?.owners?.pushed_to_feed == appUserInfo?.user?.email
                  ? "hiddpx-2 py-0.5 my-1 inline-flex text-xs leading-5 font-semibold rounded border border-red-800 bg-red-100 hover:bg-red-200 text-red-800 cursor-pointeren"
                  : "hidden"
                }`}
            >
              Remove From Feed
            </span>
          </>
        );
      }
      case "removed_from_feed": {
        return (
          <>
            {item?.owners?.removed_from_feed != undefined &&
              item?.owners?.removed_from_feed != appUserInfo?.user?.email && (
                <p>Claimed by {item?.owners?.removed_from_feed}</p>
              )}

            <button
              onClick={(e) => actionPerformed(item, "claim", e)}
              className={`${
                currentUserPermission("removed_from_feed", "") &&
                  item?.owners?.removed_from_feed == undefined
                  ? "px-2 py-0.5 my-1 inline-flex text-xs leading-5 font-semibold rounded border border-indigo-800 bg-indigo-300 hover:bg-indigo-200 text-indigo-900 cursor-pointer"
                  : "hidden"
                }`}
            >
              Claim
            </button>

            <span
              onClick={(e) => actionPerformed(item, "push_to_feed", e)}
              className={`${
                currentUserPermission("removed_from_feed", "") &&
                  item?.owners?.removed_from_feed !== undefined &&
                  item?.owners?.removed_from_feed == appUserInfo?.user?.email
                  ? "px-2 py-0.5 my-1 inline-flex text-xs leading-5 font-semibold rounded border border-green-800 bg-green-100 hover:bg-green-200 text-green-800 cursor-pointer"
                  : "hidden"
                }`}
            >
              Push To Feed
            </span>
          </>
        );
      }
      case "transcoding": {
        return (
          <span
            onClick={(e) => refreshData(e)}
            className="px-2 py-0.5 my-1 inline-flex text-xs leading-5 font-semibold rounded border border-green-800 bg-green-100 hover:bg-green-200 text-green-800 cursor-pointer"
          >
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
    props.updateItem(item.id, item_data, props.index);
    setIsEdit(false);
  }
  function getColorCode() {
    if (categories != null) {
      return categories?.hex ? categories?.hex : "#e5e7eb";
    } else {
      return "#e5e7eb";
    }
  }
  function getFeedCategories() {
    let f = feeds?.findIndex((x) => x.id === item.feed_id);
    //console.log("categories ", feeds[f]);
    let c = feeds[f]?.categories.findIndex((x) => x.number === item.category);
    console.log("feeds[f]?.categories[c] ", feeds[f]?.categories[c]);
    setCategories(feeds[f]?.categories[c]);
  }

  return (
    <>
      <tr className="bg-white">
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
          {item?.ordinal}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
          {item?.title}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {item?.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium leading-4 bg-blue-100 text-blue-800"
            >
              {tag}
            </span>
          ))}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {showStatus(item?.state)}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {item?.owners.new}
        </td>

        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          <span className="flex">
            <span className="flex-1">
              {actionRender(item)}
            </span>
            <span className="flex-1">
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
            </span>

          </span>

        </td>
      </tr>
    </>
  );
};

export default PreviewItemTable;
