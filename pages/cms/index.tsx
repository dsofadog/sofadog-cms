import React, { useState, useEffect, useContext, useRef, useCallback } from 'react';
import Link from "next/link";
import Router from 'next/router';

import { config as f_config, library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';

import { scroller } from "react-scroll";
import useInfiniteScroll from 'react-infinite-scroll-hook';
import moment from 'moment';
import _ from 'lodash'

import CreateItem from 'component/cms/CreateItem';
import PreviewItem from 'component/cms/PreviewItem';
import PreviewItemTable from 'component/cms/PreviewItemTable';
import HeaderProfileComponent from 'component/common/HeaderProfileComponent';
import NotificationBell from 'component/common/NotificationBell';
import { LayoutContext } from 'contexts/';
import CmsConstant from 'utils/cms-constant';
import HttpCms from 'utils/http-cms';
import Filter from 'component/cms/Filter';

f_config.autoAddCss = false;
library.add(fas, fab);

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
    limit: 200,
    total_data: 0
}

const Demo = () => {

    //const categories = CmsConstant.Category; 
    const tags = CmsConstant.Tags;
    const status = CmsConstant.Status;

    const {
        setLoading,
        appUserInfo,
        setAppUserInfo,
        currentUserPermission,
        userIsSuperAdmin,
        currentUserState,
        setCurrentUserState,
        currentUserAction,
        setSessionStorage,
        getSessionStorage,
        logoutUserCheck,
        toggleAppView,
        setToggleAppView,
    } = useContext(LayoutContext);

    const [paginationData, setPaginationData] = useState(
        {
            limit: 200,
            total_data: 0
        }
    );

    const [filter, setFilter] = useState<{
        tags: string[];
        states: string[];
        feed: string;
        category: string;
    }>({
        tags: [],
        states: [],
        feed: null,
        category: null
    })

    const [isCreate, setIsCreate] = useState(false);
    const [newsItems, setNewsItems] = useState(null);
    const [search, setSearch] = useState("");
    const [feeds, setFeeds] = useState(null);


    const [scrollLoading, setScrollLoading] = useState(false);
    const infiniteRef = useInfiniteScroll({
        loading: scrollLoading,
        hasNextPage: true,
        onLoadMore: () => {
            setParams({
                ...params,
                token: appUserInfo?.token,
                date: moment(params.date).subtract(1, 'day').format('YYYY-MM-DD')
            })
        },
        scrollContainer: 'window',
    });

    const [params, setParams] = useState<Params>({
        token: appUserInfo?.token,
        limit: defaultPagination.limit,
        date: moment().format("YYYY-MM-DD"),
        tags: filter.tags.join(),
        category: filter.category,
        state: filter.states.join(),
        feed_id: filter.feed,
        title: search
    })

    useEffect(() => {
        // console.log(currentUserState, currentUserAction);
        // logoutUserCheck();
        // fetchItems();
        getFeeds();
    }, []);


    useEffect(() => {
        console.log('filter', filter)
        setParams({
            ...params,
            token: appUserInfo?.token,
            date: moment().format("YYYY-MM-DD"),
            tags: filter.tags.join(),
            category: filter.category,
            state: filter.states.join(),
            feed_id: filter.feed
        })
    }, [filter])

    useEffect(() => {
        if (params.token) {
            fetchItems()
        }
    }, [params])


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
        } finally {
            setScrollLoading(false)
        }
    }

    function deleteItem(item) {
        setLoading(true);
        HttpCms.delete("/news_items/" + item.id + "?token=" + appUserInfo?.token)
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
                setLoading(false);
            });
    }

    const toggleAppViewChanged = () => {
        let toggleAppViewValue = !toggleAppView;
        setToggleAppView(toggleAppViewValue);
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
                old_index = newsItems.news_items.findIndex(item => item.id == itemValue.id);
                newsItems.news_items[old_index] = itemValue;
                setNewsItems(newsItems);
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
        setLoading(true);
        HttpCms.post("/news_items/" + data.id + "/" + apiCallEndPoint + "?token=" + appUserInfo?.token, {})
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
                setLoading(false);
            });

    }

    function uplaodVideo(item, apiEndPoint, video) {
        setLoading(true);
        const formData = new FormData();
        formData.append("source_file", video.video_file);
        const config = {
            headers: {
                'content-type': 'multipart/form-data',
                'Accept': 'multipart/form-data',
            }
        };

        HttpCms.post("/news_items/" + item.id + "/" + apiEndPoint + "?token=" + appUserInfo?.token, formData, config)
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
                setLoading(false);
            });
    }

    function decrement_increment_ordinal(item, apiEndPoint) {
        setLoading(true);
        HttpCms.post("/news_items/" + item.id + "/" + apiEndPoint + "?token=" + appUserInfo?.token, {})
            .then((response: any) => {

                if (response.data.success == true) {

                    transformNewItems(item, apiEndPoint);
                }
            })
            .catch((e) => {
                console.log(e);
            })
            .finally(() => {
                setLoading(false);
            });
    }

    function createNewItem(newItem) {

        setLoading(true);
        HttpCms.post("/news_items?token=" + appUserInfo?.token, newItem)
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
                setLoading(false);
            });
    }

    function updateItem(id, item, index) {
        setLoading(true);
        HttpCms.patch("/news_items/" + id + "?token=" + appUserInfo?.token, item)
            .then((response) => {

                if (response.status === 200) {
                    const item = { ...newsItems };
                    item.news_items[index] = response.data.news_item;
                    setNewsItems(item);
                }
                fetchItems();
            })
            .catch((e) => {
                console.log(e);
            })
            .finally(() => {
                setLoading(false);
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
        HttpCms.get("/feeds?token=" + appUserInfo?.token)
            .then((response) => {
                console.log("response: ", response.data);
                setFeeds(response.data.feeds)
            })
            .catch((e) => {
                console.log(e);
            })
            .finally(() => {
                setLoading(false);
            });

    }



    function singleItem(item_id) {
        setLoading(true);
        HttpCms.get(`/news_items/${item_id}?token=${appUserInfo?.token}`)
            .then(response => {
                console.log("response.data.news_item: ", response.data.news_items)
                let index = newsItems.news_items.findIndex(x => x.id === item_id);
                const n = { ...newsItems }
                n.news_items[index] = response.data.news_items[0];
                setNewsItems(n);
                // setItem(response.data.news_items[0]);
                // console.log(response.data.news_items[0], "response.data.data");
                setLoading(false);
            })
            .catch(e => {
                console.log(e);
                setLoading(false);
            });
    }




    return (
        <div className="w-full h-full min-h-screen bg-gray-500">
            <nav className="sfd-nav bg-gray-800 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="-ml-2 mr-2 flex items-center md:hidden">
                                <button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:bg-gray-700 focus:text-white transition duration-150 ease-in-out" aria-label="Main menu" aria-expanded="false">
                                    <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                    <svg className="hidden h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <div className="flex-shrink-0 flex items-center space-x-2">
                                <Link href="/cms">
                                    <img className="h-8 w-auto cursor-pointer" src="/color-logo.png" alt="So.Fa.Dog" />
                                </Link>
                                <Link href="/cms">
                                    <img className="h-4 w-auto cursor-pointer" src="/logo-title-white.png" alt="So.Fa.Dog" />
                                </Link>
                            </div>
                        </div>
                        <div className="flex-1 flex items-center justify-center px-2 space-x-2 lg:ml-6 lg:justify-end">
                            <div className="max-w-lg w-full lg:max-w-xs">
                                <label htmlFor="search" className="sr-only">Search</label>
                                <div className="mt-1 flex rounded-md shadow-sm">
                                    <div className="relative flex items-stretch flex-grow focus-within:z-10">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <input id="search" value={search} onChange={(e) => setSearch(e.target.value)} className="block w-full pl-10 pr-3 py-2 border border-transparent rounded-md leading-5 bg-gray-700 text-gray-300 placeholder-gray-400 focus:outline-none focus:bg-white focus:text-gray-900 sm:text-sm transition duration-150 ease-in-out" placeholder="Search" type="search" />
                                    </div>
                                    <button onClick={(e) => {
                                        setParams({
                                            ...params,
                                            date: moment().format("YYYY-MM-DD"),
                                            title: search
                                        })
                                    }} className="-ml-px relative inline-flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-r-md text-white bg-indigo-500 hover:bg-indigo-400 focus:outline-none focus:shadow-outline-indigo focus:border-indigo-600 active:bg-indigo-600">
                                        <span>Submit</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">

                            <Filter feeds={feeds} onSubmit={state => {
                                const { availableCategories, ...newFilter } = state
                                setNewsItems(null)
                                setFilter({
                                    ...filter,
                                    ...newFilter
                                })
                            }} />

                            <div className="">
                                <button onClick={(e) => {
                                    setNewsItems(null)
                                    setParams({
                                        ...params,
                                        date: moment().format("YYYY-MM-DD")
                                    })
                                }} className="relative inline-flex items-center space-x-2 px-2 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-500 hover:bg-indigo-400 focus:outline-none focus:shadow-outline-indigo focus:border-indigo-600 active:bg-indigo-600 transition duration-150 ease-in-out">
                                    <FontAwesomeIcon className="w-3" icon={['fas', 'sync-alt']} />
                                    <span>Refresh</span>
                                </button>
                            </div>

                            <div className="flex-shrink-0">
                                <span className="rounded-md shadow-sm">
                                    <button onClick={() => { openCreateBox(true); scrollToSection(); }} type="button" className="relative inline-flex items-center px-2 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-500 hover:bg-indigo-400 focus:outline-none focus:shadow-outline-indigo focus:border-indigo-600 active:bg-indigo-600 transition duration-150 ease-in-out">
                                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                                        </svg>
                                        <span>New Item</span>
                                    </button>
                                </span>
                            </div>
                            <div className="flex-shrink-0">
                                <span className="rounded-md shadow-sm">
                                    <button onClick={() => { toggleAppViewChanged(); }} type="button" className="relative inline-flex items-center px-2 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-500 hover:bg-indigo-400 focus:outline-none focus:shadow-outline-indigo focus:border-indigo-600 active:bg-indigo-600 transition duration-150 ease-in-out">
                                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                                        </svg>
                                        <span>List/card view</span>
                                    </button>
                                </span>
                            </div>
                            <NotificationBell />
                            <HeaderProfileComponent></HeaderProfileComponent>
                        </div>
                    </div>
                </div>
            </nav>
            <div className="container mx-auto">
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
                            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
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
                                                        Action
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {newsItems?.news_items.map((item, i) => (
                                                    <PreviewItemTable
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

                {scrollLoading && (

                    <div className="box-border p-4">
                        <div className="flex flex-row text-white justify-center items-center">
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

export default Demo