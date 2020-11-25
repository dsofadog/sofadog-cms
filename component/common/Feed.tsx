import { useEffect, useRef, useState } from "react"
import { ChromePicker } from 'react-color';

import { config as f_config, library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';


f_config.autoAddCss = false;
library.add(fas, fab);

const Feed = (props) => {
    const [feed, setFeed] = useState(null);
    const [action, setAction] = useState('view');
    const [categoryAction, setCategoryAction] = useState('view');

    const pickerWrapperRef = useRef(null);
    useOutsideAlerter(pickerWrapperRef);
    const [openPicker, setOpenPicker] = useState(false);
    const [colour, setColour] = useState('#fff');
    const [category, setCategory] = useState(null);
    const [isAddCategory, setIsAddCategory] = useState(false);

    useEffect(() => {
        if (props.data) {
            setFeed(props.data);
        }
        if (props.action) {
            console.log("prop.action", props.action);
            setAction(props.action);
            if (props.action === 'add') {
                setFeed({
                    ...feed,
                    id: getRandomString(30)
                })
            }
        }
    }, [props])

    useEffect(() => {
        if (categoryAction === 'edit') {
            let i = feed.categories.findIndex(x => x.number === category.number);
            const f = { ...feed };
            f.categories[i] = category;
            setFeed(f);
        }
    }, [category])

    function useOutsideAlerter(ref) {
        useEffect(() => {
            function handleClickOutside(event) {

                if (ref.current && !ref.current.contains(event.target)) {
                    if (ref.current.dataset.id === "picker") {
                        setOpenPicker(false);
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

    function handleInputChange(e) {
        //console.log(e.target);
        e.preventDefault();
        setFeed({
            ...feed,
            [e.target.name]: e.target.value
        })
    }

    function handleCategoryInputChange(e) {
        //console.log(e.target);
        e.preventDefault();
        setCategory({
            ...category,
            [e.target.name]: e.target.value
        })
    }

    function getRandomString(length = 10) {
        var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var result = '';
        for (var i = 0; i < length; i++) {
            result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
        }
        return result;
    }

    function submitFeed(e) {
        e.preventDefault();
        props.addFeed(feed);
    }

    const handleChangeComplete = (color) => {
        console.log("hex", color.hex);
        setColour(color.hex);
        setCategory({
            ...category,
            hex: color.hex
        })
        if (categoryAction === 'edit') {
            let i = feed.categories.findIndex(x => x.number === category.number);
            const f = { ...feed };
            f.categories[i].hex = color.hex;
            setFeed(f);
        }
    };

    function manageCategory() {
        if (category) {
            if (categoryAction === 'add') {
                props.addCategory(category, feed.id);
            } else if (categoryAction === 'edit') {
                console.log("edit cat: ", category);
                props.updateCategory(category, feed.id);
                setCategoryAction('add');
            }
        }
        setCategory(null);
        setColour(null);
        setIsAddCategory(false);
    }

    function changeCategoryState(e, i, state) {
        e.preventDefault();
        if (state === 'delete') {
            props.deleteCategory(feed?.categories[i],feed.id);
            setCategoryAction('add');
        } else {
            setCategory(feed?.categories[i]);
            setColour(feed?.categories[i].hex ? feed?.categories[i].hex : feed?.categories[i].colour);
            setCategoryAction(state);
        }
    }

    return (
        <li>
            <a href={void (0)} className="block hover:bg-gray-50">
                <div className="flex items-center px-4 py-4 sm:px-6">
                    <div className="min-w-0 flex-1 flex items-center">
                        <div className="min-w-0 flex-1 px-4 md:grid md:grid-cols-3 md:gap-4">
                            <div className="block">
                                <div>
                                    <p className="text-sm text-indigo-600">
                                        Id
                                    </p>
                                    <p className="mt-2 flex items-center text-sm text-gray-500">
                                        {action === 'view' ?
                                            <span className="truncate">{feed?.id}</span>
                                            :
                                            <input name="id" value={feed?.id} onChange={(e) => handleInputChange(e)} className="form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5" />
                                        }
                                    </p>
                                </div>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-indigo-600 truncate">Name</p>
                                <p className="mt-2 flex items-center text-sm text-gray-500">
                                    {action === 'view' ?
                                        <span className="truncate">{feed?.name}</span>
                                        :
                                        <input name="name" value={feed?.name} onChange={(e) => handleInputChange(e)} className="form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5" />
                                    }
                                </p>
                            </div>
                            <div className={`${action === 'add' ? 'col-span-3' : ''}`}>
                                <p className="text-sm font-medium text-indigo-600 truncate">Description</p>
                                <p className="mt-2 flex items-center text-sm text-gray-500">
                                    {action === 'view' ?
                                        <span className="flex flex-wrap">{feed?.description}</span>
                                        :
                                        <textarea rows={3} name="description" value={feed?.description} onChange={(e) => handleInputChange(e)} className="form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5" />
                                    }
                                </p>
                            </div>
                            {action != 'add' && (
                                <div className="col-span-3 ">
                                    <p className="text-sm font-medium text-indigo-600 truncate">Cetegories</p>
                                    <div className="mt-2 w-full flex flex-wrap justify-start">
                                        {feed?.categories?.map((cat, i) => (
                                            <span className="mr-2 mb-2 relative z-0 inline-flex shadow-sm rounded">
                                                <button style={{ backgroundColor: cat.hex ? cat.hex : cat.colour, borderColor: cat.hex ? cat.hex : cat.colour }} type="button" className="relative inline-flex items-center px-3 py-1 rounded-l border text-xs font-medium text-black  focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 uppercase">
                                                    {cat.number}.{cat.title}
                                                </button>
                                                <button style={{ borderColor: cat.hex ? cat.hex : cat.colour }} type="button" className="-ml-px space-x-1 relative inline-flex items-center px-2 py-1 rounded-r border  bg-white text-xs font-medium text-gray-700 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500">
                                                    <FontAwesomeIcon onClick={(e) => { changeCategoryState(e, i, 'edit'); setIsAddCategory(true) }} className="w-4 h-4 cursor-pointer hover:text-blue-600" icon={['fas', 'edit']} />
                                                    <FontAwesomeIcon onClick={(e) => changeCategoryState(e, i, 'delete')} className="w-3.5 h-3.5 cursor-pointer hover:text-red-800" icon={['fas', 'trash-alt']} />
                                                </button>
                                            </span>

                                        ))}
                                    </div>
                                    <div className="grid grid-cols-4 gap-4">
                                        {isAddCategory ?
                                            <>
                                                <div>
                                                    <label className="text-sm font-medium">Number</label>
                                                    <input type="number" min="0" value={category?.number} onChange={(e) => handleCategoryInputChange(e)} name="number" className="form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5" />
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium">Title</label>
                                                    <input value={category?.title} onChange={(e) => handleCategoryInputChange(e)} name="title" className="form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5" />
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium">Colour</label>
                                                    <input value={category?.colour} onChange={(e) => handleCategoryInputChange(e)} name="colour" className="form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5" />
                                                </div>
                                                <div ref={pickerWrapperRef} data-id="picker" className="relative inline-block">
                                                    <label className="text-sm font-medium">Hex</label>
                                                    <input value={category?.hex} readOnly onClick={() => setOpenPicker(true)} name="id" className="form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5" />
                                                    {openPicker && (
                                                        <div className="origin-top-right absolute right-0 mt-2 w-auto rounded-md shadow-lg z-50">
                                                            <ChromePicker color={colour} onChangeComplete={handleChangeComplete} />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="col-span-4 flex space-x-2">
                                                    <button onClick={() => manageCategory()} className="text-white px-2 py-1 bg-green-600 hover:bg-green-700 rounded text-xs">{categoryAction === 'edit' ? 'Update' : 'Add'}</button>
                                                    <button onClick={() => { setIsAddCategory(false); setCategory(null); setCategoryAction('add'); }} className="text-white px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs">Cancel</button>
                                                </div>
                                            </>
                                            :
                                            <div className="col-span-4 flex space-x-2">
                                                <button onClick={() => setIsAddCategory(true)} className="mt-2 w-auto text-white px-2 py-1 bg-indigo-600 hover:bg-indigo-700 rounded text-xs">+ Add Category</button>
                                            </div>
                                        }
                                    </div>
                                </div>
                            )}
                            {action === 'add' && (
                                <div className="flex space-x-4">
                                    <button onClick={(e) => submitFeed(e)} className="bg-green-600 hover:bg-green-700 text-white text-sm py-1 px-2 rounded cursor-pointer">Submit</button>
                                    <button onClick={props?.callback} className="bg-blue-600 hover:bg-blue-700 text-white text-sm py-1 px-2 rounded cursor-pointer">Cancel</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </a>
        </li>

    )
}

export default Feed