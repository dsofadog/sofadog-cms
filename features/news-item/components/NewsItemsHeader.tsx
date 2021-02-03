import { useState, useEffect } from "react"

import moment from 'moment'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import Filter from "./Filter"
import tokenManager from "utils/token-manager";

type Props = {
    params: any;
    onSubmitParams: (params: any) => void;
    onRefresh: (title: string) => void;
    onNewClicked: () => void;
    onViewModeChange: (viewMode) => void;
    viewMode: 'list' | 'table'
}

const NewsItemsHeader = (props: Props) => {

    const { params, onSubmitParams, onRefresh, onNewClicked, viewMode, onViewModeChange } = props


    const [search, setSearch] = useState("");
    const [filterIsVisible, setFilterIsVisible] = useState<boolean>(false)
    const [filter, setFilter] = useState<{
        tags: string[];
        states: string[];
        feed: string;
        category?: string;
        date?: string | null;
    }>(null)

    useEffect(() => {
        if (filter !== null) {
            onSubmitParams({
                ...params,
                token: tokenManager.getToken(),
                date: filter.date ? moment.utc(filter.date).format("YYYY-MM-DD") : moment.utc().format("YYYY-MM-DD"),
                tags: filter.tags.join(),
                category: filter.category,
                state: filter.states.join(),
                feed_id: filter.feed,
                title: encodeURI(search)
            })
        }
    }, [filter])

    const toggleFilter = () => {
        setFilterIsVisible(!filterIsVisible)
    };

    const onKeyUp = (e) => {
        if (e.which === 13) {
            onSubmitParams({
                ...params,
                date: moment.utc().format("YYYY-MM-DD"),
                title: encodeURI(search)
            })
        }
    }

    return (
        <>
            <div className="relative z-10">

                <header className="bg-white shadow z-10">
                    <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 grid grid-cols-4 md:grid-cols-10 gap-4 items-center">
                        <div className="col-span-2 md:col-span-2 flex items-center">
                            <h1 className="text-2xl leading-6 font-semibold text-gray-900 ">
                                News Items
                            </h1>
                        </div>
                        <div className="col-span-2 md:col-span-4">
                            <div className="rounded-md flex">
                                <div className="relative flex items-stretch flex-grow">
                                    {/* <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                                        <FontAwesomeIcon className="w-3" icon={['fas', 'search']} />
                                    </div> */}
                                    <input
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        onKeyUp={(e) => onKeyUp(e)}
                                        className="w-full px-3 text-sm placeholder-gray-600 border border-gray-300 rounded-l-lg focus:shadow-outline" type="text" placeholder="Search" />
                                </div>
                                <button onClick={(e) => {
                                        onSubmitParams({
                                            ...params,
                                            date: moment.utc().format("YYYY-MM-DD"),
                                            title: encodeURI(search)
                                        })
                                    }} className="-ml-px relative inline-flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-r-md text-white bg-indigo-500 hover:bg-indigo-400 focus:outline-none focus:shadow-outline-indigo focus:border-indigo-600 active:bg-indigo-600">
                                        <FontAwesomeIcon className="w-3 h-3" icon={['fas', 'search']} />
                                    </button>
                            </div>
                        </div>


                        {/* <div className="mt-1 flex rounded-md shadow-sm">
                                    <div className="relative flex items-stretch flex-grow focus-within:z-10">
                                        <input id="search" value={search} onChange={(e) => setSearch(e.target.value)} className="block w-full pl-10 pr-3 py-2 border border-transparent rounded-md leading-5 bg-gray-700 text-gray-300 placeholder-gray-400 focus:outline-none focus:bg-white focus:text-gray-900 sm:text-sm transition duration-150 ease-in-out" placeholder="Search" type="search" />
                                    </div>
                                    <button onClick={(e) => {
                                        setFetchItemsFailed(false)
                                        setNewsItems(null)
                                        setParams({
                                            ...params,
                                            date: moment.utc().format("YYYY-MM-DD"),
                                            title: search
                                        })
                                    }} className="-ml-px relative inline-flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-r-md text-white bg-indigo-500 hover:bg-indigo-400 focus:outline-none focus:shadow-outline-indigo focus:border-indigo-600 active:bg-indigo-600">
                                        <span>Submit</span>
                                    </button>
                                </div> */}



                        <div className="col-span-4 md:col-span-4 pt-2 md:pt-0">
                            <div className="flex justify-center md:justify-between md:justify-end">

                                <button type="button" onClick={toggleFilter} className="btn btn-default mr-3">
                                    <FontAwesomeIcon className="w-3 h-3 md:mr-2" icon={['fas', 'filter']} />
                                    <span className="hidden md:block">Filter</span>
                                </button>


                                <button onClick={() => onRefresh(search)} type="button" className="btn btn-default mr-3">
                                    <FontAwesomeIcon className="w-3 h3 md:mr-2" icon={['fas', 'sync-alt']} />
                                    <span className="hidden md:block">Refresh</span>
                                </button>

                                <span className="relative z-0 inline-flex shadow-sm rounded-lg mr-3">
                                    <button
                                        onClick={() => {
                                            onViewModeChange('list')
                                        }}
                                        type="button"
                                        className="relative inline-flex items-center px-4 py-2 rounded-l-lg border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-100 focus:z-10 focus:outline-none disabled:opacity-50"
                                        disabled={viewMode === 'list'}
                                    >
                                        <span className="sr-only">List View</span>
                                        <FontAwesomeIcon className="w-4 h-4 fill-current" icon={['fas', 'th-list']} />
                                    </button>
                                    <button
                                        onClick={() => {
                                            onViewModeChange('table')
                                        }}
                                        type="button"
                                        className="-ml-px relative inline-flex items-center px-4 py-2 rounded-r-lg border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-100 focus:z-10 focus:outline-none disabled:opacity-50"
                                        disabled={viewMode === 'table'}
                                    >
                                        <span className="sr-only">Table View</span>
                                        <FontAwesomeIcon className="w-4 h-4 fill-current" icon={['fas', 'table']} />
                                    </button>
                                </span>

                                <button onClick={onNewClicked} type="button" className="btn btn-green">
                                    <FontAwesomeIcon className="w-3 h-3 mr-2" icon={['fas', 'plus']} />
                                    <span>New</span>
                                </button>
                            </div>
                        </div>

                    </div>
                </header>

                <div className={(filterIsVisible ? '' : 'hidden ') + 'bg-white z-10 inset-x-0 transform shadow border-t'}>

                    <Filter onSubmit={newFilter => {
                        const { category, date, ...rest } = filter || {}
                        setFilter({
                            ...rest,
                            ...newFilter
                        })
                        setFilterIsVisible(false)
                    }} />
                </div>
            </div>

        </>
    )
}

export default NewsItemsHeader