import Link from "next/link";
import Router from "next/router";
import { useContext, useEffect, useRef, useState } from "react";
import { LayoutContext } from "../../contexts";

import { config as f_config, library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import httpCms from "../../utils/http-cms";
import { userInfo } from "os";

f_config.autoAddCss = false;
library.add(fas, fab);

const HeaderProfileComponent = () => {
    const { setLoading, appUserInfo, setAppUserInfo, setNotification,clearAPPData,currentUserPermission } = useContext(LayoutContext);
    const profileWrapperRef = useRef(null);
    useOutsideAlerter(profileWrapperRef);
    const [openProfileDropdown, setOpenProfileDropdown] = useState(false);
    const toggleProfileDropdown = () => { setOpenProfileDropdown(!openProfileDropdown) };
    const [onOffShift,setOnOffShift] = useState(false);
    function logoutUserCheck() {
      
        if (appUserInfo == null) {
            //|| (appUserInfo?.token !="" && appUserInfo?.token != undefined)
            setLoading(false);         
            Router.push('/');
            return false;
        }
    }
    useEffect(() =>{
        setOnOffShift(appUserInfo?.user?.on_shift)
    },[])
    function useOutsideAlerter(ref) {
        useEffect(() => {
           
            logoutUserCheck();
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

    const logout = (e) => {
        e.preventDefault();
        setLoading(true);
        httpCms.get(`/admin_user/logout?token=${appUserInfo?.token}`)
            .then(response => {
                setLoading(false);
                clearAPPData();
                Router.push('/');
               
            })
            .catch(e => {
                console.log(e);
                setLoading(false);
            })
            .finally(() => {
                clearAPPData();
               // setAppUserInfo(null);
                setLoading(false);
            });
    }
    function checkShiftSatus(appUserInfo){
        setLoading(true);
        httpCms.patch(`/admin_user/${appUserInfo.user.email}/toggle_shift?token=${appUserInfo?.token}`)
          .then((response) => {
            if (response.data.user.on_shift != null) {         
                setOnOffShift(response.data.user.on_shift);
            } else {
              alert("Something wrong !!");
            }
          })
          .catch((e) => {
            
            setLoading(false);
          })
          .finally(() => {
            setLoading(false);
          });
      }
    return (
        <div ref={profileWrapperRef} data-id="profile" className="relative inline-block text-center">
            <span onClick={() => toggleProfileDropdown()} className="cursor-pointer inline-flex items-center justify-center h-12 w-12 rounded-full sfd-btn-primary">
                <span className="text-lg font-medium leading-none text-white">{appUserInfo?.displayName}</span>
            </span>
            {openProfileDropdown && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg">
                    <div className="rounded-md bg-white shadow-xs">
                        <div className="py-1 text-left text-base" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                            <div>
                                <a href={void (0)} className="text-gray-700 bg-white cursor-default block px-4 py-1 text-xs leading-5 focus:outline-none focus:bg-gray-100 focus:text-gray-900" role="menuitem">
                                    <span className="w-full">Signed in as</span><br />
                                    <span className="w-full truncate font-bold">{appUserInfo?.user.email}</span><br />
                                    <span className="w-full truncate font-bold">{appUserInfo?.user.job_title}</span><br />
                                </a>
                            </div>
                            <div>
                                <input  className={`${currentUserPermission('onshift',"") ? '' : 'hidden'}`} type="checkbox" checked={onOffShift} onChange={()=>checkShiftSatus(appUserInfo)}/>
                                <Link href={'/cms/setting'}>

                                    <a href={void (0)} className={`${currentUserPermission('user_manager',"") ? 'flex space-x-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 bg-white cursor-pointer block px-4 py-1 text-xs leading-5 focus:outline-none focus:bg-gray-100 focus:text-gray-900' : 'hidden'}`} role="menuitem">
                                        <FontAwesomeIcon className="w-3" icon={['fas', 'cog']} />
                                        <span>Settings</span>
                                    </a>

                                    {/* <a href={void (0)} className={`${true ? 'flex space-x-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 bg-white cursor-pointer block px-4 py-1 text-xs leading-5 focus:outline-none focus:bg-gray-100 focus:text-gray-900' : 'hidden'}`}role="menuitem">
                                        <FontAwesomeIcon className="w-3" icon={['fas', 'cog']} />
                                        <span>Settings</span>
                                    </a> */}
                                </Link>
                                <a href={void (0)} onClick={(e) => logout(e)} className="flex space-x-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 bg-white cursor-pointer block px-4 py-1 text-xs leading-5 focus:outline-none focus:bg-gray-100 focus:text-gray-900" role="menuitem">
                                    <FontAwesomeIcon className="w-3" icon={['fas', 'sign-out-alt']} />
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