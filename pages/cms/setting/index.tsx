import { profile } from "console"
import Link from "next/link"
import { useState, useContext } from "react"
import FeedComponent from "../../../component/common/FeedComponent"
import NavHeader from "../../../component/common/NavHeader"
import UserComponent from "../../../component/common/UserComponent"
import ProfileComponent from "../../../component/common/ProfileComponent";
import { LayoutContext } from "../../../contexts";


const Setting = () => {

    const [tabIndex, setTabIndex] = useState<number>(0);
    const {

        currentUserPermission,
    } = useContext(LayoutContext);

    return (
        <div className="w-full h-full min-h-screen bg-gray-500">
            <NavHeader />
            <div className="flex overflow-hidden p-4 mt-5">
                <div className="flex flex-shrink-0 ml-4">
                    <div className="flex flex-col w-64">
                        <div className="flex flex-col h-0 flex-1 bg-gray-800">
                            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
                                <nav className="mt-5 flex-1 px-2 bg-gray-800 space-y-1">
                                    <div className={`${currentUserPermission("super_admin", "") ? "" : "hidden"}`}>
                                        <a onClick={() => setTabIndex(0)} href={void (0)} className={`${tabIndex === 0 ? 'bg-gray-900' : 'hover:bg-gray-700'} group flex items-center px-2 py-2 text-sm leading-5 font-medium text-white rounded-md focus:outline-none focus:bg-gray-700 transition ease-in-out duration-150`}>
                                            <svg className="mr-3 h-6 w-6 text-gray-400 group-hover:text-gray-300 group-focus:text-gray-300 transition ease-in-out duration-150" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                            </svg>
                                        Users
                                    </a>
                                    </div>
                                    <div className={`${currentUserPermission("super_admin", "") ? "" : "hidden"}`}>
                                        <a onClick={() => setTabIndex(1)} href={void (0)} className={`${tabIndex === 1 ? 'bg-gray-900' : 'hover:bg-gray-700'} group flex items-center px-2 py-2 text-sm leading-5 font-medium text-white rounded-md focus:outline-none focus:bg-gray-700 transition ease-in-out duration-150`}>
                                            <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="photo-video" className="mr-3 h-6 w-6 text-gray-400 group-hover:text-gray-300 group-focus:text-gray-300 svg-inline--fa fa-photo-video fa-w-20" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
                                                <path fill="currentColor" d="M608 0H160a32 32 0 0 0-32 32v96h160V64h192v320h128a32 32 0 0 0 32-32V32a32 32 0 0 0-32-32zM232 103a9 9 0 0 1-9 9h-30a9 9 0 0 1-9-9V73a9 9 0 0 1 9-9h30a9 9 0 0 1 9 9zm352 208a9 9 0 0 1-9 9h-30a9 9 0 0 1-9-9v-30a9 9 0 0 1 9-9h30a9 9 0 0 1 9 9zm0-104a9 9 0 0 1-9 9h-30a9 9 0 0 1-9-9v-30a9 9 0 0 1 9-9h30a9 9 0 0 1 9 9zm0-104a9 9 0 0 1-9 9h-30a9 9 0 0 1-9-9V73a9 9 0 0 1 9-9h30a9 9 0 0 1 9 9zm-168 57H32a32 32 0 0 0-32 32v288a32 32 0 0 0 32 32h384a32 32 0 0 0 32-32V192a32 32 0 0 0-32-32zM96 224a32 32 0 1 1-32 32 32 32 0 0 1 32-32zm288 224H64v-32l64-64 32 32 128-128 96 96z"></path>
                                            </svg>
                                        Feed
                                    </a>
                                    </div>
                                    <a onClick={() => setTabIndex(2)} href={void (0)} className={`${tabIndex === 2 ? 'bg-gray-900' : 'hover:bg-gray-700'} group flex items-center px-2 py-2 text-sm leading-5 font-medium text-white rounded-md focus:outline-none focus:bg-gray-700 transition ease-in-out duration-150`}>
                                        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="key" className="mr-3 h-6 w-6 text-gray-400 group-hover:text-gray-300 group-focus:text-gray-300 svg-inline--fa fa-key fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                            <path fill="currentColor" d="M512 176.001C512 273.203 433.202 352 336 352c-11.22 0-22.19-1.062-32.827-3.069l-24.012 27.014A23.999 23.999 0 0 1 261.223 384H224v40c0 13.255-10.745 24-24 24h-40v40c0 13.255-10.745 24-24 24H24c-13.255 0-24-10.745-24-24v-78.059c0-6.365 2.529-12.47 7.029-16.971l161.802-161.802C163.108 213.814 160 195.271 160 176 160 78.798 238.797.001 335.999 0 433.488-.001 512 78.511 512 176.001zM336 128c0 26.51 21.49 48 48 48s48-21.49 48-48-21.49-48-48-48-48 21.49-48 48z"></path>
                                        </svg>
                                        Change Password
                                    </a>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col w-0 flex-1 overflow-hidden">
                    <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none" tabIndex={0}>
                        {tabIndex === 0 ?
                            <UserComponent></UserComponent>
                            :
                            tabIndex === 1 ?
                                <FeedComponent></FeedComponent>
                                :
                                tabIndex === 2 ?
                                    <ProfileComponent></ProfileComponent>
                                    : null
                        }
                    </main>
                </div>
            </div>

        </div>
    )
}
export default Setting