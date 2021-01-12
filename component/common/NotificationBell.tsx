import { useEffect, useRef, useState } from "react";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import _ from 'lodash'

import httpCms from "utils/http-cms";

import tokenManager from 'utils/token-manager'
import notify from 'utils/notify'

import MiniLoader from "./MiniLoader";
import Notification from './Notification'
import useInterval from "component/hooks/useInterval";

const NotificationBell = () => {

    const bellWrapperRef = useRef(null);
    useOutsideAlerter(bellWrapperRef);
    const [openBellDropdown, setOpenBellDropdown] = useState(false);
    const toggleBellDropdown = () => { setOpenBellDropdown(!openBellDropdown) };
    const [notifications, setNotificatons] = useState(null);
    const [markingAllAsRead, setMarkingAllAsRead] = useState<boolean>(false)


    useInterval(() => {
        refreshNotifications();
    }, 1000 * 60)

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

    function refreshNotifications() {
        if (!openBellDropdown) {
            getNotifications()
        }
    }


    async function getNotifications() {
        try {

            const response = await httpCms.get(tokenManager.attachToken('/notifications'))
            if (response.data != null) {
                setNotificatons(response.data.notifications);
            } else {
                notify('danger')
            }
        } catch (err) {
            notify('danger')
        }

    }


    const markAllAsRead = async () => {
        try {

            setMarkingAllAsRead(true)
            const response = await httpCms.post(tokenManager.attachToken('/notifications/read'))
            if (response.data != null) {
                console.log("notification: ", response.data);
                setNotificatons(response.data.notifications);

            } else {
                notify('danger')
                alert("Something wrong !!");
            }
        } catch (err) {
            notify('danger')
        } finally {
            setMarkingAllAsRead(false)
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
                            <ul className="max-h-96 divide-y overflow-y-auto py-1 text-left border-b" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                                {
                                    notifications?.length > 0 ?
                                        <>
                                            <li className="w-full flex px-4 py-1 text-xs leading-5 text-gray-700 hover:bg-gray-200 hover:text-gray-900 cursor-pointer">
                                                <div className="w-11/12 flex justify-start">
                                                    <label className="font-bold text-sm text-gray-800 cursor-pointer"><span>Mark all as read</span></label>
                                                </div>
                                                <div className="w-1/12 flex items-center justify-end">
                                                    <MiniLoader active={markingAllAsRead}>
                                                        <FontAwesomeIcon onClick={() => markAllAsRead()} className="w-5 h-5 cursor-pointer hover:text-white rounded-full bg-gray-300 hover:bg-green-500 p-1" icon={['fas', 'check']} />
                                                    </MiniLoader>
                                                </div>
                                            </li>
                                            {
                                                notifications?.map((notification) => (
                                                    <Notification key={notification.id} notification={notification} onRead={(notifications) => { setNotificatons(notifications) }} />
                                                ))
                                            }
                                        </>
                                        :
                                        <>
                                            <li className="w-full flex px-4 py-1 text-xs leading-5 text-gray-700 cursor-pointer">
                                                <div className="w-full flex justify-center">
                                                    <label className="text-sm text-gray-800 cursor-pointer">No Notification!</label>
                                                </div>
                                            </li>
                                        </>
                                }
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}

export default NotificationBell