import React, { useState, useEffect } from 'react';
import Link from "next/link";
import HttpCms from '../../utils/http-cms';
import CreateItem from '../../component/cms/CreateItem';
import PreviewItem from '../../component/cms/PreviewItem';
import CmsConstant from '../../utils/cms-constant';

const Demo = () => {
    const categories = CmsConstant.Category;
    const [openCategoryDropdown, setOpenCategoryDropdown] = useState(false);
    const toggleCateDropdown = () => { setOpenCategoryDropdown(!openCategoryDropdown) };
    const [item, setItem] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const tags = CmsConstant.Tags;
    const [selectedTag, setSelectedTag] = useState([]);

    const [openTagDropdown, setOpenTagDropdown] = useState(false);
    const toggleTagDropdown = () => { setOpenTagDropdown(!openTagDropdown) };

    const [paginationData, setPaginationData] = useState(
        {
            limit: 50,
            last_id: "",
            total_data: 0
        }
    );

    const [isCreate, setIsCreate] = useState(false);
    const [newsItems, setNewsItems] = useState(null);
    const [search,setSearch] = useState(null);

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
                console.log("fetch res: ",response.data);
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

    function handleClickSingleDropdown(cat) {       
        setItem({
            ...item,
            category: `${cat.value}`
        });
        setSelectedCategory(cat.value);
        toggleCateDropdown();
    }

    function handleClickMultiDropdown(tag) {
        //console.log(tag)
        if (selectedTag.includes(tag.value)) {
            return;
        } else {
            setSelectedTag([...selectedTag, tag.value])
            setItem({
                ...item,
                tags: selectedTag
            });
        }
        toggleTagDropdown();
    }
    function clearCategory() {
        setSelectedCategory(null);
    }
    function clearTag(tag) {       
        setSelectedTag(selectedTag.filter(item => item !== tag));
        setItem({
            ...item,
            tags: selectedTag
        });
    }

    function  filteringCategoryTag(){    
         let urlcategory= `news_items?category=${paginationData.limit}`;
         let commaseperatedTags = ''
         let urltag ='';
         if(Array.isArray(selectedTag) && selectedTag.length>0 ){
            commaseperatedTags =  selectedTag.join();
         }
         if(commaseperatedTags != ''){
            urltag= `&tags=${commaseperatedTags}`;
         }
         let url = '';
         if(urltag ==''){
             url = `${urlcategory}?token=abcdef&limit=${paginationData.limit}`; 
         }else{          
            url = `${urlcategory}${urltag}token=abcdef&limit=${paginationData.limit}`;
         }
      
        if (paginationData.last_id != "") {
            url += `&last_id=${paginationData.last_id}`;
        }
        HttpCms.get(url)
            .then(response => {
                console.log("fetch res: ",response.data);
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
    
    function createNewItem(newItem){
        //console.log("new item: ",newItem);
        HttpCms.post("/news_items?token=abcdef", newItem)
            .then((response) => {
                //console.log("add item: ",response.data);
                const item = {...newsItems};
                item.news_items.unshift(response.data.news_item);
                setIsCreate(false);
                //fetchItems();
            })
            .catch((e) => {
                console.log(e);
            });
    }

    function updateItem(item){
        HttpCms.patch("/news_items/"+item.id+"?token=abcdef", item)
            .then((response) => {
                //console.log("add item: ",response.data);
                fetchItems();
            })
            .catch((e) => {
                console.log(e);
            });
    }

    function handleChangeSearch(e){
        setSearch(e.target.value);
    }

    useEffect(()=>{
        console.log(search);
    },[search])

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

                            <div className="">
                                <button onClick={() => filteringCategoryTag()} className="relative inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-500 hover:bg-indigo-400 focus:outline-none focus:shadow-outline-indigo focus:border-indigo-600 active:bg-indigo-600 transition duration-150 ease-in-out">
                                    filter
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

                            {/* categories */}

                            <div className="absolute mb-4 mr-4 bottom-0 inset-x-0 flex">
                                <div className="w-full ml-4 space-x-2 flex ">
                                    <div className="relative inline-block text-left">
                                        <div>
                                            {categories && (
                                                <span onClick={toggleCateDropdown} className="rounded-md shadow-sm">
                                                    <button type="button" className="inline-flex justify-center w-full rounded-md border border-gray-300 px-2 py-0.5 bg-white text-xs leading-5 font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800 transition ease-in-out duration-150" id="options-menu" aria-haspopup="true" aria-expanded="true">
                                                        Choose Category
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
                                                            <a key={i} href={void (0)} onClick={() => handleClickSingleDropdown(cat)} className="cursor-pointer block px-4 py-1 text-xs leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900" role="menuitem">
                                                                {cat.name}
                                                            </a>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    {categories && (
                                        <>
                                           {item?.category && (
                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium leading-4 bg-blue-100 text-blue-800">
                                                    {categories[item?.category].name}
                                                    <button onClick={() => clearCategory()} type="button" className="flex-shrink-0 ml-1.5 inline-flex text-indigo-500 focus:outline-none focus:text-indigo-700" aria-label="Remove small badge">
                                                        <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                                                            <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
                                                        </svg>
                                                    </button>
                                                </span>
                                            )}
                                        </>

                                    )}
                                </div>                                
                            </div>


                            {/* categories */}

                            {/* tags */}

                            <div className="w-full space-x-2 flex ">
                                    <div className="relative inline-block text-left">
                                        <div>
                                            <span onClick={toggleTagDropdown} className="rounded-md shadow-sm">
                                                <button type="button" className="inline-flex justify-center w-full rounded-md border border-gray-300 px-2 py-0.5 bg-white text-xs leading-5 font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800 transition ease-in-out duration-150" id="options-menu" aria-haspopup="true" aria-expanded="true">
                                                    Tags
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
                                                            <a key={i} href={void (0)} onClick={() => handleClickMultiDropdown(tag)} className="cursor-pointer block px-4 py-1 text-xs leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900" role="menuitem">
                                                                {tag.name}
                                                            </a>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    {selectedTag?.length > 0 && (
                                        <>
                                            {selectedTag.map((tag, i) => (
                                                <span key={i} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium leading-4 bg-blue-100 text-blue-800">
                                                    {tag}
                                                    <button onClick={() => clearTag(tag)} type="button" className="flex-shrink-0 ml-1.5 inline-flex text-indigo-500 focus:outline-none focus:text-indigo-700" aria-label="Remove small badge">
                                                        <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                                                            <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
                                                        </svg>
                                                    </button>
                                                </span>
                                            ))}
                                        </>

                                    )}
                                </div>

                            {/* tags */}


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
                                            <input value={search} onChange={(e)=> handleChangeSearch(e)} aria-label="search box" type="text" required className="appearance-none w-full px-3 py-3 border border-gray-300 text-base leading-6 rounded-md text-gray-900 bg-gray-100 placeholder-gray-500 focus:outline-none focus:shadow-outline focus:border-blue-300 transition duration-150 ease-in-out sm:max-w-xs" placeholder="Search by title" />
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
                        <CreateItem state="new" close={openCreateBox} create={createNewItem}/>
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
                            updateItem={updateItem}
                        />
                    ))}
                </>
            </div>
        </div>
    )
}

export default Demo