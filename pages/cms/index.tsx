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

f_config.autoAddCss = false;
library.add(fas, fab);

const Demo = () => {

    const categories = CmsConstant.Category;
    const tags = CmsConstant.Tags;
    const status = CmsConstant.Status;

    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedTag, setSelectedTag] = useState([]);
    const [selectedState, setSelectedState] = useState(null);

    const { setLoading } = useContext(LayoutContext);

    const [openCategoryDropdown, setOpenCategoryDropdown] = useState(false);
    const toggleCateDropdown = () => { setOpenCategoryDropdown(!openCategoryDropdown) };
    const [openTagDropdown, setOpenTagDropdown] = useState(false);
    const toggleTagDropdown = () => { setOpenTagDropdown(!openTagDropdown) };
    const [openStateDropdown, setOpenStateDropdown] = useState(false);
    const toggleStateDropdown = () => { setOpenStateDropdown(!openStateDropdown) };
    const [openProfileDropdown, setOpenProfileDropdown] = useState(false);
    const toggleProfileDropdown = () => { setOpenProfileDropdown(!openProfileDropdown) };

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

    const catWrapperRef = useRef(null);
    const tagWrapperRef = useRef(null);
    const stateWrapperRef = useRef(null);
    const profileWrapperRef = useRef(null);
    useOutsideAlerter(catWrapperRef);
    useOutsideAlerter(tagWrapperRef);
    useOutsideAlerter(stateWrapperRef);
    useOutsideAlerter(profileWrapperRef);

    const [hasNextPage, setHasNextPage] = useState(true);
    const [scrollLoading, setScrollLoading] = useState(false);
    const infiniteRef = useInfiniteScroll({
        loading: scrollLoading,
        hasNextPage,
        onLoadMore: handleLoadMore,
        scrollContainer: 'window',
    });

    const [scrollCount, setScrollCount] = useState(1);

    useEffect(() => {
        setNewsItems(null);
        setNewsItemsCached(null);
        setScrollCount(0);
        console.log("status: ", status);
        fetchItems();
    }, []);

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
                    if (ref.current.dataset.id === "profile") {
                        setOpenProfileDropdown(false);
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

    function getCurrentDate(separator = '') {
        console.log(scrollCount);
        let newDate = new Date()
        let date = newDate.getDate() - scrollCount;
        let month = newDate.getMonth() + 1;
        let year = newDate.getFullYear();
        return `${year}${separator}${month < 10 ? `0${month}` : `${month}`}${separator}${date}`
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


    const fetchItems = (isLoader = true) => {
        //console.log("getCurrentDate: ", getCurrentDate("-"));
        setLoading(isLoader);
        setScrollLoading(true);
        let dataUrlObj = {
            "token": "abcdef",
            "limit": paginationData.limit,
            "date": returndateAsRequired(),
            "tags": selectedTag.join(),
            "category": selectedCategory
        }
        let url = returnUrlForNewItems(dataUrlObj);
        //let url = `news_items?token=abcdef&limit=${paginationData.limit}&date=${getCurrentDate("-")}`;

        HttpCms.get(url)
            .then(response => {
                console.log("fetch res: ", response.data);
                if (response.data.news_items.length > 0) {
                    if (newsItems) {
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
                    //console.log("fetch newsItems: ",newsItems);                
                    setHasNextPage(true);
                    setScrollCount(scrollCount + 1);
                } else {
                    //setHasNextPage(false);
                }

                setPaginationData({
                    ...paginationData,
                    total_data: response.data.total_items
                });
            })
            .catch(e => {
                console.log(e);
            })
            .finally(() => {
                setLoading(false);
                setScrollLoading(false);
            });
    }

    function handleLoadMore() {
        if (search.length === 0) {
            fetchItems(false);
        }
    }

    function refreshData() {
        setSelectedCategory(null);
        setSelectedTag([]);
        setSelectedState(null);
        setNewsItems(null);
        setNewsItemsCached(null);
        setScrollCount(0);
        fetchItems();
    }

    function deleteItem(item) {
        setLoading(true);
        HttpCms.delete("/news_items/" + item.id + "?token=abcdef")
            .then((response: any) => {
                console.log(response);
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
        }

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
    function clearState() {
        setSelectedState(null);
    }

    function clearTag(tag) {
        setSelectedTag(selectedTag.filter(item => item !== tag));
    }

    function returndateAsRequired() {
        let today = moment().format('DD.MM.YYYY');
        let startdate = today;
        var new_date = moment(startdate, "DD-MM-YYYY");
        new_date.add(-scrollCount, 'days');
        let dateReturn = new_date.format("YYYY-MM-DD");
        console.log(dateReturn, "dateReturn");
        return dateReturn

    }

    function filteringCategoryTag() {
        setLoading(true);

        let apiUrl = "news_items?";
        let dataUrlObj = {
            "token": "abcdef",
            "limit": paginationData.limit,
            "date": returndateAsRequired(),
            "tags": selectedTag.join(),
            "category": selectedCategory
        }
        let api = returnUrlForNewItems(dataUrlObj);
        // let api = 'news_items';
        // let cat = '';
        // let tag = '';
        // if (selectedCategory) {
        //     cat = `category=${selectedCategory}`;
        // }
        // if (Array.isArray(selectedTag) && selectedTag.length > 0) {
        //     tag = `tags=${selectedTag.join()}`;
        // }

        // if (cat === '' && tag === '') {
        //     api += `?token=abcdef&limit=${paginationData.limit}`;
        // }
        // if (cat != '' && tag === '') {
        //     api += `?${cat}&token=abcdef&limit=${paginationData.limit}`;
        // }
        // if (cat === '' && tag != '') {
        //     api += `?${tag}&token=abcdef&limit=${paginationData.limit}`;
        // }
        // if (cat != '' && tag != '') {
        //     api += `?${cat}&${tag}&token=abcdef&limit=${paginationData.limit}`;
        // }

        HttpCms.get(api)
            .then(response => {
                //console.log("fetch res: ", response.data);
                setNewsItems(response.data);
                setPaginationData({
                    ...paginationData,
                    total_data: response.data.total_items
                });
                setLoading(false);
                //console.log(response.data, "response.data.data");
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
                let dataAll = newsItems.news_items.filter(item => item.state == itemValue.state);
                arr.news_items = dataAll;
                setNewsItems(arr);
                break;


            default:
            // code block
        }

    }

    function array_move(arr, old_index, new_index) {
        console.log(arr, old_index, new_index);
        if (new_index >= arr.length) {
            var k = new_index - arr.length + 1;
            while (k--) {
                arr.push(undefined);
            }
        }
        arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
        console.log(arr);
        return arr; // for testing
    };

    function openCreateBox(flag) {
        setIsCreate(flag);
    }

    function processedData(data, apiCallEndPoint) {
        setLoading(true);
        HttpCms.post("/news_items/" + data.id + "/" + apiCallEndPoint + "?token=abcdef", {})
            .then((response) => {
                fetchItems();
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

        HttpCms.post("/news_items/" + item.id + "/" + apiEndPoint + "?token=abcdef", formData, config)
            .then((response) => {
                fetchItems();
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
        HttpCms.post("/news_items/" + item.id + "/" + apiEndPoint + "?token=abcdef", {})
            .then((response: any) => {
                console.log(response);
                if (response.data.success == true) {
                    console.log(response, "onssdsdas");
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
        HttpCms.post("/news_items?token=abcdef", newItem)
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

    function updateItem(item) {
        setLoading(true);
        HttpCms.patch("/news_items/" + item.id + "?token=abcdef", item)
            .then((response) => {
                //console.log("add item: ",response.data);
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
        console.log(search.length);
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
            //console.log("itemsToDisplay: ", itemsToDisplay);
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

    let stateDropdownData = null;
    if (status) {
        stateDropdownData = Object.keys(status).forEach((key, i) => (
            <a key={i} href={void (0)} onClick={() => selectedState === key ? clearState() : handleClickSingleDropdown(key, 'state')} className={`${selectedState === key ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 bg-white'} cursor-pointer block px-4 py-1 text-xs leading-5 focus:outline-none focus:bg-gray-100 focus:text-gray-900`} role="menuitem">
                {status[key]}
            </a>
        ));

        console.log(stateDropdownData);
    }

    const logout = (e) => {
        e.preventDefault(); 
        Router.push('/');
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
                                <Link href="/">
                                    <img className="h-8 w-auto cursor-pointer" src="/color-logo.png" alt="So.Fa.Dog" />
                                </Link>
                                <Link href="/">
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
                            <div className="flex">
                                <div className="w-full ml-4 space-x-2 flex ">
                                    <div ref={stateWrapperRef} data-id="state" className="relative inline-block text-left">
                                        <div>
                                            {status && (
                                                <span onClick={toggleStateDropdown} className="rounded-md shadow-sm">
                                                    <button type="button" className="w-32 inline-flex justify-center rounded-md border border-gray-300 px-2 py-2 bg-white text-xs leading-5 font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800 transition ease-in-out duration-150" id="options-menu" aria-haspopup="true" aria-expanded="true">
                                                        <span className="w-full truncate uppercase">
                                                            {status && selectedState ?
                                                                status[selectedState] : 'State'
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
                                                        <>
                                                            {
                                                                stateDropdownData
                                                            }
                                                        </>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div ref={catWrapperRef} data-id="category" className="relative inline-block text-left">
                                        <div>
                                            {categories && (
                                                <span onClick={toggleCateDropdown} className="rounded-md shadow-sm">
                                                    <button type="button" className="w-32 inline-flex justify-center rounded-md border border-gray-300 px-2 py-2 bg-white text-xs leading-5 font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800 transition ease-in-out duration-150" id="options-menu" aria-haspopup="true" aria-expanded="true">
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
                                    <div className="space-x-2 flex ">
                                        <div ref={tagWrapperRef} data-id="tag" className="relative inline-block text-left">
                                            <div>
                                                <span onClick={toggleTagDropdown} className="rounded-md shadow-sm">
                                                    <button type="button" className="w-32 inline-flex justify-center rounded-md border border-gray-300 px-2 py-2 bg-white text-xs leading-5 font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800 transition ease-in-out duration-150" id="options-menu" aria-haspopup="true" aria-expanded="true">
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
                                        <button onClick={() => filteringCategoryTag()} className="text-white space-x-2 relative inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-500 hover:bg-indigo-400 focus:outline-none focus:shadow-outline-indigo focus:border-indigo-600 active:bg-indigo-600 transition duration-150 ease-in-out">
                                            <FontAwesomeIcon className="w-3" icon={['fas', 'filter']} />
                                            <span>Filter</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="">
                                <button onClick={() => refreshData()} className="relative inline-flex items-center space-x-2 px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-500 hover:bg-indigo-400 focus:outline-none focus:shadow-outline-indigo focus:border-indigo-600 active:bg-indigo-600 transition duration-150 ease-in-out">
                                    <FontAwesomeIcon className="w-3" icon={['fas', 'sync-alt']} />
                                    <span>Refresh</span>
                                </button>
                            </div>

                            <div className="flex-shrink-0">
                                <span className="rounded-md shadow-sm">
                                    <button onClick={() => { openCreateBox(true); scrollToSection(); }} type="button" className="relative inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-500 hover:bg-indigo-400 focus:outline-none focus:shadow-outline-indigo focus:border-indigo-600 active:bg-indigo-600 transition duration-150 ease-in-out">
                                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                                        </svg>
                                        <span>New Item</span>
                                    </button>
                                </span>
                            </div>
                            <div ref={profileWrapperRef} data-id="profile" className="relative inline-block text-center">
                                <span onClick={() => toggleProfileDropdown()} className="cursor-pointer inline-flex items-center justify-center h-12 w-12 rounded-full sfd-btn-primary">
                                    <span className="text-lg font-medium leading-none text-white">TK</span>
                                </span>
                                {openProfileDropdown && (
                                    <div className="origin-top-right absolute right-0 mt-2 w-24 rounded-md shadow-lg">
                                        <div className="rounded-md bg-white shadow-xs">
                                            <div className="py-1 text-left text-base" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                                                 <a href={void (0)} onClick={(e) => logout(e)} className="flex space-x-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 bg-white cursor-pointer block px-4 py-1 text-xs leading-5 focus:outline-none focus:bg-gray-100 focus:text-gray-900" role="menuitem">
                                                    <FontAwesomeIcon className="w-3" icon={['fas', 'sign-out-alt']} />
                                                    <span>Logout</span>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
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
            <div className="fixed bottom-0 right-0 mb-4 mr-4 z-50 cursor-pointer">
                <FontAwesomeIcon onClick={(e) => scrollToSection()} className="w-12 h-12 p-2 rounded-full cursor-pointer text-white bg-blue-500 hover:bg-blue-600" icon={['fas', 'arrow-up']} />
            </div>
        </div >
    )
}

export default Demo