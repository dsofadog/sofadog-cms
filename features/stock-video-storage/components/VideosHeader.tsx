import { useState } from "react"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

type Props = {
    params: any;
    onSubmitParams: (params: any) => void;
    onRefresh: (title: string) => void;
    onNewClicked: () => void;
}

const VideosHeader = (props: Props) => {

    const { params, onSubmitParams, onRefresh, onNewClicked } = props


    const [search, setSearch] = useState("");

    const onKeyUp = (e) => {
        if (e.which === 13) {
            onSubmitParams({
                ...params,
                tag: encodeURI(search)
            })
        }
    }

    return (
        <>
            <div className="relative z-10">

                <header className="bg-white shadow z-10">
                    <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-10 gap-4 items-center">
                        <div className="col-span-1 md:col-span-3 flex items-center">
                            <h1 className="text-2xl leading-6 font-semibold text-gray-900 ">
                                Stock video storage
                            </h1>
                        </div>
                        <div className="col-span-1 md:col-span-4">

                            <div className="rounded-md flex">
                                <div className="relative flex items-stretch flex-grow">
                                    <input
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        onKeyUp={(e) => onKeyUp(e)}
                                        className="w-full px-3 text-sm placeholder-gray-600 border border-gray-300 rounded-l-lg focus:shadow-outline" type="text" placeholder="Search tag" />
                                    <button onClick={(e) => {
                                        onSubmitParams({
                                            ...params,
                                            tag: encodeURI(search)
                                        })
                                    }} className="-ml-px relative inline-flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-r-md text-white bg-indigo-500 hover:bg-indigo-400 focus:outline-none focus:shadow-outline-indigo focus:border-indigo-600 active:bg-indigo-600">
                                        <FontAwesomeIcon className="w-3 h-3" icon={['fas', 'search']} />
                                    </button>
                                </div>
                            </div>

                        </div>

                        <div className="col-span-2 md:col-span-3 pt-2 md:pt-0">
                            <div className="flex justify-center md:justify-end">


                                <button onClick={() => onRefresh(search)} type="button" className="btn btn-default mr-3">
                                    <FontAwesomeIcon className="w-3 mr-2" icon={['fas', 'sync-alt']} />
                                Refresh
                            </button>

                                <button onClick={onNewClicked} type="button" className="btn btn-green">
                                    <FontAwesomeIcon className="w-3 mr-2" icon={['fas', 'plus']} />
                                New
                            </button>
                            </div>
                        </div>
                    </div>
                </header>
            </div>

        </>
    )
}

export default VideosHeader