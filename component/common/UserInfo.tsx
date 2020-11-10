import { config as f_config, library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { useEffect, useRef, useState } from 'react';
import CmsConstant from '../../utils/cms-constant';
import { userInfo } from 'os';

f_config.autoAddCss = false;
library.add(fas, fab, far);

const UserInfo = (props) => {
    const roles = CmsConstant.roles;

    const [selectedRole, setSelectedRole] = useState([])

    const [openRoleDropdown, setOpenRoleDropdown] = useState(false);
    const toggleRoleDropdown = () => { setOpenRoleDropdown(!openRoleDropdown) };

    const roleWrapperRef = useRef(null);
    useOutsideAlerter(roleWrapperRef);

    const [userData, setUserData] = useState(null);
    const [userPass, setUserPass] = useState(null);
    //const [user,setUser] = useState(null);
    const [action, setAction] = useState('view');
    const [tabIndex, setTabIndex] = useState(1);
    let previousAllRole = [];

    useEffect(() => {
        if (props.data) {
            console.log("prop ",props.data);
            setUserData(props.data);
            let r = [];
            props.data.admin_roles.map(role =>{
                r.push(role.id);
            });
            setSelectedRole(r);
            //console.log("Email ",userData);
        }
        if (props.action) {
            console.log("prop.action", props.action);
            setAction(props.action);
        }
    }, [props]);

    function useOutsideAlerter(ref) {
        useEffect(() => {
            function handleClickOutside(event) {

                if (ref.current && !ref.current.contains(event.target)) {
                    if (ref.current.dataset.id === "role") {
                        setOpenRoleDropdown(false);
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

    function handleClickSingleDropdown(val) {
        setSelectedRole(val);
        toggleRoleDropdown();
    }
    function handleInputChange(e) {
        console.log(e.target);
        e.preventDefault();
        setUserData({
            ...userData,
            [e.target.name]: e.target.value
        })
    }

    function handPassChange(e) {
        console.log(e.target);
        e.preventDefault();
        setUserPass(e.target.value)
    }
    function handleMultiSelectChange(e, data) {
        e.preventDefault();
        previousAllRole =selectedRole;
        setSelectedRole([
            ...selectedRole, data.id
        ]);
        
        //toggleRoleDropdown();
    }
    function isRoleSelected(role) {
        if (selectedRole.length > 0) {
            // console.log("roledata",selectedRole.filter(item => item.id == role.id))
            return selectedRole.includes(role.id);
        }
        return false;
    }
    function saveData(e) {
        e.preventDefault();
        setUserData({
            ...userData,
            admin_roles: selectedRole
        })
        let data = {
            first_name: userData.first_name,
            last_name: userData.last_name,
            email: userData.email,
            admin_roles: selectedRole
        }
        if (action === 'add') {
            props.addUser(data)
        } else {
            console.log(data);
            props.updateUser(data.email, data)
        }
        console.log("hello blank", data);
    }

    function userEnableDisabled(e, status) {
        e.preventDefault();
        setUserData({
            ...userData,
            admin_roles: selectedRole
        })
        let data = {
            first_name: userData.first_name,
            last_name: userData.last_name,
            email: userData.email,
            admin_roles: selectedRole
        }
        props.enableDisableUser(status, data);
    }

    function setPassword(e) {
        e.preventDefault();
        setUserData({
            ...userData,
            admin_roles: selectedRole
        })
        let data = {
            first_name: userData.first_name,
            last_name: userData.last_name,
            email: userData.email,
            admin_roles: selectedRole
        }

        props.setUserPassword("set_password", data, userPass);

    }

    function removeAddRole(e,role,type) {
        e.preventDefault()
  
       let data = {
        "email": userData.email,
        "role": role
       }

       console.log(data,"datadata");
     if(type=='remove_role'){
        let info  = previousAllRole.includes(role);
        if(info){
            props.removeRoleUser(data, type);
        } 
        
     }else{
        let difference = selectedRole.filter(x => !previousAllRole.includes(x));
        let  role1 = difference.join();
        let data = {
            "email": userData.email,
            "role": role1
           }
        props.removeRoleUser(data, type);
     }
    
     
               

    }

    function getRoleName(role){
        let index = roles.findIndex(x => x.id === role);
        return roles[index].description;
    }

    return (
        <li>
            <div className="block hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition duration-150 ease-in-out">
                <div className="flex items-center px-4 py-4 sm:px-6">
                    <div className="min-w-0 flex-1 flex items-center">
                        <div className="flex-shrink-0">
                            <span className="cursor-pointer inline-flex items-center justify-center h-12 w-12 rounded-full sfd-btn-primary">
                                <span className="text-lg font-medium leading-none text-white">
                                    {action === 'view' ?
                                        'RC' : ''
                                    }
                                </span>
                            </span>
                        </div>
                        
                        {action === 'view' &&(
                            <>
                                <div className="min-w-0 flex-1 px-4 md:grid md:grid-cols-3 md:gap-4">
                                    <div>
                                        <div className="text-sm leading-5 font-medium text-indigo-600 truncate">{userData?.first_name + userData?.last_name}</div>
                                        <div className="mt-2 flex items-center text-sm leading-5 text-gray-500">
                                            <span className="truncate">{userData?.email}</span>
                                        </div>
                                    </div>
                                    <div className="hidden md:block">
                                        <div>
                                            <div className="text-sm leading-5 text-gray-900">
                                                Job Title
                                            </div>
                                            <div className="mt-2 flex items-center text-sm leading-5 text-gray-500">
                                                {userData?.job_title}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="hidden md:block">
                                        <div>
                                            <div className="text-sm leading-5 text-gray-900">
                                                Roles
                                            </div>
                                            <div className="mt-2 flex items-center text-sm leading-5 text-gray-500">
                                            {userData?.admin_roles[0]?.description}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {action != 'view' && (
                            <div className="min-w-0 flex-1 px-4 md:grid md:grid-cols-1 md:gap-4">
                                <div className="col-span-1">
                                    <div className="sm:hidden">
                                        <select aria-label="Selected tab" className="mt-1 form-select block w-full pl-3 pr-10 py-2 text-base leading-6 border-gray-300 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5 transition ease-in-out duration-150">
                                            <option onClick={() => setTabIndex(1)} selected={tabIndex === 1 ? true : false}>Basic Info</option>
                                            <option onClick={() => setTabIndex(2)} selected={tabIndex === 2 ? true : false}>Role</option>
                                            <option onClick={() => setTabIndex(3)} selected={tabIndex === 3 ? true : false}>Change Password</option>
                                        </select>
                                    </div>
                                    <div className="hidden sm:block">
                                        <div className="border-b border-gray-200">
                                            <nav className="-mb-px flex">
                                                <a href={void (0)} onClick={() => setTabIndex(1)} className={`${tabIndex === 1 ? ' border-indigo-500 text-indigo-600 focus:text-indigo-800 focus:border-indigo-700' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:text-gray-700 focus:border-gray-300'} cursor-pointer whitespace-no-wrap ml-8 py-4 px-1 border-b-2 font-medium text-sm leading-5 focus:outline-none`} aria-current="page">
                                                    Basic Info
                                                </a>
                                                <a href={void (0)} onClick={() => setTabIndex(2)} className={`${tabIndex === 2 ? ' border-indigo-500 text-indigo-600 focus:text-indigo-800 focus:border-indigo-700' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:text-gray-700 focus:border-gray-300'} cursor-pointer whitespace-no-wrap ml-8 py-4 px-1 border-b-2 font-medium text-sm leading-5 focus:outline-none`} aria-current="page">
                                                    Role
                                                </a>
                                                <a href={void (0)} onClick={() => setTabIndex(3)} className={`${tabIndex === 3 ? ' border-indigo-500 text-indigo-600 focus:text-indigo-800 focus:border-indigo-700' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:text-gray-700 focus:border-gray-300'} cursor-pointer whitespace-no-wrap ml-8 py-4 px-1 border-b-2 font-medium text-sm leading-5 focus:outline-none`} aria-current="page">
                                                    Manage Password
                                                </a>
                                                {action === 'add' &&(
                                                    <>
                                                    <button onClick={(e) => saveData(e)} className="h-8 mx-4 mt-3 text-white text-sm px-2 py-1 bg-green-600 hover:bg-green-500 rounded">Submit</button>
                                                    <button onClick={props?.callback} className="h-8 mt-3 text-white text-sm px-2 py-1 bg-blue-600 hover:bg-blue-500 rounded">Cancel</button>
                                                    </>
                                                )}
                                                {action === 'edit' &&(
                                                    <button onClick={(e) => setAction('view')} className="h-8 mx-4 mt-3 text-white text-sm px-2 py-1 bg-blue-600 hover:bg-blue-500 rounded">Cancel</button>
                                                )}
                                            </nav>
                                        </div>
                                    </div>
                                    <div className="mt-6 grid grid-cols-1 gap-y-2 gap-x-2 sm:grid-cols-4">
                                        {tabIndex === 1 && (
                                            <>
                                                <div className="sm:col-span-2">
                                                    <label htmlFor="first_name" className="block text-sm font-medium leading-5 text-gray-700">
                                                        First name
                                                    </label>
                                                    <div className="mt-1 rounded-md shadow-sm">
                                                        <input name="first_name" value={userData?.first_name} onChange={(e)=>handleInputChange(e)} className="form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5" />
                                                    </div>
                                                </div>

                                                <div className="sm:col-span-2">
                                                    <label htmlFor="last_name" className="block text-sm font-medium leading-5 text-gray-700">
                                                        Last name
                                                    </label>
                                                    <div className="mt-1 rounded-md shadow-sm">
                                                        <input name="last_name" value={userData?.last_name} onChange={(e)=>handleInputChange(e)} className="form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5" />
                                                    </div>
                                                </div>

                                                <div className="sm:col-span-2">
                                                    <label htmlFor="email" className="block text-sm font-medium leading-5 text-gray-700">
                                                        Email address
                                                    </label>
                                                    <div className="mt-1 rounded-md shadow-sm">
                                                        <input type="email" name="email" value={userData?.email} onChange={(e)=>handleInputChange(e)} className="form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5" />
                                                    </div>
                                                </div>
                                                <div className="sm:col-span-2">
                                                    <label htmlFor="email" className="block text-sm font-medium leading-5 text-gray-700">
                                                        Job Title
                                                    </label>
                                                    <div className="mt-1 rounded-md shadow-sm">
                                                        <input type="text" name="job_title" value={userData?.job_title} onChange={(e)=>handleInputChange(e)} className="form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5" />
                                                    </div>
                                                </div>
                                                <div className="sm:col-span-4 flex space-x-4">
                                                    {action === 'edit' &&(
                                                        <>
                                                        <button onClick={(e) => saveData(e)} className="text-white text-sm px-2 py-1 bg-green-600 hover:bg-green-500 rounded">Submit</button>
                                                        </>
                                                    )}
                                                    
                                                    
                                                </div>
                                            </>
                                        )}

                                        {tabIndex === 2 && (
                                            <>
                                            <div className="sm:col-span-1">
                                                <div className="rounded-md">
                                                    <div className="h-full flex items-start text-sm leading-5 text-gray-900">
                                                        <div ref={roleWrapperRef} data-id="role" className="relative inline-block text-left">
                                                            <div>
                                                                {roles && (
                                                                    <span onClick={toggleRoleDropdown} className="rounded-md shadow-sm">
                                                                        <button type="button" className="inline-flex justify-center w-full rounded-md border border-gray-300 px-2 py-1.5 bg-white text-xs leading-5 font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800 transition ease-in-out duration-150 capitalize" id="options-menu" aria-haspopup="true" aria-expanded="true">
                                                                        
                                                                            Select Role
                                                                                    
                                                                            <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                                            </svg>
                                                                        </button>
                                                                    </span>
                                                                )}
                                                            </div>
                                                            {openRoleDropdown && (
                                                                <div className="origin-top-left absolute left-0 mt-2 w-56 rounded-md shadow-lg z-50">
                                                                    <div className="rounded-md bg-white shadow-xs">
                                                                        <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                                                                            {roles?.map((role, i) => (
                                                                                <a key={i} href={void (0)} onClick={(e) => handleMultiSelectChange(e,role)} className={`${isRoleSelected(role) ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 bg-white' } cursor-pointer block px-4 py-1 text-xs leading-5 focus:outline-none focus:bg-gray-100 focus:text-gray-900 uppercase`} role="menuitem">
                                                                                    {role.description}
                                                                                </a>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="sm:col-span-3 flex flex-wrap items-center">
                                            {selectedRole?.length > 0 && (
                                                    <>
                                                        {selectedRole.map((role, i) => (
                                                            <span key={i} className="inline-flex items-center mr-2 mb-2 h-8 px-2 py-0.5 rounded text-xs font-medium leading-4 bg-blue-100 text-blue-800">
                                                                {getRoleName(role)}
                                                                <button onClick={(e)=>removeAddRole(e,role,'remove_role')} type="button" className="flex-shrink-0 ml-1.5 inline-flex text-indigo-500 focus:outline-none focus:text-indigo-700" aria-label="Remove small badge">
                                                                    <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                                                                        <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
                                                                    </svg>
                                                                </button>
                                                            </span>
                                                        ))}
                                                    </>

                                                )}
                                            </div>
                                            </>
                                        )}

                                        {tabIndex === 3 && (
                                            <>
                                                <div className="sm:col-span-2">
                                                    <label htmlFor="email" className="block text-sm font-medium leading-5 text-gray-700">
                                                        New Passowrd
                                                    </label>
                                                    <div className="mt-1 rounded-md shadow-sm">
                                                        <input type="password" name="password" value={userPass} onChange={(e)=>handPassChange(e)} className="form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5" />
                                                    </div>
                                                </div>
                                                <div className="hidden sm:col-span-2">
                                                    <label htmlFor="email" className="block text-sm font-medium leading-5 text-gray-700">
                                                        Confirm Passowrd
                                                    </label>
                                                    <div className="mt-1 rounded-md shadow-sm">
                                                        <input type="password" className="form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5" />
                                                    </div>
                                                </div>
                                                <div className="sm:col-span-4 flex space-x-4">
                                                    {action === 'edit' &&(
                                                        <>
                                                        <button onClick={(e) => setPassword(e)} className="text-white text-sm px-2 py-1 bg-green-600 hover:bg-green-500 rounded">Submit</button>
                                                        </>
                                                    )}                                                    
                                                </div>
                                            </>
                                        )}

                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center space-x-2 ">
                        {action === 'view'&& (
                            <>
                            <FontAwesomeIcon onClick={() => setAction('edit')} className="w-5 h-5 cursor-pointer hover:text-blue-600" icon={['fas', 'edit']} />
                            <FontAwesomeIcon className="w-4 h-4 cursor-pointer hover:text-red-800" icon={['fas', 'trash-alt']} />
                            {userData?.disabled ?
                                <FontAwesomeIcon onClick={(e) => userEnableDisabled(e, 'enable')}  className="w-4 h-4 cursor-pointer hover:text-green-700" icon={['fas', 'user']} />
                                :
                                <FontAwesomeIcon onClick={(e) => userEnableDisabled(e, 'disable')} className="w-4 h-4 cursor-pointer hover:text-red-800" icon={['fas', 'user-slash']} />
                            }
                            </>
                        )}

                    </div>
                </div>
            </div>
        </li>
    )
}

export default UserInfo