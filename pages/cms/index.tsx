import React, { useState, useEffect, useContext, useRef } from 'react';
import Link from "next/link";
import Router from 'next/router';
import moment from 'moment';
import HttpCms from '../../utils/http-cms';
import CreateItem from '../../component/cms/CreateItem';
import PreviewItem from '../../component/cms/PreviewItem';
import CmsConstant from '../../utils/cms-constant';
import { LayoutContext } from '../../contexts/';
import { config as f_config, library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { scroller } from "react-scroll";
import useInfiniteScroll from 'react-infinite-scroll-hook';
import HeaderProfileComponent from '../../component/common/HeaderProfileComponent';
import NotificationBell from '../../component/common/NotificationBell';

f_config.autoAddCss = false;
library.add(fas, fab);

const Demo = () => {

    const categories = CmsConstant.Category;
    const tags = CmsConstant.Tags;
    const status = CmsConstant.Status;

    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedTag, setSelectedTag] = useState([]);
    const [selectedState, setSelectedState] = useState([]);
    const [selectedFeed, setSelectedFeed] = useState(null);

    const { setLoading, appUserInfo, currentUserPermission,
        userIsSuperAdmin,
        currentUserState,
        setCurrentUserState,
        currentUserAction
    } = useContext(LayoutContext);

    const [openCategoryDropdown, setOpenCategoryDropdown] = useState(false);
    const toggleCateDropdown = () => { setOpenCategoryDropdown(!openCategoryDropdown) };
    const [openTagDropdown, setOpenTagDropdown] = useState(false);
    const toggleTagDropdown = () => { setOpenTagDropdown(!openTagDropdown) };
    const [openStateDropdown, setOpenStateDropdown] = useState(false);
    const toggleStateDropdown = () => { setOpenStateDropdown(!openStateDropdown) };
    const [openFilterDropdown, setOpenFilterDropdown] = useState(false);
    const toggleFilterDropdown = () => { setOpenFilterDropdown(!openFilterDropdown) };
    const [openFeedDropdown, setOpenFeedDropdown] = useState(false);
    const toggleFeedDropdown = () => { setOpenFeedDropdown(!openFeedDropdown) };

    const [paginationData, setPaginationData] = useState(
        {
            limit: 200,
            total_data: 0
        }
    );

    const [isCreate, setIsCreate] = useState(false);
    const [newsItems, setNewsItems] = useState(null);
    const [newsItemsCached, setNewsItemsCached] = useState(null);
    const [search, setSearch] = useState("");
    const [feeds,setFeeds] = useState(null);

    const catWrapperRef = useRef(null);
    const tagWrapperRef = useRef(null);
    const stateWrapperRef = useRef(null);
    const filterWrapperRef = useRef(null);
    const feedWrapperRef = useRef(null);
    useOutsideAlerter(catWrapperRef);
    useOutsideAlerter(tagWrapperRef);
    useOutsideAlerter(stateWrapperRef);
    useOutsideAlerter(filterWrapperRef);
    useOutsideAlerter(feedWrapperRef);

    const [hasNextPage, setHasNextPage] = useState(true);
    const [scrollLoading, setScrollLoading] = useState(false);
    const infiniteRef = useInfiniteScroll({
        loading: scrollLoading,
        hasNextPage,
        onLoadMore: handleLoadMore,
        scrollContainer: 'window',
    });

    const [scrollCount, setScrollCount] = useState<number>(0);
    

    useEffect(() => {

        console.log(currentUserState, currentUserAction);
        logoutUserCheck();
        setNewsItems(null);
        setNewsItemsCached(null);
        setScrollCount(0);
        fetchItems();
        getFeeds();
    }, []);

    function logoutUserCheck() {

        if (appUserInfo == null) {
            //|| (appUserInfo?.token !="" && appUserInfo?.token != undefined)
            setLoading(false);

            Router.push('/');
            return false;
        }
    }

    function useOutsideAlerter(ref) {
        useEffect(() => {
            function handleClickOutside(event) {

                if (ref.current && !ref.current.contains(event.target)) {
                    if (ref.current.dataset.id === "tag") {
                        setOpenTagDropdown(false);
                    }
                    if (ref.current.dataset.id === "category") {
                        setOpenCategoryDropdown(false);
                    }
                    if (ref.current.dataset.id === "state") {
                        setOpenStateDropdown(false);
                    }
                    if (ref.current.dataset.id === "filter") {
                        setOpenFilterDropdown(false);
                    }
                    if (ref.current.dataset.id === "feed") {
                        setOpenFeedDropdown(false);
                    }
                }
            }

            // Bind the event listener
            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                // Unbind the event listener on clean up
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }, [ref]);
    }



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

    //const [myFlag,setMyFlag] = useState(true);
    let myFlag = true;
    const fetchItems = async (isLoader = true) => {

        setLoading(isLoader);

        setScrollLoading(true);
        let dataUrlObj = {
            "token": appUserInfo?.token,
            "limit": paginationData.limit,
            "date": returndateAsRequired(),
            "tags": selectedTag.join(),
            "category": selectedCategory,
            "state": selectedState.join(),
        }
        let url = returnUrlForNewItems(dataUrlObj);
        console.log(url, "url made");
        //let url = `news_items?token=abcdef&limit=${paginationData.limit}&date=${getCurrentDate("-")}`;

        await HttpCms.get(url)
            .then(response => {
                if (response.data.news_items.length > 0) {
                    if (newsItems) {
                        console.log(currentUserState, "currentUserState");
                        // if(Array.isArray(currentUserState) && currentUserState.length){
                        //     console.log(currentUserState[0]);
                        //     setSelectedState(currentUserState[0]);
                        // }
                        const item = { ...newsItems };
                        response.data.news_items.map((data, i) => {
                            item.news_items.push(data);
                        });
                        setNewsItems(item);
                        setNewsItemsCached(item);
                    } else {
                        setNewsItems(response.data);
                        setNewsItemsCached(response.data);
                    }

                    myFlag = false;
                } else {
                    //setHasNextPage(false);
                }
                setHasNextPage(true);

                setPaginationData({
                    ...paginationData,
                    total_data: response.data.total_items
                });
            })
            .catch(e => {
                console.log(e);
            })
            .finally(() => {
                if (!myFlag) {
                    setLoading(false);
                }
                setScrollLoading(false);
            });
    }

    function handleLoadMore() {
        if(selectedFeed === null){
            setScrollCount(scrollCount + 1);
            fetchItems(false);
        }
        
        // if (search.length === 0 && selectedState == null) {
        //     if (newsItems?.news_items.length > 0) {
        //         fetchItems(false);
        //     } else {
        //         fetchItems(true);
        //     }

        // }
    }

    function refreshData(e) {
        e.preventDefault();
        setSelectedCategory(null);
        setSelectedTag([]);
        setSelectedState([]);
        setNewsItems(null);
        setNewsItemsCached(null);
        setScrollCount(0);
        setSelectedFeed(null);
        if (scrollCount === 0) {
            fetchItems();
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

    function handleClickSingleDropdown(data, type) {

        if (type === 'cat') {
            setSelectedCategory(data.value);
            toggleCateDropdown();
        } else if (type === 'state') {
            setSelectedState(data);
            toggleStateDropdown();
            transformNewItems(data, 'filter_by_state')
        }

    }
    function handleClickMultiDropdown2(state) {
        if (selectedState.includes(state.name)) {
            return;
        } else {
            setSelectedState([...selectedState, state.name])
        }
        toggleStateDropdown();
    }

    function handleClickMultiDropdown(tag) {
        if (selectedTag.includes(tag.value)) {
            return;
        } else {
            setSelectedTag([...selectedTag, tag.value])
        }
        toggleTagDropdown();
    }

    function clearCategory() {
        setSelectedCategory(null);
    }
    function clearState(e) {
        e.preventDefault();
        setSelectedState(null);
        toggleStateDropdown();
    }

    function clearTag(tag) {
        setSelectedTag(selectedTag.filter(item => item !== tag));
    }

    function clearStatus(value) {
        setSelectedState(selectedState.filter(item => item !== value));
    }

    const returndateAsRequired = () => {
        console.log(scrollCount, "scrollCount");
        let today = moment().format('DD.MM.YYYY');
        let startdate = today;
        var new_date = moment(startdate, "DD-MM-YYYY");
        new_date.add(-scrollCount, 'days');
        let dateReturn = new_date.format("YYYY-MM-DD");
        return dateReturn;

    }

    const filteringCategoryTag = () => {
        setLoading(true);
        console.log(selectedState.join(), "selectedState");

        let apiUrl = "news_items?";
        let dataUrlObj = {
            "token": appUserInfo?.token,
            "limit": paginationData.limit,
            "date": selectedFeed == null ? returndateAsRequired() : '',
            "tags": selectedTag.join(),
            "category": selectedCategory,
            "state": selectedState.join(),
            "feed_id": selectedFeed,
        }
        
        let api = returnUrlForNewItems(dataUrlObj);


        HttpCms.get(api)
            .then(response => {

                setNewsItems(response.data);
                setPaginationData({
                    ...paginationData,
                    total_data: response.data.total_items
                });
                setLoading(false);

            })
            .catch(e => {
                console.log(e);
                setLoading(false);
            })
            .finally(() => {
                setLoading(false);
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
                setNewsItemsCached(arr)
                break;
            case "overide_index":
                console.log(newsItems.news_items);
                console.log(itemValue);
                old_index = newsItems.news_items.findIndex(item => item.id == itemValue.id);
                newsItems.news_items[old_index] = itemValue;
                setNewsItems(newsItems);
                //setNewsItemsCached(arr)
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
                // setNewsItemsCached(null);
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
                
                let index = newsItems.news_items.findIndex(x=> x.id===item.id);
                const n = {...newsItems}
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

    function handleChangeSearch(e) {
        setSearch(e.target.value);
    }

    useEffect(() => {

        if (search.length === 0) {
            setNewsItems(newsItemsCached);
        } else {
            let itemsToDisplay = [];
            itemsToDisplay = newsItemsCached.news_items.filter(
                item =>
                    item.title
                        .toLowerCase()
                        .includes(search.toLowerCase())
            )

            setNewsItems({
                news_items: itemsToDisplay,
                total_items: itemsToDisplay.length
            })
        }

    }, [search]);

    function isTagSelected(tag) {
        if (selectedTag.length > 0) {
            return selectedTag.includes(tag);
        }
        return false;
    }
    function isStateSelected(value) {
        if (selectedState.length > 0) {
            return selectedState.includes(value);
        }
        return false;
    }



    // function handleScroll(e) {
    //     const target = e.target;
    //     if (target.scrollHeight - target.scrollTop === target.clientHeight) {
    //         alert('at bottom!');
    //     }
    // }

    const scrollToSection = () => {
        scroller.scrollTo("sfd-top", {
            duration: 800,
            delay: 0,
            smooth: "easeInOutQuart",
        });
    };

    function showStatus(itemkey) {
        let statusReturn = '';
        status?.map((s, i) => {
            if (s.name === itemkey.name) {
                statusReturn = s.value;
            }
        });

        return statusReturn;
    }
    function getFeeds(){
       
        //setLoading(true);
        HttpCms.get("/feeds?token="+appUserInfo?.token)
        .then((response) => {
            console.log("response: ",response.data);
            setFeeds(response.data.feeds)
        })
        .catch((e) => {
            console.log(e);
        })
        .finally(() => {
            setLoading(false);
        });

    }
    function handleClickSingleDropdownFeed(feed) {
        console.log("selected feed",feed.id)
        setSelectedFeed(feed.id);
        toggleFeedDropdown();
    }

    function clearFeeds(e) {     
        e.preventDefault();   
        setSelectedFeed(null);
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
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <input id="search" value={search} onChange={(e) => handleChangeSearch(e)} className="block w-full pl-10 pr-3 py-2 border border-transparent rounded-md leading-5 bg-gray-700 text-gray-300 placeholder-gray-400 focus:outline-none focus:bg-white focus:text-gray-900 sm:text-sm transition duration-150 ease-in-out" placeholder="Search" type="search" />
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">

                            <div ref={filterWrapperRef} data-id="filter" className="relative inline-block text-left">
                                <button onClick={() => toggleFilterDropdown()} className="text-white space-x-2 relative inline-flex items-center px-2 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-500 hover:bg-indigo-400 focus:outline-none focus:shadow-outline-indigo focus:border-indigo-600 active:bg-indigo-600 transition duration-150 ease-in-out">
                                    <FontAwesomeIcon className="w-3" icon={['fas', 'filter']} />
                                    <span>Filter</span>
                                </button>
                                {openFilterDropdown && (
                                    <div className="origin-top-right absolute right-0 mt-2 w-108 rounded-md shadow-lg">
                                        <div className="w-full rounded-md bg-white shadow-xs">
                                            <div className="w-full grid grid-cols-4 gap-2 px-2 pt-2">
                                                <div className="">
                                                    <div ref={catWrapperRef} data-id="category" className="relative inline-block w-full">
                                                        <div>
                                                            {categories && (
                                                                <span onClick={toggleCateDropdown} className="rounded-md shadow-sm">
                                                                    <button type="button" className="w-full inline-flex justify-center rounded-md border border-gray-300 px-2 py-2 bg-white text-xs leading-5 font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800 transition ease-in-out duration-150" id="options-menu" aria-haspopup="true" aria-expanded="true">
                                                                        <span className="w-full truncate uppercase">
                                                                            {categories && selectedCategory ?
                                                                                categories[selectedCategory].name : 'Category'
                                                                            }
                                                                        </span>
                                                                        <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                                        </svg>
                                                                    </button>
                                                                </span>
                                                            )}
                                                        </div>
                                                        {openCategoryDropdown && (
                                                            <div className="origin-top-left absolute left-0 mt-2 w-56 rounded-md shadow-lg z-20">
                                                                <div className="rounded-md bg-white shadow-xs">
                                                                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                                                                        {categories?.map((cat, i) => (
                                                                            <a key={i} href={void (0)} onClick={() => selectedCategory === cat.value ? clearCategory() : handleClickSingleDropdown(cat, 'cat')} className={`${selectedCategory === cat.value ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 bg-white'} cursor-pointer block px-4 py-1 text-xs leading-5 focus:outline-none focus:bg-gray-100 focus:text-gray-900`} role="menuitem">
                                                                                {cat.name}
                                                                            </a>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="">
                                                    <div ref={tagWrapperRef} data-id="tag" className="relative inline-block w-full">
                                                        <div>
                                                            <span onClick={toggleTagDropdown} className="rounded-md shadow-sm">
                                                                <button type="button" className="w-full inline-flex justify-center rounded-md border border-gray-300 px-2 py-2 bg-white text-xs leading-5 font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800 transition ease-in-out duration-150" id="options-menu" aria-haspopup="true" aria-expanded="true">
                                                                    <span className="w-full truncate uppercase">
                                                                        {selectedTag.length > 0 ?
                                                                            <>
                                                                                {selectedTag.join()}
                                                                            </>
                                                                            :
                                                                            'Tags'
                                                                        }
                                                                    </span>
                                                                    <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                                    </svg>
                                                                </button>
                                                            </span>
                                                        </div>
                                                        {openTagDropdown && (
                                                            <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg">
                                                                <div className="rounded-md bg-white shadow-xs">
                                                                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                                                                        {tags?.map((tag, i) => (
                                                                            <a key={i} href={void (0)} onClick={() => isTagSelected(tag.value) ? clearTag(tag.value) : handleClickMultiDropdown(tag)} className={`${isTagSelected(tag.value) ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 bg-white'} cursor-pointer block px-4 py-1 text-xs leading-5 focus:outline-none focus:bg-gray-100 focus:text-gray-900`} role="menuitem">
                                                                                {tag.name}
                                                                            </a>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="">
                                                    <div ref={stateWrapperRef} data-id="state" className="w-full relative inline-block text-left">
                                                        <div>
                                                            {status && (
                                                                <span onClick={toggleStateDropdown} className="rounded-md shadow-sm">
                                                                    <button type="button" className="w-full inline-flex justify-center rounded-md border border-gray-300 px-2 py-2 bg-white text-xs leading-5 font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800 transition ease-in-out duration-150" id="options-menu" aria-haspopup="true" aria-expanded="true">

                                                                        <span className="w-full truncate uppercase">
                                                                            {
                                                                                selectedState.length > 0 ?
                                                                                    <>
                                                                                        {selectedState.join()}
                                                                                    </>
                                                                                    :
                                                                                    'State'
                                                                            }
                                                                        </span>
                                                                        <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                                        </svg>
                                                                    </button>
                                                                </span>
                                                            )}
                                                        </div>
                                                        {openStateDropdown && (
                                                            <div className="origin-top-left absolute left-0 mt-2 w-56 rounded-md shadow-lg z-20">
                                                                <div className="rounded-md bg-white shadow-xs">
                                                                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                                                                        {status?.map((status, i) => (
                                                                            // <a key={i} href={void (0)} onClick={(e) => selectedState?.name === status.name ? clearState(e) : handleClickMultiDropdown2(status)} className={`${selectedState?.name === status.name ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 bg-white'} cursor-pointer block px-4 py-1 text-xs leading-5 focus:outline-none focus:bg-gray-100 focus:text-gray-900 uppercase`} role="menuitem">
                                                                            //     {status.value}
                                                                            // </a>
                                                                            <a key={i} href={void (0)} onClick={() => isStateSelected(status.name) ? clearStatus(status.name) : handleClickMultiDropdown2(status)} className={`${isStateSelected(status.name) ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 bg-white'} cursor-pointer block px-4 py-1 text-xs leading-5 focus:outline-none focus:bg-gray-100 focus:text-gray-900`} role="menuitem">
                                                                                {status.value}
                                                                            </a>
                                                                        ))}
                                                                        <>
                                                                            {selectedState && (
                                                                                <div className="w-full px-2 pb-2">
                                                                                    <button onClick={(e) => clearState(e)} className="w-full text-white text-sm bg-indigo-600 hover:bg-indigo-700 rounded px-2 py-1">Clear</button>
                                                                                </div>
                                                                            )}
                                                                        </>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="">
                                                    <div ref={feedWrapperRef} data-id="feed" className="w-full relative inline-block text-left">
                                                        <div>
                                                            {status && (
                                                                <span onClick={toggleFeedDropdown} className="rounded-md shadow-sm">
                                                                    <button type="button" className="w-full inline-flex justify-center rounded-md border border-gray-300 px-2 py-2 bg-white text-xs leading-5 font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800 transition ease-in-out duration-150" id="options-menu" aria-haspopup="true" aria-expanded="true">

                                                                        <span className="w-full truncate uppercase">
                                                                            {
                                                                                selectedFeed ?
                                                                                    <>
                                                                                        {selectedFeed}
                                                                                    </>
                                                                                    :
                                                                                    'Feed'
                                                                            }
                                                                        </span>
                                                                        <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                                        </svg>
                                                                    </button>
                                                                </span>
                                                            )}
                                                        </div>
                                                        {openFeedDropdown && (
                                                            <div className="origin-top-left absolute left-0 mt-2 w-56 rounded-md shadow-lg z-20">
                                                                <div className="rounded-md bg-white shadow-xs">
                                                                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                                                                        {feeds?.map((feed, i) => (
                                                                            <a key={i} href={void (0)} onClick={() => handleClickSingleDropdownFeed(feed)} className={`${feed.id === selectedFeed ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 bg-white'} cursor-pointer block px-4 py-1 text-xs leading-5 focus:outline-none focus:bg-gray-100 focus:text-gray-900`} role="menuitem">
                                                                                {feed.name}
                                                                            </a>
                                                                        ))}
                                                                        <>
                                                                            {selectedFeed && (
                                                                                <div className="w-full px-2 pb-2">
                                                                                    <button onClick={(e) => clearFeeds(e)} className="w-full text-white text-sm bg-indigo-600 hover:bg-indigo-700 rounded px-2 py-1">Clear</button>
                                                                                </div>
                                                                            )}
                                                                        </>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="w-full p-2 space-x-2 flex">
                                                <button onClick={(e) => filteringCategoryTag()} className="text-white text-sm bg-indigo-600 hover:bg-indigo-800 rounded w-1/2 p-2">Submit</button>
                                                <button onClick={(e) => { refreshData(e); toggleFilterDropdown(); }} className="text-gray-800 text-sm border border-indigo-600 hover:bg-gray-200 rounded w-1/2 p-2">Clear</button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="">
                                <button onClick={(e) => refreshData(e)} className="relative inline-flex items-center space-x-2 px-2 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-500 hover:bg-indigo-400 focus:outline-none focus:shadow-outline-indigo focus:border-indigo-600 active:bg-indigo-600 transition duration-150 ease-in-out">
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
                            <NotificationBell />
                            <HeaderProfileComponent></HeaderProfileComponent>
                        </div>
                    </div>
                </div>
            </nav>
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
                            />
                        </div>
                    ))}


                </>
            </div>
            {!scrollLoading && newsItems && (
                <div className="fixed bottom-0 right-0 mb-4 mr-4 z-50 cursor-pointer">
                    <FontAwesomeIcon onClick={(e) => scrollToSection()} className="w-12 h-12 p-2 rounded-full cursor-pointer text-white bg-blue-500 hover:bg-blue-600" icon={['fas', 'arrow-up']} />
                </div>
            )}

        </div >
    )
}

export default Demo