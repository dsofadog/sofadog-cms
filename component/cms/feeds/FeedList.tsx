import { useState, useEffect } from "react";

import _ from 'lodash'

import Loader from "component/common/Loader";
import httpCms from "utils/http-cms";
import tokenManager from "utils/token-manager";
import notify from "utils/notify";

type Props = {
    onFeedSelect: (feed: any) => void
}

const FeedList = (props: Props) => {

    const { onFeedSelect } = props

    const [loading, setLoading] = useState<boolean>(false)
    const [feeds, setFeeds] = useState(null);

    useEffect(() => {
        refresh();
    }, []);

    async function refresh() {
        try {
            setLoading(true);

            let url = tokenManager.attachToken(`feeds`)
            const res = await httpCms.get(url)

            setFeeds(_.sortBy(res.data.feeds, (feed) => {
                return _.lowerCase(feed.name)
            }));

        } catch (err) {
            notify('danger')
        } finally {
            setLoading(false);
        }

    }

    return (
        <>
            <Loader active={loading}>
                <ul className="divide-y divide-gray-200">
                    {feeds && feeds.map(feed => {
                        return (
                            <li key={feed.id}>
                                <a onClick={() => onFeedSelect(feed)} className={'cursor-pointer block hover:bg-gray-50'}>
                                    <div className="flex items-center px-4 py-4 sm:px-6">
                                        <div className="min-w-0 flex-1 flex items-center">
                                            <div className="min-w-0 flex-1 px-4">
                                                <div>
                                                    <p className={'text-sm font-medium truncate'}>{feed.name}</p>
                                                    <p className="mt-2 flex items-center text-sm text-gray-500">
                                                        <span>{feed.description}</span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            {/* Heroicon name: chevron-right */}
                                            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    </div>
                                </a>
                            </li>
                        )
                    })}
                </ul>
            </Loader>

        </>

    )
}

export default FeedList