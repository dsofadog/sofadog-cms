import { useEffect, useRef, useState } from "react"
import { ChromePicker } from 'react-color';

const Feed = (props) => {
    const [feed, setFeed] = useState(null);
    const [action, setAction] = useState('view');

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
    };

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
                                            <span style={{ backgroundColor: cat.colour }} className="inline-flex items-center px-3 py-1 mr-2 mb-2 rounded text-xs font-medium leading-4 text-black uppercase">
                                                {cat.title}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="grid grid-cols-4 gap-4">
                                        {isAddCategory ?
                                            <>
                                                <div>
                                                    <label className="text-sm font-medium">Number</label>
                                                    <input name="id" className="form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5" />
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium">Title</label>
                                                    <input name="id" className="form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5" />
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium">Colour</label>
                                                    <input name="id" className="form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5" />
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
                                                    <button className="text-white px-2 py-1 bg-green-600 hover:bg-green-700 rounded text-xs">Add</button>
                                                    <button onClick={() => { setIsAddCategory(false); setCategory(null); }} className="text-white px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs">Cancel</button>
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