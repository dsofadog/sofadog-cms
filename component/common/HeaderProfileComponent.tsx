import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "rootReducer";

import { logout, toggleShift } from 'features/auth/slices/auth.slice'
import MiniLoader from "./MiniLoader";



const HeaderProfileComponent = () => {


    const {currentUser, isLoading} = useSelector((state: RootState)=>state.auth)
    const dispatch = useDispatch()

    const profileWrapperRef = useRef(null);
    useOutsideAlerter(profileWrapperRef);
    const [openProfileDropdown, setOpenProfileDropdown] = useState(false);
    const toggleProfileDropdown = () => { setOpenProfileDropdown(!openProfileDropdown) };

    function useOutsideAlerter(ref) {
        useEffect(() => {
            function handleClickOutside(event) {

                if (ref.current && !ref.current.contains(event.target)) {
                    if (ref.current.dataset.id === "profile") {
                        setOpenProfileDropdown(false);
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
        <div ref={profileWrapperRef} data-id="profile" className="relative inline-block text-center mr-2 md:mr-5">
            <div className="cursor-pointer flex items-center" onClick={() => toggleProfileDropdown()} >
                <span className="inline-flex items-center justify-center h-10 w-10 md:h-12 md:w-12 rounded-full sfd-btn-primary">
                    <span className="text-lg font-medium leading-none text-white">{currentUser.first_name.charAt(0) + currentUser.last_name.charAt(0)}</span>
                </span>
                <div className="hidden md:block ml-3">
                    <p className="text-sm font-medium text-white">
                        {currentUser.first_name} {currentUser.last_name}
                    </p>
                    <p className="text-xs font-medium text-gray-300 group-hover:text-gray-200">
                        {currentUser.job_title}
                    </p>
                </div>
            </div>
            {openProfileDropdown && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg">
                    <div className="rounded-md bg-white ring-1 ring-black ring-opacity-5">
                        <div className="py-1 text-left text-base" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                            <div>
                                <a href={void (0)} className="text-gray-700 bg-white cursor-default block px-4 py-1 text-xs leading-5 focus:outline-none focus:bg-gray-100 focus:text-gray-900" role="menuitem">
                                    <span className="w-full">Signed in as</span><br />
                                    <span className="w-full truncate font-bold">{currentUser.email}</span><br />
                                    {/* <span className="w-full truncate font-bold">{appUserInfo?.user.job_title}</span><br /> */}
                                </a>
                            </div>
                            <div>
                                <div>
                                    <div className="flex space-x-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 bg-white cursor-pointer block px-4 py-1 text-xs leading-5 focus:outline-none focus:bg-gray-100 focus:text-gray-900 items-center">
                                        <span>Shift On / Off</span>
                                        <MiniLoader active={isLoading}>
                                        <span
                                            role="checkbox"
                                            aria-checked={currentUser.on_shift}
                                            onClick={() => dispatch(toggleShift(currentUser.email))}
                                            className={`${currentUser.on_shift ? 'bg-indigo-600' : 'bg-gray-200'}  relative inline-block flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring`}
                                        >

                                            <span
                                                aria-hidden="true"
                                                className={`${currentUser.on_shift ? 'translate-x-5' : 'translate-x-0'} inline-block h-5 w-5 rounded-full bg-white shadow transform transition ease-in-out duration-200`}
                                            ></span>
                                        </span>
                                        </MiniLoader>
                                        
                                    </div>
                                </div>

                                <Link href={'/cms/settings/profile'}>
                                    <a href={void (0)} className={`${true ? 'flex space-x-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 bg-white cursor-pointer block px-4 py-1 text-xs leading-5 focus:outline-none focus:bg-gray-100 focus:text-gray-900' : 'hidden'}`} role="menuitem">
                                        <FontAwesomeIcon className="w-3" icon={['fas', 'cog']} />
                                        <span>Settings</span>
                                    </a>
                                </Link>
                                <a href={void (0)} onClick={() => dispatch(logout())} className="flex items-center space-x-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 bg-white cursor-pointer block px-4 py-1 text-xs leading-5 focus:outline-none focus:bg-gray-100 focus:text-gray-900" role="menuitem">
                                    <FontAwesomeIcon className="w-3 h-3" icon={['fas', 'sign-out-alt']} />
                                    <span>Logout</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default HeaderProfileComponent