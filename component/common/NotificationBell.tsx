import { useEffect, useRef, useState } from "react";

const NotificationBell = () => {

    const bellWrapperRef = useRef(null);
    useOutsideAlerter(bellWrapperRef);
    const [openBellDropdown, setOpenBellDropdown] = useState(false);
    const toggleBellDropdown = () => { setOpenBellDropdown(!openBellDropdown) };

    function useOutsideAlerter(ref) {
        useEffect(() => {
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

    return (
        <>
            <div ref={bellWrapperRef} data-id="bell" className="relative inline-block text-center">
                <span onClick={() => toggleBellDropdown()} className="inline-block relative mr-2">
                    <div className="flex items-center justify-center cursor-pointer h-10 w-10 rounded-full p-1 bg-gray-500 hover:bg-gray-400">
                        <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                    </div>
                    <span className="absolute flex items-center justify-center top-0 right-0 -mt-2 -mr-2 h-6 w-6 rounded-full text-white text-xs bg-red-500 border-red-500 border">99</span>
                </span>
                {openBellDropdown && (
                    <div className="origin-top-right absolute right-0 mt-2 w-84 rounded-md shadow-lg">
                        <div className="h-full rounded-md bg-white shadow-xs">
                            <div className="h-96 overflow-y-auto py-1 text-left" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                                <div className="w-full flex px-4 py-1 text-xs leading-5 text-gray-700 hover:bg-gray-200 hover:text-gray-900 cursor-pointer">
                                    <div className="w-11/12 flex justify-start">
                                        The purpose of the function is to display the specified HTML code inside the specified HTML element.
                                    </div>
                                    <div className="w-1/12 flex items-center justify-end">
                                        <div className="flex-shrink-0 w-2.5 h-2.5 rounded-full sfd-btn-primary"></div>
                                    </div>
                                </div>
                                <div className="w-full flex px-4 py-1 text-xs leading-5 text-gray-700 hover:bg-gray-200 hover:text-gray-900 cursor-pointer">
                                    <div className="w-11/12 flex justify-start">
                                        The purpose of the function is to display the specified HTML code inside the specified HTML element.
                                    </div>
                                    <div className="w-1/12 flex items-center justify-end">
                                        <div className="flex-shrink-0 w-2.5 h-2.5 rounded-full sfd-btn-primary"></div>
                                    </div>
                                </div>
                                <div className="w-full flex px-4 py-1 text-xs leading-5 text-gray-700 hover:bg-gray-200 hover:text-gray-900 cursor-pointer">
                                    <div className="w-11/12 flex justify-start">
                                        The purpose of the function is to display the specified HTML code inside the specified HTML element.
                                    </div>
                                    <div className="w-1/12 flex items-center justify-end">
                                        <div className="flex-shrink-0 w-2.5 h-2.5 rounded-full sfd-btn-primary"></div>
                                    </div>
                                </div>
                                <div className="w-full flex px-4 py-1 text-xs leading-5 text-gray-700 hover:bg-gray-200 hover:text-gray-900 cursor-pointer">
                                    <div className="w-11/12 flex justify-start">
                                        The purpose of the function is to display the specified HTML code inside the specified HTML element.
                                    </div>
                                    <div className="w-1/12 flex items-center justify-end">
                                        <div className="flex-shrink-0 w-2.5 h-2.5 rounded-full sfd-btn-primary"></div>
                                    </div>
                                </div>
                                <div className="w-full flex px-4 py-1 text-xs leading-5 text-gray-700 hover:bg-gray-200 hover:text-gray-900 cursor-pointer">
                                    <div className="w-11/12 flex justify-start">
                                        The purpose of the function is to display the specified HTML code inside the specified HTML element.
                                    </div>
                                    <div className="w-1/12 flex items-center justify-end">
                                        <div className="flex-shrink-0 w-2.5 h-2.5 rounded-full sfd-btn-primary"></div>
                                    </div>
                                </div>
                                <div className="w-full flex px-4 py-1 text-xs leading-5 text-gray-700 hover:bg-gray-200 hover:text-gray-900 cursor-pointer">
                                    <div className="w-11/12 flex justify-start">
                                        The purpose of the function is to display the specified HTML code inside the specified HTML element.
                                    </div>
                                    <div className="w-1/12 flex items-center justify-end">
                                        <div className="hidden flex-shrink-0 w-2.5 h-2.5 rounded-full sfd-btn-primary"></div>
                                    </div>
                                </div>
                                <div className="w-full flex px-4 py-1 text-xs leading-5 text-gray-700 hover:bg-gray-200 hover:text-gray-900 cursor-pointer">
                                    <div className="w-11/12 flex justify-start">
                                        The purpose of the function is to display the specified HTML code inside the specified HTML element.
                                    </div>
                                    <div className="w-1/12 flex items-center justify-end">
                                        <div className="hidden flex-shrink-0 w-2.5 h-2.5 rounded-full sfd-btn-primary"></div>
                                    </div>
                                </div>
                                <div className="w-full flex px-4 py-1 text-xs leading-5 text-gray-700 hover:bg-gray-200 hover:text-gray-900 cursor-pointer">
                                    <div className="w-11/12 flex justify-start">
                                        The purpose of the function is to display the specified HTML code inside the specified HTML element.
                                    </div>
                                    <div className="w-1/12 flex items-center justify-end">
                                        <div className="hidden flex-shrink-0 w-2.5 h-2.5 rounded-full sfd-btn-primary"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}

export default NotificationBell