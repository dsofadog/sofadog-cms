
import { config as f_config, library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import React, { useState, useEffect, useContext, useRef } from 'react';
import UserInfo from './UserInfo';
import { LayoutContext } from '../../contexts';

import HttpCms from '../../utils/http-cms';
import Router from "next/router";

f_config.autoAddCss = false;
library.add(fas, fab, far);

const ProfileComponent = () => {

    const [addNew, setAddNew] = useState(false);
    const toggleAddNew = () => { setAddNew(!addNew) };
    const [user, setUser] = useState(null);
    const { setLoading, appUserInfo, currentUserPermission } = useContext(LayoutContext);
    const [userPass, setUserPass] = useState(null);
    useEffect(() => {

    }, []);



    function setUserPassword(status) {
        console.log("Update user ", status, );
        let request = {
            "email": appUserInfo.user.email,
            "password": userPass
        };
        setLoading(true);
        HttpCms.post("admin_user/" + appUserInfo.user.email + "/" + status + "?token=" + appUserInfo?.token, request)
            .then((response) => {
                if(response.data.user != null){
                    alert("Your password has been successfully changed,please login again");
                     Router.push('/');
                }
                setAddNew(false);

            })
            .catch((e) => {
                console.log(e);
            })
            .finally(() => {
                setLoading(false);
            });

    }

    function handleInputChange(e) {
        console.log(e.target);
        e.preventDefault();
        setUserPass(e.target.value);
    }
    return (
        <div className="min-h-3/4">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="w-full flex">
					<div className="w-1/2">
						<h1 className="text-2xl font-semibold text-gray-900">Change Password</h1>
					</div>
					<div className="w-1/2 flex justify-end">
						{/* <button onClick={toggleAddNew} className="px-2 py-1 bg-indigo-600 hover:bg-indigo-700 rounded text-white text-sm">+ Add User</button> */}
					</div>
				</div>
			</div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                <div className="min-h-96 pt-2">
                    <div className="bg-white shadow overflow-hidden sm:rounded-md">
                        <div className="h-32 p-4 grid grid-cols-1 gap-y-1 gap-x-2 sm:grid-cols-4">
                            <div className="sm:col-span-2">
                                <label htmlFor="email" className="block text-sm font-medium leading-5 text-gray-700">
                                    New Password
                                </label>
                                <div className="mt-1 rounded-md shadow-sm">
                                    <input type="password" name="password" value={userPass} onChange={(e)=>handleInputChange(e)} className="form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5" />
                                </div>
                            </div>
                            <div className="col-span-4 flex space-x-4">
                                <button onClick={(e) => setUserPassword("set_password")} className="text-white text-sm px-4 py-2 bg-green-600 hover:bg-green-500 rounded">Submit</button>        
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProfileComponent