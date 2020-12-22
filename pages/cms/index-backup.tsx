import React, { useState, useEffect, useContext, useRef, useCallback } from 'react';
import { useRouter } from 'next/router';
import NProgress from "nprogress";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { scroller } from "react-scroll";
import useInfiniteScroll from 'react-infinite-scroll-hook';
import moment from 'moment'
import _ from 'lodash'

import CreateItem from 'component/cms/CreateItem';
import PreviewItem from 'component/cms/PreviewItem';
import PreviewItemTable from 'component/cms/PreviewItemTable';
import CmsConstant from 'utils/cms-constant';
import HttpCms from 'utils/http-cms';
import NewsItemsHeader from 'component/cms/NewsItemsHeader';
import NavHeader from 'component/common/NavHeader';
import tokenManager from 'utils/token-manager';

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

    //const categories = CmsConstant.Category; 
    const tags = CmsConstant.Tags;
    const status = CmsConstant.Status;

    const router = useRouter();

    const [toggleAppView, setToggleAppView] = useState(false)
    const [paginationData, setPaginationData] = useState(
        {
            limit: 200,
            total_data: 0
        }
    );

    const [searchId, setSearchId] = useState(router.query?.id)
    const [fetchItemsFailed, setFetchItemsFailed] = useState(false)
    const [isCreate, setIsCreate] = useState(false);
    const [newsItems, setNewsItems] = useState(null);
    const [feeds, setFeeds] = useState(null);


    const [scrollLoading, setScrollLoading] = useState(false);
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
        console.log('router.query', router.query)
        // fetchItems();
        getFeeds();
        // console.log(momentTimezone())
    }, []);

    useEffect(() => {
        if (params.token && !searchId) {
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


    const returnUrlForNewItems = (dataUrlObj) => {
        // let url = `news_items?token=abcdef&limit=${paginationData.limit}&date=${getCurrentDate("-")}`;
        let apiUrl = "news_items?";
        Object.keys(dataUrlObj).forEach(key => {
            if (dataUrlObj[key] != "" && (dataUrlObj[key] != null && dataUrlObj[key] != undefined
            )) {
                apiUrl += key + "=" + dataUrlObj[key] + "&";
            }
        });
        apiUrl = apiUrl.slice(0, -1)

        return apiUrl;
    }

    const fetchItems = async () => {

        if (!fetchItemsFailed) {
            setScrollLoading(true);

            let url = returnUrlForNewItems(params);

            try {
                const res = await HttpCms.get(url)
                if (res.data.news_items.length > 0) {
                    if (newsItems) {
                        const tempNewsitems = { ...newsItems };
                        res.data.news_items.map((data, i) => {
                            tempNewsitems.news_items.push(data);
                        });
                        setNewsItems(tempNewsitems);
                    } else {
                        setNewsItems(res.data);
                    }
                }
                setPaginationData({
                    ...paginationData,
                    total_data: res.data.total_items
                });
            } catch (err) {
                console.log('err', err);
                setFetchItemsFailed(true)
            } finally {
                setScrollLoading(false)
            }
        }

    }

    const fetchItem = async () => {

        let url = returnUrlForNewItems(params);
        // setLoading(true);
        HttpCms.get(tokenManager.attachToken(`/news_items/${searchId}`))
            .then(response => {
                setNewsItems(response?.data);
                // setLoading(false);
            })
            .catch(e => {
                console.log(e);
                // setLoading(false);
            });
    }


    function deleteItem(item) {
        NProgress.start()
        HttpCms.delete(tokenManager.attachToken(`/news_items/${item.id}`))
            .then((response: any) => {

                if (response.data.success == true) {
                    //console.log(response, "onssdsdas");
                    transformNewItems(item, "delete");
                }
            })
            .catch((e) => {
                console.log(e);
            })
            .finally(() => {
                NProgress.done()
            });
    }

    function transformNewItems(itemValue, actionType) {
        let arr = { "news_items": [] };
        let old_index, new_index;

        switch (actionType) {
            case "delete":
                arr.news_items = newsItems.news_items.filter(item => item.id != itemValue.id);
                setNewsItems(arr);
                break;
            case "decrement_ordinal":
                old_index = newsItems.news_items.findIndex(item => item.id == itemValue.id);
                new_index = old_index + 1;
                arr.news_items = array_move(newsItems.news_items, old_index, new_index);
                setNewsItems(arr);
                break;

            case "increment_ordinal":
                old_index = newsItems.news_items.findIndex(item => item.id == itemValue.id);
                new_index = old_index - 1;
                arr.news_items = array_move(newsItems.news_items, old_index, new_index);
                setNewsItems(arr);
                break;
            case "filter_by_state":
                let dataAll = newsItems?.news_items.filter(item => item.state == itemValue.name);
                arr.news_items = dataAll;
                break;
            case "overide_index":
                console.log(newsItems.news_items);
                console.log(itemValue);
                const clonedNewsItems = [...newsItems.news_items]
                old_index = clonedNewsItems.findIndex(item => item.id == itemValue.id);

                clonedNewsItems[old_index] = itemValue
                // newsItems.news_items[old_index] = itemValue;
                const clonedNewsItemsWrapper = {...newsItems, news_items: clonedNewsItems}
                setNewsItems(clonedNewsItemsWrapper);
                break;
            default:
            // code block
        }

    }

    function array_move(arr, old_index, new_index) {

        if (new_index >= arr.length) {
            var k = new_index - arr.length + 1;
            while (k--) {
                arr.push(undefined);
            }
        }
        arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);

        return arr; // for testing
    };

    function openCreateBox(flag) {
        setIsCreate(flag);
    }

    function processedData(data, apiCallEndPoint) {
        NProgress.start()
        HttpCms.post(tokenManager.attachToken(`/news_items/${data.id}/${apiCallEndPoint}`), {})
            .then((response) => {
                //fetchItems();
                //  const event = new Event('build');
                // setNewsItems(null);
                // refreshData(event);
                transformNewItems(response.data.news_item, "overide_index")
            })
            .catch((e) => {
                console.log(e);
            })
            .finally(() => {
                NProgress.done()
            });

    }

    function uplaodVideo(item, apiEndPoint, video) {
        NProgress.start()
        const formData = new FormData();
        formData.append("source_file", video.video_file);
        const config = {
            headers: {
                'content-type': 'multipart/form-data',
                'Accept': 'multipart/form-data',
            }
        };

        HttpCms.post(tokenManager.attachToken(`/news_items/${item.id}/${apiEndPoint}`), formData, config)
            .then((response) => {

                let index = newsItems.news_items.findIndex(x => x.id === item.id);
                const n = { ...newsItems }
                n.news_items[index] = response.data.news_item;
                setNewsItems(n);
                // fetchItems();
            })
            .catch((e) => {
                console.log(e);
            })
            .finally(() => {
                NProgress.done()
            });
    }

    function decrement_increment_ordinal(item, apiEndPoint) {
        NProgress.start()
        HttpCms.post(tokenManager.attachToken(`/news_items/${item.id}/${apiEndPoint}`), {})
            .then((response: any) => {

                if (response.data.success == true) {

                    transformNewItems(item, apiEndPoint);
                }
            })
            .catch((e) => {
                console.log(e);
            })
            .finally(() => {
                NProgress.done()
            });
    }

    function createNewItem(newItem) {

        NProgress.start()
        HttpCms.post(tokenManager.attachToken(`/news_items`), newItem)
            .then((response) => {
                //console.log("add item: ",response.data);
                const item = { ...newsItems };
                item.news_items.unshift(response.data.news_item);
                setNewsItems(item);
                setIsCreate(false);
                //fetchItems();
            })
            .catch((e) => {
                console.log(e);
            })
            .finally(() => {
                NProgress.done()
            });
    }

    function updateItem(id, item, index) {
        NProgress.start()
        HttpCms.patch(tokenManager.attachToken(`/news_items/${id}`), item)
            .then((response) => {

                if (response.status === 200) {
                    const item = { ...newsItems };
                    item.news_items[index] = response.data.news_item;
                    setNewsItems(item);
                }
            })
            .catch((e) => {
                console.log(e);
            })
            .finally(() => {
                NProgress.done()
            });
    }

    const scrollToSection = () => {
        scroller.scrollTo("sfd-top", {
            duration: 800,
            delay: 0,
            smooth: "easeInOutQuart",
        });
    };

    function getFeeds() {

        //setLoading(true);
        HttpCms.get(tokenManager.attachToken(`/feeds`))
            .then((response) => {
                console.log("response: ", response.data);
                setFeeds(response.data.feeds)
            })
            .catch((e) => {
                console.log(e);
            })
            .finally(() => {
                // setLoading(false);
            });

    }



    async function singleItem(item_id) {
        try{
            NProgress.start()
            // setLoading(true);
            const res = await HttpCms.get(tokenManager.attachToken(`/news_items/${item_id}`))
            console.log("response.data.news_item: ", res.data.news_items)
            let index = newsItems.news_items.findIndex(x => x.id === item_id);
            const n = { ...newsItems }
            n.news_items[index] = res.data.news_items[0];
            setNewsItems(n);
            // setItem(response.data.news_items[0]);
            // console.log(response.data.news_items[0], "response.data.data");
            // setLoading(false);
        }catch(err){
            console.log(err)
        }finally {
            // setLoading(false);
            NProgress.done()
        }
       
    }




    return (
        <div className="flex flex-col h-full h-screen bg-gray-100">
            <NavHeader />
            <NewsItemsHeader
                params={params}
                feeds={feeds}
                onSubmitParams={(newParams) => {
                    setSearchId(null)
                    setFetchItemsFailed(false)
                    setNewsItems(null)
                    setParams(newParams)
                }}
                onRefresh={(title) => {
                    setFetchItemsFailed(false)
                    setNewsItems(null)
                    if(searchId){
                        fetchItem()
                    }else{
                        setParams({
                            ...params,
                            title,
                            date: moment.utc().format("YYYY-MM-DD")
                        })
                    }
                    
                }}
                onNewClicked={() => {
                    openCreateBox(true);
                    scrollToSection();
                }}
                viewMode={toggleAppView ? 'table' : 'list'}
                onViewModeChange={(viewMode) => {
                    setToggleAppView(viewMode === 'table')
                }}
            />

            <div className="flex-1 overflow-y-auto">
                <div ref={infiniteRef as React.RefObject<HTMLDivElement>} className="max-w-7xl mx-auto">
                    <>
                        <div className="sfd-top invisible"></div>
                    </>
                    <>
                        {isCreate && (
                            <CreateItem state="new" close={openCreateBox} create={createNewItem} />
                        )}
                    </>
                    <>

                        <div className={`${toggleAppView ? 'flex flex-col' : 'hidden'}`}>
                            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8 mt-5">
                                <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                                    <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead>
                                                <tr>
                                                    <th scope="col" className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Ordinal Sr
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Title
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Tag
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        state
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Submitted by
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Action
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {newsItems?.news_items.map((item, i) => (
                                                    <PreviewItemTable
                                                        key={item.id}
                                                        index={i}
                                                        showComment={true}
                                                        totalData={paginationData?.total_data}
                                                        item={item}
                                                        processedData={processedData}
                                                        uplaodVideo={uplaodVideo}
                                                        deleteItem={deleteItem}
                                                        move={decrement_increment_ordinal}
                                                        updateItem={updateItem}
                                                        getSigleItem={singleItem}
                                                        feeds={feeds}
                                                    />

                                                ))}

                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </>


                    <div className={`${!toggleAppView ? 'flex flex-col' : 'hidden'}`}>
                        {newsItems?.news_items.map((item, i) => (
                            <div key={i}>
                                <PreviewItem
                                    key={item.id}
                                    index={i}
                                    showComment={true}
                                    totalData={paginationData?.total_data}
                                    item={item}
                                    processedData={processedData}
                                    uplaodVideo={uplaodVideo}
                                    deleteItem={deleteItem}
                                    move={decrement_increment_ordinal}
                                    updateItem={updateItem}
                                    getSigleItem={singleItem}
                                    feeds={feeds}
                                />
                            </div>
                        ))}
                    </div>



                </div>

                {fetchItemsFailed && (
                    <div className="box-border p-4">
                        <div className="flex flex-row text-white justify-center items-center">
                            <FontAwesomeIcon className="w-12 h-12 p-2 rounded-full" icon={['fas', 'exclamation-circle']} />
                            <p>Something went wrong</p>
                        </div>
                        <div className="flex flex-row justify-center items-center">
                            <button type="button" onClick={() => {
                                setFetchItemsFailed(false)
                                setNewsItems(null)
                                setParams({
                                    ...params,
                                    date: moment.utc().format("YYYY-MM-DD")
                                })
                            }} className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Retry</button>
                        </div>


                    </div>
                )}
                {scrollLoading && (

                    <div className="box-border p-4">
                        <div className="flex flex-row justify-center items-center">
                            <FontAwesomeIcon className="w-12 h-12 p-2 rounded-full" icon={['fas', 'spinner']} spin />
                            <p>Loading new items from {moment(params.date).format('ll')}</p>
                        </div>

                    </div>
                )}

            </div>

            {
                !scrollLoading && newsItems && (
                    <div className="fixed bottom-0 right-0 mb-4 mr-4 z-50 cursor-pointer">
                        <FontAwesomeIcon onClick={(e) => scrollToSection()} className="w-12 h-12 p-2 rounded-full cursor-pointer text-white bg-blue-500 hover:bg-blue-600" icon={['fas', 'arrow-up']} />
                    </div>
                )
            }



        </div >
    )
}

Demo.getInitialProps = async ({ query }) => {
    const id = query.id

    return {
        id: id,
    }
}

export default Demo