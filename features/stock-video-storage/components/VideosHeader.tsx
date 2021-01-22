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
                tag: search
            })
        }
    }

    return (
        <>
            <div className="relative z-10">

                <header className="bg-white shadow z-10">
                    <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex items-center">
                        <h1 className="flex-1 text-2xl leading-6 font-semibold text-gray-900">
                            Stock video storage
                        </h1>
                        <div className="flex-1 mt-3 sm:mt-0 sm:ml-4 flex-grow">
                            <div className="relative w-full">
                                <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                                    <FontAwesomeIcon className="w-3" icon={['fas', 'search']} />
                                </div>
                                <input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyUp={(e) => onKeyUp(e)}
                                    className="w-full pl-8 pr-3 text-sm placeholder-gray-600 border border-gray-300 rounded-lg focus:shadow-outline" type="text" placeholder="Search tag" />
                            </div>
                        </div>
                        <div className="flex-shrink-0 mt-3 flex sm:mt-0 sm:ml-4">

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
                </header>
            </div>

        </>
    )
}

export default VideosHeader