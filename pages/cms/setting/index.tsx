import Link from "next/link"
import NavHeader from "../../../component/common/NavHeader"
import UserComponent from "../../../component/common/UserComponent"

const Setting = () => {

    return (
        <div className="w-full h-full min-h-screen bg-gray-500">
            <NavHeader/>
            <div className="flex overflow-hidden p-4">

                <div className="md:hidden">
                    <div className="fixed inset-0 flex z-40">

                        <div className="fixed inset-0">
                            <div className="absolute inset-0 bg-gray-00 opacity-75"></div>
                        </div>
                        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-gray-800">
                            <div className="absolute top-0 right-0 -mr-14 p-1">
                                <button className="flex items-center justify-center h-12 w-12 rounded-full focus:outline-none focus:bg-gray-600" aria-label="Close sidebar">
                                    <svg className="h-6 w-6 text-white" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">

                                <nav className="mt-5 px-2 space-y-1">
                                    <a href="#" className="group flex items-center px-2 py-2 text-base leading-6 font-medium rounded-md text-white bg-gray-900 focus:outline-none focus:bg-gray-700 transition ease-in-out duration-150">

                                        <svg className="mr-4 h-6 w-6 text-gray-400 group-hover:text-gray-300 group-focus:text-gray-300 transition ease-in-out duration-150" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                        </svg>
                                        Users
                                    </a>

                                </nav>
                            </div>
                        </div>
                        <div className="flex-shrink-0 w-14">

                        </div>
                    </div>
                </div>


                <div className="hidden md:flex md:flex-shrink-0">
                    <div className="flex flex-col w-64">

                        <div className="flex flex-col h-0 flex-1 bg-gray-800">
                            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">

                                <nav className="mt-5 flex-1 px-2 bg-gray-800 space-y-1">
                                    <a href="#" className="group flex items-center px-2 py-2 text-sm leading-5 font-medium text-white rounded-md bg-gray-900 focus:outline-none focus:bg-gray-700 transition ease-in-out duration-150">

                                        <svg className="mr-3 h-6 w-6 text-gray-400 group-hover:text-gray-300 group-focus:text-gray-300 transition ease-in-out duration-150" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                        </svg>
                                        Users
                                    </a>

                                    <a href="#" className="group flex items-center px-2 py-2 text-sm leading-5 font-medium text-gray-300 rounded-md hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700 transition ease-in-out duration-150">

                                        <svg className="mr-3 h-6 w-6 text-gray-400 group-hover:text-gray-300 group-focus:text-gray-300 transition ease-in-out duration-150" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                        </svg>
                                        Demo
                                    </a>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col w-0 flex-1 overflow-hidden">
                    <div className="md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3">
                        <button className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:bg-gray-200 transition ease-in-out duration-150" aria-label="Open sidebar">

                            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                    <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none" tabIndex={0}>
                        <UserComponent></UserComponent>
                    </main>
                </div>
            </div>

        </div>
    )
}
export default Setting