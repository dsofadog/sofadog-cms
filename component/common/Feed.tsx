import { useEffect, useState } from "react"

const Feed = (props) => {
    const [feed, setFeed] = useState(null);
    const [action, setAction] = useState('view');

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
                                        <textarea rows={3} name="description" value={feed?.description} onChange={(e) => handleInputChange(e)} className="form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5"/>
                                    }
                                </p>
                            </div>

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