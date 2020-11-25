import { useContext, useEffect, useState } from "react";
import { LayoutContext } from "../../contexts";
import Feed from "./Feed";
import HttpCms from '../../utils/http-cms';

const dummyData = [
    {
        id: '1be48eb0-1321-11eb-a65a-4785025e4324',
        name: 'Feed1',
        description: 'description1'
    },
    {
        id: '2be48eb0-1321-11eb-a65a-4785025e4324',
        name: 'Feed2',
        description: 'description2'
    },
    {
        id: '3be48eb0-1321-11eb-a65a-4785025e4324',
        name: 'Feed3',
        description: 'description3'
    }
]

const FeedComponent = () => {
    const [addNew, setAddNew] = useState(false);
    const toggleAddNew = () => { setAddNew(!addNew) };
    const [feeds, setFeeds] = useState(null);
    const { setLoading, appUserInfo, currentUserPermission } = useContext(LayoutContext);
    useEffect(() => {
        fetchFeeds();
    }, []);

    function fetchFeeds() {
        setLoading(true);
        let api = "feeds?token="+appUserInfo?.token;
        HttpCms.get(api)
        .then(response => {
        	console.log("fetch res: ", response.data);
        	setFeeds(response.data.feeds);
        	setLoading(false);
        })
        .catch(e => {
        	console.log(e);
        	setLoading(false);
        })
        .finally(() => {
        	setLoading(false);
        });
        //setFeeds(dummyData);
    }

    function addFeed(feedData) {
        console.log(feedData);
        toggleAddNew();
        setLoading(true);
        HttpCms.post("feeds?token=" + appUserInfo?.token, feedData)
            .then((response) => {
                const f = [...feeds];
                f.push(response.data.feed);
                setFeeds(f);
            })
            .catch((e) => {
                console.log(e);
            })
            .finally(() => {
                setLoading(false);
            });
        // const f = [...feeds];
        // f.push(feedData);
        // setFeeds(f);
    }

    function addCategory(category,feed_id){
        setLoading(true);
        HttpCms.post("feed/"+feed_id+"/categories?token=" + appUserInfo?.token, category)
            .then((response) => {
                console.log("response cat: ",response.data);
                let i = feeds.findIndex(x => x.id === feed_id);
                const f = [...feeds];
                f[i] = response.data.feed;
                setFeeds(f);
            })
            .catch((e) => {
                console.log(e);
            })
            .finally(() => {
                setLoading(false);
            });
    }

    function updateCategory(category,feed_id){
        let data = {
            title: category.title,
            colour: category.colour,
            hex: category.hex
        }
        setLoading(true);
        HttpCms.post("feed/"+feed_id+"/categories/"+category.number+"?token=" + appUserInfo?.token, data)
            .then((response) => {
                console.log("response cat: ",response.data);
                let i = feeds.findIndex(x => x.id === feed_id);
                const f = [...feeds];
                f[i] = response.data.feed;
                setFeeds(f);
            })
            .catch((e) => {
                console.log(e);
            })
            .finally(() => {
                setLoading(false);
            });
    }

    function deleteCategory(category,feed_id){
        setLoading(true);
        HttpCms.delete("feed/"+feed_id+"/categories/"+category.number+"?token=" + appUserInfo?.token)
            .then((response) => {
                console.log("response cat: ",response.data);
                let i = feeds.findIndex(x => x.id === feed_id);
                const f = [...feeds];
                f[i] = response.data.feed;
                setFeeds(f);
            })
            .catch((e) => {
                console.log(e);
            })
            .finally(() => {
                setLoading(false);
            });
    }
    return (
        <div className="min-h-3/4">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="w-full flex">
                    <div className="w-1/2">
                        <h1 className="text-2xl font-semibold text-gray-900">Feed</h1>
                    </div>
                    <div className="w-1/2 flex justify-end">
                        <button onClick={toggleAddNew} className="px-2 py-1 bg-indigo-600 hover:bg-indigo-700 rounded text-white text-sm">+ Add Feed</button>
                    </div>
                </div>
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                <div className="min-h-96 pt-2">
                    <div className="bg-white shadow overflow-hidden sm:rounded-md">
                        <ul className="divide-y divide-gray-200">
                            {addNew && (
                                <Feed action="add" callback={toggleAddNew} addFeed={addFeed}></Feed>
                            )}
                            {feeds?.map((data, i) => (
                                <Feed data={data} action="view" addFeed={addFeed} addCategory={addCategory} updateCategory={updateCategory} deleteCategory={deleteCategory}></Feed>
                            ))}
                            {feeds?.length === 0 || feeds === null && (
                                <li>
                                    <a href={void (0)} className="block hover:bg-gray-50">
                                        <div className="flex items-center px-4 py-4 sm:px-6">
                                            <div className="min-w-0 flex-1 flex items-center justify-center">
                                                <span className="font-semibold text-xl">No Data Found</span>
                                            </div>
                                        </div>
                                    </a>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FeedComponent