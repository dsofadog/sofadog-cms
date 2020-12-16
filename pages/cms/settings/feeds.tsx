import Settings from "component/common/Settings"
import { useState, useEffect } from "react";

import _ from 'lodash'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import CreateFeedForm from "component/cms/feeds/CreateFeedForm";
import FeedList from "component/cms/feeds/FeedList";
import EditFeedForm from "component/cms/feeds/EditFeedForm";
import Feed from "component/cms/feeds/Feed";
import CreateCategoryForm from "component/cms/feeds/CreateCategoryForm";



enum Mode {
    AddFeed = 'add_feed',
    EditFeed = 'edit_feed',
    ViewFeed = 'view_feed',
    ViewFeeds = 'view_feeds',
    AddCategory = 'add_category',
}

const Feeds = () => {

    const [mode, setMode] = useState<Mode>(Mode.ViewFeeds)
    const [feed, setFeed] = useState(null)

    useEffect(() => {
        if (feed) {
            setMode(Mode.ViewFeed)
        }
    }, [feed])

    return (
        <Settings>
            <div className="flex items-center justify-between px-4 py-5 sm:px-6">
                <div className="flex items-center">
                    {mode !== Mode.ViewFeeds && (
                        <button type="button" className="btn btn-default mr-5" onClick={() => {
                            if(mode === Mode.EditFeed || mode === Mode.AddCategory){
                                setMode(Mode.ViewFeed)
                            }else{
                                setMode(Mode.ViewFeeds)
                            }
                        }}>
                            <FontAwesomeIcon className="w-3 mr-2" icon={['fas', 'chevron-left']} />
                            Back
                        </button>)
                    }
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                        {mode === Mode.ViewFeeds && 'Feeds'}
                        {mode === Mode.AddFeed && 'Create feed'}
                        {mode === Mode.EditFeed && 'Edit feed'}
                        {mode === Mode.ViewFeed && ('Feed - ' + feed.name)}
                        {mode === Mode.AddCategory && 'Create category'}
                    </h3>
                </div>

                {mode === Mode.ViewFeeds && <button type="button" className={'btn btn-green'} onClick={() => setMode(Mode.AddFeed)}>
                    <FontAwesomeIcon className="w-3 mr-2" icon={['fas', 'plus']} />
                    New
                </button>}
                {mode === Mode.ViewFeed && (
                <div>
                <button type="button" className={'btn btn-default'} onClick={() => setMode(Mode.EditFeed)}>
                    <FontAwesomeIcon className="w-3 mr-2" icon={['fas', 'pen']} />
                    Edit feed
                </button>
                <button type="button" className={'btn btn-default ml-3'} onClick={() => setMode(Mode.AddCategory)}>
                    <FontAwesomeIcon className="w-3 mr-2" icon={['fas', 'plus']} />
                    Add category
                </button>
                </div>
                
                )}
            </div>

            <div className="border-t">
                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                    {mode === Mode.AddFeed && <CreateFeedForm callback={(success) => {
                        if (success) {
                            setMode(Mode.ViewFeeds)
                        }
                    }} />}
                    {mode === Mode.ViewFeed && <Feed feed={feed} />}
                    {mode === Mode.EditFeed && <EditFeedForm feed={feed} onUpdated={(feed)=>{
                        setFeed(feed)
                    }}/>}
                    {mode === Mode.ViewFeeds && <FeedList onFeedSelect={(feed) => setFeed(feed)} />}
                    {mode === Mode.AddCategory && <CreateCategoryForm feed={feed} onCreated={(feed)=>{
                        setFeed(feed)
                        setMode(Mode.ViewFeed)
                    }}/>}
                </div>
            </div>

        </Settings>
    )
}

export default Feeds