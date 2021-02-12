import Link from "next/link"

import HeaderProfileComponent from "./HeaderProfileComponent"
import NotificationBell from "./NotificationBell"
import { useRouter } from "next/router"
import { useEffect, useState, useContext } from "react"
import { useSelector } from "react-redux"
import { RootState } from "rootReducer"
import { AccessControlContext } from "contexts"

enum Route {
    NewsItems = 'news-items',
    StockVideos = 'stock-videos'
}
const NavHeader = () => {

    const router = useRouter()
    const { hasRole } = useContext(AccessControlContext)

    const [route, setRoute] = useState<Route>(Route.NewsItems)
    const [menuVisibility, setMenuVisibility] = useState<boolean>(false)

    useEffect(() => {
        if (router.pathname === '/cms') {
            setRoute(Route.NewsItems)
        }
        if (router.pathname === '/cms/stock-videos') {
            setRoute(Route.StockVideos)
        }
    }, [router.pathname])

    return (
        <nav className="sfd-nav bg-gray-800 sticky top-0 z-30 border-b border-gray-500 border-opacity-25">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <div className="-ml-2 mr-2 flex items-center md:hidden">
                            <div className="relative">

                                <button
                                    onClick={() => setMenuVisibility(!menuVisibility)}
                                    type="button" className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:bg-gray-700 focus:text-white transition duration-150 ease-in-out" aria-label="Main menu" aria-expanded="false">
                                    <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                    <svg className="hidden h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                                {menuVisibility && <div className="block md:hidden absolute z-10 left-0 transform -translate-x-0 -translate-y-1 mt-3 px-2 w-screen max-w-xs sm:px-0">
                                    <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden">
                                        <div className="relative grid gap-6 bg-white px-5 py-6 sm:gap-8 sm:p-8">
                                            <Link href="/cms" >
                                                <a className={(route === Route.NewsItems ? 'bg-purple-900 text-white' : 'text-gray-600 ') + ' px-3 py-2 rounded-md text-sm font-medium'}>News Items</a>
                                            </Link>

                                            {(hasRole('video_editor') || hasRole('lead_video_editor') || hasRole('super_admin')) && <Link href="/cms/stock-videos" >
                                                <a className={(route === Route.StockVideos ? 'bg-purple-900 text-white' : 'text-gray-600 ') + ' px-3 py-2 rounded-md text-sm font-medium'}>Stock Video Storage</a>
                                            </Link>}
                                        </div>
                                    </div>
                                </div>
                                }
                            </div>

                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="flex-shrink-0 flex items-center space-x-2 mr-5">
                                <a href="/cms">
                                    <img className="h-8 w-auto cursor-pointer" src="/color-logo.png" alt="So.Fa.Dog" />
                                </a>
                                <a href="/cms">
                                    <img className="h-4 w-auto cursor-pointer" src="/logo-title-white.png" alt="So.Fa.Dog" />
                                </a>
                            </div>

                            <div className="space-x-4 hidden md:block">
                                <Link href="/cms" >
                                    <a className={(route === Route.NewsItems ? 'bg-gray-900 text-white' : 'text-gray-300') + ' px-3 py-2 rounded-md text-sm font-medium'}>News Items</a>
                                </Link>

                                {(hasRole('video_editor') || hasRole('lead_video_editor') || hasRole('super_admin')) && <Link href="/cms/stock-videos" >
                                    <a className={(route === Route.StockVideos ? 'bg-gray-900 text-white' : 'text-gray-300') + ' px-3 py-2 rounded-md text-sm font-medium'}>Stock Video Storage</a>
                                </Link>}
                            </div>
                        </div>

                    </div>
                    <div className="flex items-center space-x-2">
                        <HeaderProfileComponent />
                        <NotificationBell />
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default NavHeader