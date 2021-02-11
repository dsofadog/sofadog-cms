import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import NProgress from "nprogress";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import useInfiniteScroll from 'react-infinite-scroll-hook';
import moment from 'moment'
import _ from 'lodash'

import PreviewItem from 'features/news-item/components/PreviewItem';
import PreviewItemTable from 'features/news-item/components/PreviewItemTable';
import CmsConstant from 'utils/cms-constant';
import NewsItemsHeader from 'features/news-item/components/NewsItemsHeader';
import NewsItemDialogForm from 'features/news-item/components/NewsItemDialogForm';

import NavHeader from 'component/common/NavHeader';
import tokenManager from 'utils/token-manager';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from 'rootReducer';

import {
    read as readNewsItem,
    query as queryNewsItems,
    reset as resetNewsItems,
    showNewsItemForm
} from 'features/news-item/slices/news-item.slice'
import notify from 'utils/notify';
import { usePrevious } from 'rooks';

type Params = {
    token: string;
    limit: number;
    date: string;
    tags: string;
    category: string;
    state: string;
    feed_id?: string,
    title: string;
}


const defaultPagination = {
    limit: 50,
    total_data: 0
}

const Demo = () => {


    const {
        notificationErrorMessage,
        fetchErrorMessage,
        progressBarLoading,
        scrollLoading,
        scrollLoadingMessage,
        newsItems,
        newsItemFormIsVisible: _newsItemFormIsVisible
    } = useSelector((state: RootState) => state.newsItem)

    const {feeds} = useSelector((state: RootState)=>state.feed)

    const tags = CmsConstant.Tags;
    const status = CmsConstant.Status;

    const topRef = useRef()
    const router = useRouter();
    const dispatch = useDispatch()

    const [toggleAppView, setToggleAppView] = useState(false)

    const [newsItemFormIsVisible, setNewsItemFormIsVisible] = useState<boolean>(false)
    const [selectedNewsItem, selectNewsItem] = useState<any>()
    const [searchId, setSearchId] = useState(router.query?.id)
    const [firstNewsItem, setFirstNewsItem] = useState<any>(null)
    const previousFirstNewsItem = usePrevious(firstNewsItem)

    const [params, setParams] = useState<Params>({
        token: tokenManager.getToken(),
        limit: defaultPagination.limit,
        date: moment.utc().format("YYYY-MM-DD"),
        tags: '',
        category: null,
        state: '',
        feed_id: null,
        title: ''
    })
    const infiniteRef = useInfiniteScroll({
        loading: scrollLoading,
        hasNextPage: true,
        onLoadMore: () => {
            console.log('in onLoadMore')
            setParams({
                ...params,
                token: tokenManager.getToken(),
                date: (params.token ? moment.utc(params.date).subtract(1, 'day') : moment.utc(params.date)).format('YYYY-MM-DD')
            })
        },
        scrollContainer: 'window',
    });


    useEffect(() => {
        dispatch(resetNewsItems())
        console.log('router.query', router.query)
        // fetchItems();
        // getFeeds();
        // console.log(momentTimezone())
    }, []);

    useEffect(() => {
        if (!_newsItemFormIsVisible) {
            setTimeout(() => {
                selectNewsItem(null)
                setNewsItemFormIsVisible(false)
            }, 500)
        } else {
            setNewsItemFormIsVisible(true)
        }
    }, [_newsItemFormIsVisible])

    useEffect(()=>{
        setFirstNewsItem(newsItems[0] || null)
    }, [newsItems])

    useEffect(()=>{
        const delayScroll = ()=>{
            if(firstNewsItem){
                if(previousFirstNewsItem && previousFirstNewsItem.id !== firstNewsItem.id){
                    setTimeout(()=>{
                        scrollToTop()
                    }, 1000)
                }
            }
        }
       
        delayScroll()
    }, [firstNewsItem])

    useEffect(() => {
        if (progressBarLoading) {
            NProgress.start()
        } else {
            NProgress.done()
        }
    }, [progressBarLoading])

    useEffect(() => {
        console.log('params updated')
        if (params.token && !searchId) {
            console.log('params updated', params.token)
            fetchItems()
        }
    }, [params])

    useEffect(() => {
        if (searchId) {
            fetchItem()
        }
    }, [searchId])

    useEffect(() => {
        if (router.query.id) {
            setSearchId(router.query.id)
        }
    }, [router.query.id])

    useEffect(() => {
        if (notificationErrorMessage) {
            notify('danger', notificationErrorMessage)
        }
    }, [notificationErrorMessage])

    const fetchItems = async () => {
        if (!fetchErrorMessage) {
            dispatch(queryNewsItems(params))
        }
    }

    const fetchItem = async () => {
        if (!fetchErrorMessage) {
            dispatch(readNewsItem(searchId))
        }
    }

    const scrollToTop = () => {
        (topRef as any).current.scrollIntoView({
            behavior: 'smooth'
        })
    };

    return (
        <>
            <div className="flex flex-col h-full h-screen bg-gray-50">
                <NavHeader />
                <NewsItemsHeader
                    params={params}
                    onSubmitParams={(newParams) => {
                        setSearchId(null)
                        dispatch(resetNewsItems())
                        console.log('onSubmitParams', newParams)
                        setParams(newParams)
                    }}
                    onRefresh={(title) => {
                        dispatch(resetNewsItems())
                        if (searchId) {
                            fetchItem()
                        } else {
                            setParams({
                                ...params,
                                title,
                                date: moment.utc().format("YYYY-MM-DD")
                            })
                        }
                    }}
                    onNewClicked={() => {
                        dispatch(showNewsItemForm())
                    }}
                    viewMode={toggleAppView ? 'table' : 'list'}
                    onViewModeChange={(viewMode) => {
                        setToggleAppView(viewMode === 'table')
                    }}
                />

                <div className="flex-1 overflow-y-auto">
                    {newsItemFormIsVisible && (
                        <NewsItemDialogForm newsItem={selectedNewsItem} />
                    )}

                    <div ref={infiniteRef as React.RefObject<HTMLDivElement>} className="max-w-7xl mx-auto">
                        <div ref={topRef}></div>
                        
                        <div className={`${toggleAppView ? 'flex flex-col' : 'hidden'}`}>
                            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8 mt-5">
                                <div style={{ minHeight: '30rem' }} className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                                    <div className="shadow border-b border-gray-200 sm:rounded-lg">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th scope="col" className="pl-6 pt-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1">
                                                        Or.
                                                    </th>
                                                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-5/12">
                                                        News
                                                    </th>
                                                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Status
                                                    </th>
                                                    <th scope="col" className="pl-3 pr-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Action
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {newsItems.map(item => (
                                                    <PreviewItemTable
                                                        onEdit={() => {
                                                            selectNewsItem(item)
                                                            dispatch(showNewsItemForm())
                                                        }}
                                                        key={item.id}
                                                        newsItem={item}
                                                    />

                                                ))}

                                            </tbody>
                                        </table>
                                    </div>
                                    {scrollLoading && (

                                        <div className="box-border p-4">
                                            <div className="flex flex-row justify-center items-center">
                                                <FontAwesomeIcon className="w-12 h-12 p-2 rounded-full" icon={['fas', 'spinner']} spin />
                                                <p>{scrollLoadingMessage}</p>
                                            </div>

                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>



                        <div className={`${!toggleAppView ? 'flex flex-col' : 'hidden'}`}>

                            {newsItems?.map(item => (
                                <div key={item.id}>
                                    <PreviewItem
                                        newsItem={item}
                                        onEdit={() => {
                                            selectNewsItem(item)
                                            dispatch(showNewsItemForm())
                                        }}
                                    />
                                </div>
                            ))}
                            {scrollLoading && (

                                <div className="box-border p-4">
                                    <div className="flex flex-row justify-center items-center">
                                        <FontAwesomeIcon className="w-12 h-12 p-2 rounded-full" icon={['fas', 'spinner']} spin />
                                        <p>{scrollLoadingMessage}</p>
                                    </div>

                                </div>
                            )}
                        </div>
                    </div>

                    {fetchErrorMessage && (
                        <div className="box-border p-4">
                            <div className="flex flex-row justify-center items-center">
                                <FontAwesomeIcon className="w-12 h-12 p-2 rounded-full" icon={['fas', 'exclamation-circle']} />
                                <p style={{width: '600px', overflowWrap: 'break-word'}}>{fetchErrorMessage}</p>
                            </div>
                            <div className="flex flex-row justify-center items-center">
                                <button type="button" onClick={() => {
                                    dispatch(resetNewsItems())
                                    if (searchId) {
                                        dispatch(readNewsItem(searchId))
                                    } else {
                                        setParams({
                                            ...params,
                                            date: moment.utc().format("YYYY-MM-DD")
                                        })
                                    }
                                }} className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Retry</button>
                            </div>


                        </div>
                    )}
                </div>

                {
                    !scrollLoading && newsItems && (
                        <div className="fixed bottom-0 right-0 mb-4 mr-4 z-50 cursor-pointer">
                            <FontAwesomeIcon onClick={(e) => scrollToTop()} className="w-12 h-12 p-2 rounded-full cursor-pointer text-white bg-blue-500 hover:bg-blue-600" icon={['fas', 'arrow-up']} />
                        </div>
                    )
                }



            </div >
        </>
    )
}

Demo.getInitialProps = async ({ query }) => {
    const id = query.id

    return {
        id: id,
    }
}

export default Demo