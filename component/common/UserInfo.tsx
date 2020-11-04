import { config as f_config, library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { useEffect, useRef, useState } from 'react';

f_config.autoAddCss = false;
library.add(fas, fab, far);

const UserInfo = (props) => {
    const roles = [
        {
            id: "super_admin",
            description: "Super Admin"
        },
        {
            id: "journalist",
            description: "Journalist"
        },
        {
            id: "Video_editor",
            description: "Video Editor"
        }
    ]

    const [selectedRole, setSelectedRole] = useState([])
    
    const [openRoleDropdown, setOpenRoleDropdown] = useState(false);
    const toggleRoleDropdown = () => { setOpenRoleDropdown(!openRoleDropdown) };

    const roleWrapperRef = useRef(null);
    useOutsideAlerter(roleWrapperRef);

    const [userData, setUserData] = useState(null);
    //const [user,setUser] = useState(null);
    const [action, setAction] = useState('view');

    useEffect(() => {
        if (props.data) {
            //console.log("prop ",props.data);
            setUserData(props.data);
            //console.log("Email ",userData);
        }
        if (props.action) {
            console.log("prop.action",props.action);
            setAction(props.action);
        }
    }, []);

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
    function handleInputChange(e){
        console.log(e.target);
        e.preventDefault();
        setUserData({
            ...userData,
            [e.target.name]: e.target.value
        })
    }
    function handleMultiSelectChange(e,data){
        e.preventDefault();
        setSelectedRole([
            ...selectedRole,data.id
        ]);
        toggleRoleDropdown();
    }
    function isRoleSelected(role) {
        if (selectedRole.length > 0) {
           // console.log("roledata",selectedRole.filter(item => item.id == role.id))
            return selectedRole.includes(role.id);
        }
        return false;
    }
    function saveData(e){
        e.preventDefault();
        setUserData({
            ...userData,
            admin_roles:selectedRole
        })
        let data = {
            first_name: userData.first_name,
            last_name: userData.last_name,
            email:userData.email,
            admin_roles:selectedRole
        }
        if(action === 'add'){
            props.addUser(data)
        }else{         
            console.log(data);
            props.updateUser(data.email,data)
        }
        console.log("hello blank",data);
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
                        <div className="min-w-0 flex-1 px-4 md:grid md:grid-cols-2 md:gap-4">
                            {action === 'view' ?
                                <div>
                                    <div className="text-sm leading-5 font-medium text-indigo-600 truncate">{userData?.first_name + userData?.last_name}</div>
                                    <div className="mt-2 flex items-center text-sm leading-5 text-gray-500">
                                        <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                        </svg>
                                        <span className="truncate">{userData?.email}</span>
                                    </div>
                                </div>
                                :
                                <div>
                                    <div className="text-sm leading-5 font-medium text-indigo-600">
                                        <div className="w-full relative rounded-md shadow-sm flex space-x-2">
                                            <input type="text" name="first_name" value={userData?.first_name} onChange={(e)=>handleInputChange(e)} className="form-input block w-full text-sm sm:leading-3" placeholder="First Name" />
                                            <input type="text" name="last_name" value={userData?.last_name} onChange={(e)=>handleInputChange(e)} className="form-input block w-full text-sm sm:leading-3" placeholder="Last Name" />
                                        </div>
                                    </div>
                                    <div className="mt-2 flex items-center text-sm leading-5 text-gray-500">
                                        <div className="w-full relative rounded-md shadow-sm flex space-x-2">
                                            <input type="email" name="email" value={userData?.email} onChange={(e)=>handleInputChange(e)} className="form-input block w-full text-sm sm:leading-3" placeholder="Email" />
                                        </div>
                                    </div>
                                </div>
                            }

                            <div className="h-full flex">
                                {action === 'view' ?
                                    <div>
                                        <div className="h-full flex items-center text-sm leading-5 text-gray-900">
                                            {userData?.admin_roles[0].description}
                                        </div>
                                    </div>
                                    :
                                    <div>
                                        <div className="h-full absolute flex items-start text-sm leading-5 text-gray-900">
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
                                }
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2 ">
                        {action === 'view' ?
                            <FontAwesomeIcon onClick={() => setAction('edit')} className="w-5 h-5 cursor-pointer hover:text-blue-600" icon={['fas', 'edit']} />
                            :
                            <FontAwesomeIcon onClick={(e)=>saveData(e)} className="w-5 h-5 cursor-pointer hover:text-white rounded-full bg-gray-300 hover:bg-green-500 p-1" icon={['fas', 'check']} />
                        }

                        {
                            action === 'add' ?
                                <FontAwesomeIcon onClick={props?.callback}   className="w-4 h-4 cursor-pointer hover:text-red-800" icon={['fas', 'times']} />
                                :
                            action === 'edit' ?
                                <FontAwesomeIcon onClick={() => setAction('view')} className="w-4 h-4 cursor-pointer hover:text-red-800" icon={['fas', 'times']} />
                                :
                                <FontAwesomeIcon className="w-4 h-4 cursor-pointer hover:text-red-800" icon={['fas', 'trash-alt']} />
                        }
                    </div>
                </div>
            </div>
        </li>
    )
}

export default UserInfo