import React, { useState, useEffect } from 'react';
import Link from "next/link";
import HttpCms from '../../utils/http-cms';
import CreateItem from '../../component/cms/CreateItem';
import PreviewItem from '../../component/cms/PreviewItem';

const Demo = () => {

    const [paginationData, setPaginationData] = useState(
        {
            limit: 50,
            last_id: "",
            total_data: 0
        }
    );

    const [isCreate, setIsCreate] = useState(false);

    const [newsItems, setNewsItems] = useState(null);

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = () => {
        let url = `news_items?token=abcdef&limit=${paginationData.limit}`;
        if (paginationData.last_id != "") {
            url += `&last_id=${paginationData.last_id}`;
        }
        HttpCms.get(url)
            .then(response => {
                setNewsItems(response.data);
                setPaginationData({
                    ...paginationData,
                    total_data: response.data.total_items
                });
                //console.log(response.data, "response.data.data");
            })
            .catch(e => {
                console.log(e);
            });
    }

    function deleteItem(item) {
        HttpCms.delete("/news_items/" + item.id + "?token=abcdef")
            .then((response: any) => {
                console.log(response);
                if (response.data.success == true) {
                    //console.log(response, "onssdsdas");
                    transformNewItems(item, "delete");
                }
                //fetchData1();

            })
            .catch((e) => {
                console.log(e);
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
        HttpCms.post("/news_items/" + data.id + "/" + apiCallEndPoint + "?token=abcdef", {})
            .then((response) => {
                fetchItems();
            })
            .catch((e) => {
                console.log(e);
            });

    }

    function uplaodVideo(item, apiEndPoint, video) {
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
            });
    }

    function decrement_increment_ordinal(item, apiEndPoint){
		HttpCms.post("/news_items/" + item.id + "/" + apiEndPoint + "?token=abcdef", {})
			.then((response:any) => {
				console.log(response);
				if(response.data.success==true){
					console.log(response,"onssdsdas");
					transformNewItems(item,apiEndPoint);
				}
			})
			.catch((e) => {
				console.log(e);
			});
	}

    return (
        <div className="w-full h-full bg-gray-500">
            <nav className="bg-gray-800 sticky top-0 z-30">
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
                        <div className="flex items-center space-x-2">
                            <div className="">
                                <button onClick={() => fetchItems()} className="relative inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-500 hover:bg-indigo-400 focus:outline-none focus:shadow-outline-indigo focus:border-indigo-600 active:bg-indigo-600 transition duration-150 ease-in-out">
                                    Refresh
                                </button>
                            </div>

                            <div className="flex-shrink-0">
                                <span className="rounded-md shadow-sm">
                                    <button onClick={() => openCreateBox(true)} type="button" className="relative inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-500 hover:bg-indigo-400 focus:outline-none focus:shadow-outline-indigo focus:border-indigo-600 active:bg-indigo-600 transition duration-150 ease-in-out">

                                        <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                                        </svg>
                                        <span>New Item</span>
                                    </button>
                                </span>
                            </div>


                        </div>
                    </div>
                </div>
            </nav>
            <div className="max-w-7xl mx-auto">
                <div className="w-full mx-auto">
                    <div className="flex flex-no-wrap justify-center">
                        <div className="w-1/12 mx-auto flex-none float-left">
                            <div className="bg-purple-700 p-1 h-16 w-1 mx-auto"></div>
                        </div>
                    </div>
                    <div className="flex flex-no-wrap justify-center">
                        <div className="w-2/5 mx-auto flex-none float-left">
                            <div className="md:flex shadow-lg mx-6 md:mx-auto w-full h-16">
                                <div className="w-full flex items-center px-4 bg-white rounded-lg">
                                    <div className="flex items-center w-full">
                                        <form className="sm:flex w-full" aria-labelledby="newsletter-headline">
                                            <input aria-label="search box" type="text" required className="appearance-none w-full px-3 py-3 border border-gray-300 text-base leading-6 rounded-md text-gray-900 bg-gray-100 placeholder-gray-500 focus:outline-none focus:shadow-outline focus:border-blue-300 transition duration-150 ease-in-out sm:max-w-xs" placeholder="Search by title" />
                                            <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3 sm:flex-shrink-0">
                                                <button className="w-full flex items-center justify-center px-12 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:shadow-outline transition duration-150 ease-in-out">
                                                    Search
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <>
                    {isCreate && (
                        <CreateItem close={openCreateBox} />
                    )}
                </>

                <>
                    {newsItems?.news_items.map((item, i) => (
                        <PreviewItem 
                            index={i} 
                            totalData={paginationData?.total_data} 
                            item={item} 
                            processedData={processedData} 
                            uplaodVideo={uplaodVideo} 
                            deleteItem={deleteItem} 
                            move={decrement_increment_ordinal}
                        />
                    ))}
                </>
            </div>
        </div>
    )
}

export default Demo