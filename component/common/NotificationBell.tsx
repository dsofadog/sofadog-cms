import { useEffect, useRef, useState } from "react";
import { useRouter } from 'next/router'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


import httpCms from "utils/http-cms";

import tokenManager from 'utils/token-manager'

// f_config.autoAddCss = false;
// library.add(fas, fab, far);

const NotificationBell = () => {

    const bellWrapperRef = useRef(null);
    useOutsideAlerter(bellWrapperRef);
    const [openBellDropdown, setOpenBellDropdown] = useState(false);
    const toggleBellDropdown = () => { setOpenBellDropdown(!openBellDropdown) };
    const [notifications, setNotificatons] = useState(null);
    const router = useRouter();


    function useOutsideAlerter(ref) {
        useEffect(() => {

            setTimeout(() => {
                getNotifications();
            }, 2)

            function handleClickOutside(event) {
                if (ref.current && !ref.current.contains(event.target)) {
                    if (ref.current.dataset.id === "bell") {
                        setOpenBellDropdown(false);
                    }
                }
            }
            // Bind the event listener
            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                // Unbind the event listener on clean up
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }, [ref]);
    }
    function getNotifications() {
        console.log("Start Notification---------- ")
        httpCms.get(tokenManager.attachToken('/notifications'))
            .then((response) => {
                if (response.data != null) {
                    console.log("notification: ", response.data);
                    setNotificatons(response.data.notifications);
                    let count = response.data.notifications.filter(notification => notification.read.includes(false));
                    console.log("count", count);
                } else {
                    alert("Something wrong !!");
                }
            })
            .catch((e) => {
            })
            .finally(() => {
            });
    }
    function readNotification(notification) {
        console.log("Start Notification---------- ", notification.read)
        if (notification.read === false) {
            httpCms.post(tokenManager.attachToken('/notifications/${notification?.id}/read'))
                .then((response) => {
                    if (response.data != null) {
                        console.log("notification: ", response.data);
                        setNotificatons(response.data.notifications);
                    } else {
                        alert("Something wrong !!");
                    }
                })
                .catch((e) => {
                })
                .finally(() => {
                });
        }

    }

    function markAllAsRead(){
        httpCms.post(tokenManager.attachToken('/notifications/read'))
                .then((response) => {
                    if (response.data != null) {
                        console.log("notification: ", response.data);
                        setNotificatons(response.data.notifications);

                    } else {
                        alert("Something wrong !!");
                    }
                })
                .catch((e) => {
                })
                .finally(() => {
                });
    }

    function notificationAction(notification) {
        //readNotification(notification.itemId)
        if (notification.object_type === 'news_item') {
            // router.push(
            //     '/cms/[item_id]',
            //     '/cms/' + notification.object_id)
            router.replace('/cms?id=' + notification.object_id)
        }
    }
    return (
        <>
            <div ref={bellWrapperRef} data-id="bell" className="relative inline-block text-center">
                <span onClick={() => toggleBellDropdown()} className="inline-block relative">
                    <div className="flex items-center justify-center cursor-pointer h-10 w-10 rounded-full p-1 bg-gray-500 hover:bg-gray-400">
                        <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                    </div>
                    {notifications?.filter(x => x.read === false).length > 0 && (
                        <span className="absolute flex items-center justify-center top-0 right-0 -mt-2 -mr-2 h-6 w-6 rounded-full text-white text-xs bg-red-500 border-red-500 border">{notifications?.filter(x => x.read === false).length}</span>
                    )}

                </span>
                {openBellDropdown && (
                    <div className="origin-top-right absolute right-0 mt-2 w-84 rounded-md shadow-lg">
                        <div className="h-full rounded-md bg-white ring-1 ring-black ring-opacity-5">
                            <div className="h-96 divide-y overflow-y-auto py-1 text-left" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                                {
                                    notifications?.length > 0 ?
                                        <>
                                            <div className="w-full flex px-4 py-1 text-xs leading-5 text-gray-700 hover:bg-gray-200 hover:text-gray-900 cursor-pointer">
                                                <div className="w-11/12 flex justify-start">
                                                    <label className="font-bold text-sm text-gray-800 cursor-pointer"><span>Mark all as read</span></label>
                                                </div>
                                                <div className="w-1/12 flex items-center justify-end">
                                                    <FontAwesomeIcon onClick={() => markAllAsRead()} className="w-5 h-5 cursor-pointer hover:text-white rounded-full bg-gray-300 hover:bg-green-500 p-1" icon={['fas', 'check']} />
                                                </div>
                                            </div>
                                            {
                                                notifications?.map((notification) => (

                                                    <div key={notification.id} className="w-full flex px-4 py-1 text-xs leading-5 text-gray-700 hover:bg-gray-200 hover:text-gray-900 cursor-pointer">
                                                        <div onClick={(e) => notificationAction(notification)} className="w-11/12 flex justify-start">
                                                            <label className="text-sm text-gray-800 cursor-pointer">{notification.title}</label>
                                                        </div>
                                                        <div className="w-1/12 flex items-center justify-end">
                                                            <FontAwesomeIcon onClick={() => readNotification(notification)} className="w-5 h-5 cursor-pointer hover:text-white rounded-full bg-gray-300 hover:bg-green-500 p-1" icon={['fas', 'check']} />
                                                        </div>
                                                    </div>

                                                ))
                                            }
                                        </>

                                        :
                                        <>
                                            <div className="w-full flex px-4 py-1 text-xs leading-5 text-gray-700 cursor-pointer">
                                                <div className="w-full flex justify-center">
                                                    <label className="text-sm text-gray-800 cursor-pointer">No Notification!</label>
                                                </div>
                                            </div>
                                        </>
                                }
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}

export default NotificationBell