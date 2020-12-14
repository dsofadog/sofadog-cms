import { useRouter } from "next/router"

import _ from 'lodash'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import NavHeader from "component/common/NavHeader"
import Link from "next/link"
import { useContext } from "react"
import { LayoutContext } from "contexts"


type Props = {
    children: any
}

const pages = {
    'profile': {name: 'Profile', icon: 'user-circle'},
    'users': {name: 'Users', icon: 'users'},
    'feeds':  {name: 'Feeds', icon: 'rss'},
    'change-password': {name: 'Change password', icon: 'key'}
}

const Settings = (props: Props) => {

    const { children } = props

    const router = useRouter()
    const {
        currentUserPermission,
    } = useContext(LayoutContext);

    const renderLink = (page: string) => {
        const classes = router.pathname.indexOf(page) > 0
            ? 'bg-purple-50 border-purple-500 text-purple-700 hover:bg-purple-50 hover:text-purple-700 group border-l-4 px-3 py-2 flex items-center text-sm font-medium'
            : 'border-transparent text-gray-900 hover:bg-gray-50 hover:text-gray-900 group mt-1 border-l-4 px-3 py-2 flex items-center text-sm font-medium'

        return (
            <Link key={page} href={'/cms/settings/' + page}>
                <a className={classes} aria-current="page">
                    <FontAwesomeIcon className="w-4 h-4xw mr-3" icon={['fas', pages[page].icon]} />
                    <span className="truncate">
                        {pages[page].name}
                    </span>
                </a>
            </Link>
        )
    }

    const hasPermission = (page) =>{
        if(page === 'users'){
            return currentUserPermission("super_admin", "")  || currentUserPermission("user_manager", "") 
        }else if(page === 'feeds'){
            return currentUserPermission("super_admin", "")  || currentUserPermission("feed_manager", "") 
        }else{
            return true
        }
    }

    return (
        <div>
            <div className="bg-gray-800 pb-32">
                <NavHeader />
                <header className="py-10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h1 className="text-3xl font-bold text-white">
                            Settings
                        </h1>
                    </div>
                </header>
            </div>


            <main className="-mt-32">
                <div className="max-w-7xl mx-auto pb-12 px-4 sm:px-6 lg:px-8">
                    {/* Replace with your content */}
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="divide-y divide-gray-200 lg:grid lg:grid-cols-12 lg:divide-y-0 lg:divide-x">
                            <aside className="py-6 lg:col-span-3">
                                <nav>
                                    {_.keys(pages).map(page => {
                                        return hasPermission(page) && renderLink(page)
                                    })}
                                </nav>
                            </aside>

                            <div className="divide-y divide-gray-200 lg:col-span-9">
                                {children}
                            </div>
                        </div>
                    </div>
                    {/* /End replace */}
                </div>
            </main>
        </div>

    )
}
export default Settings