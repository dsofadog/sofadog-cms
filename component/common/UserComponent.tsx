
import { config as f_config, library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import React, { useState, useEffect, useContext, useRef } from 'react';
import UserInfo from './UserInfo';
import { LayoutContext } from '../../contexts';

import HttpCms from '../../utils/http-cms';

f_config.autoAddCss = false;
library.add(fas, fab, far);

const UserComponent = () => {

	const [addNew,setAddNew] = useState(false);
	const toggleAddNew = () => { setAddNew(!addNew) };
	const [user, setUser] = useState(null);
	const { setLoading, appUserInfo,currentUserPermission } = useContext(LayoutContext);
	useEffect(() => {
		//getUserData(users);
		callAllUserInfo();	
	},[]);

	function callAllUserInfo(){
		setLoading(true);
		let api = "admin_users?token="+appUserInfo?.token;
		HttpCms.get(api)
		.then(response => {
			console.log("fetch res: ", response.data);
			getUserData(response.data.users);
			setLoading(false);
			//console.log(response.data, "response.data.data");
		})
		.catch(e => {
			console.log(e);
			setLoading(false);
		})
		.finally(() => {
			setLoading(false);
		});
	}
	
	function getUserData(userDeatils:any){
		setUser(userDeatils);
		console.log("User Detailsasdasdas:  ",user)
	}
	function addUser(userData){
		console.log("user ",userData);
		userData.job_title="test";
		setLoading(true);
        HttpCms.post("admin_user?token="+appUserInfo?.token, userData)
            .then((response) => {
				setAddNew(false);				
				setUser([...user, response.data.user]);
				
			
              
            })
            .catch((e) => {
                console.log(e);
            })
            .finally(() => {
                setLoading(false);
            });
	}
	function updateUser(id,userData){
		setLoading(true);
		HttpCms.patch("admin_user/"+id+"?token="+appUserInfo?.token, userData)
		.then((response) => {
			setAddNew(false);
			console.log(user,"usekkkkkkkkkkkkkkkkkkkkkkkkkk");
			console.log(response,"response");
			setLoading(false);
			//setUser([...user, response.data.user]);
			
		
		  
		})
		.catch((e) => {
			console.log(e);
		})
		.finally(() => {
			setLoading(false);
		});
	}

	function enableDisableUser(status,data){
		setLoading(true);
		let request = {"email":data.email};
		let users  =user;
		let index = users.findIndex(user => user.email == data.email);
		HttpCms.post("admin_user/"+data.email+"/"+status+"?token="+appUserInfo?.token, request)
		.then((response) => {
			setAddNew(false);
            users[index]=response.data.user;
			setUser(users);		
		
		  
		})
		.catch((e) => {
			console.log(e);
		})
		.finally(() => {
			setLoading(false);
		});
	}

	function setUserPassword(status,data,userPass){
		console.log("Update user ",status,data);
		let request = {
			"email":data.email,
			"password":userPass
	     };
		 setLoading(true);
		HttpCms.post("admin_user/"+data.email+"/"+status+"?token="+appUserInfo?.token, request)
		.then((response) => {
			setAddNew(false);
		})
		.catch((e) => {
			console.log(e);
		})
		.finally(() => {
			setLoading(false);
		});

	}

	function removeRoleUser(data,type){	
		//setLoading(true);
		HttpCms.patch("admin_user/"+data.email+"/"+type+"?token="+appUserInfo?.token, data)
		.then((response) => {
		//	console.log("response: ",response);
		//setLoading(false);
			setAddNew(false);
		})
		.catch((e) => {
			console.log(e);
		})
		.finally(() => {
			setLoading(false);
		});

	}
	return (
		<div className="min-h-3/4">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="w-full flex">
					<div className="w-1/2">
						<h1 className="text-2xl font-semibold text-gray-900">Users</h1>
					</div>
					<div className="w-1/2 flex justify-end">
						<button onClick={toggleAddNew} className="px-2 py-1 bg-indigo-600 hover:bg-indigo-700 rounded text-white text-sm">+ Add User</button>
					</div>
				</div>
			</div>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
				<div className="min-h-96 pt-2">
					<div className="bg-white shadow overflow-hidden sm:rounded-md">
						<ul>
							{addNew &&(
								<UserInfo action="add" callback={toggleAddNew} addUser={addUser}></UserInfo>
							)}							
							{user?.map((data,i) => (
								<UserInfo data={data} setUserPassword  ={setUserPassword} updateUser={updateUser} enableDisableUser={enableDisableUser} removeRoleUser={removeRoleUser}></UserInfo>
							))}
							
							
							
						</ul>
					</div>
				</div>
			</div>
		</div>
	)
}

export default UserComponent