import { useState, useRef, useEffect, useReducer } from 'react';

import { config as f_config, library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import CmsConstant from 'utils/cms-constant';

f_config.autoAddCss = false;
library.add(fas, fab);

type Props = {
    feeds: any[],
    onSubmit: (filter: State) => void
}

enum ActionType {
    SelectCategory = 'select_category',
    DeselectCategory = 'deselect_category',

    SetAvailableCategories = 'set_available_categories',

    SelectTag = 'select_tag',
    DeselectTag = 'deselect_tag',
    ResetTags = 'reset_tags',

    SelectState = 'select_state',
    DeselectState = 'deselect_state',
    ResetStates = 'reset_states',

    SelectFeed = 'select_feed',
    DeselectFeed = 'deselect_feed',

    ResetAll = 'reset_all'
}

type State = {
    category: string | null;
    availableCategories: string[];
    tags: string[];
    states: string[];
    feed: string;
}

const initialState = {
    category: null,
    availableCategories: [],
    tags: [],
    states: [],
    feed: null
}

// TODO use redux-persist later

function reducer(state: State, action: any) {
    switch (action.type) {
        case ActionType.SelectCategory:
            return { ...state, category: action.payload }
        case ActionType.DeselectCategory:
            return { ...state, category: null }

        case ActionType.SetAvailableCategories:
            return { ...state, availableCategories: action.payload }

        case ActionType.SelectTag:
            return { ...state, tags: [...state.tags, action.payload] }
        case ActionType.DeselectTag:
            return { ...state, tags: state.tags.filter(tag => tag !== action.payload) }
        case ActionType.ResetTags:
            return { ...state, tags: [] }

        case ActionType.SelectState:
            return { ...state, states: [...state.states, action.payload] }
        case ActionType.DeselectState:
            console.log(action.payload)
            return { ...state, states: state.states.filter(itemState => itemState !== action.payload) }
        case ActionType.ResetStates:
            return { ...state, states: [] }

        case ActionType.SelectFeed:
            return { ...state, feed: action.payload }
        case ActionType.DeselectFeed:
            return { ...state, feed: null }

        case ActionType.ResetAll:
            return { ...initialState }
    }
}

const Filter = (props: Props) => {

    const { feeds, onSubmit } = props

    const tags = CmsConstant.Tags;
    const status = CmsConstant.Status;

    const [state, dispatch] = useReducer(reducer, initialState)

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

    const [openCategoryDropdown, setOpenCategoryDropdown] = useState(false);
    const toggleCateDropdown = () => { 
        if(state.availableCategories.length > 0){
            setOpenCategoryDropdown(!openCategoryDropdown)
        }
     };
    const [openTagDropdown, setOpenTagDropdown] = useState(false);
    const toggleTagDropdown = () => { setOpenTagDropdown(!openTagDropdown) };
    const [openStateDropdown, setOpenStateDropdown] = useState(false);
    const toggleStateDropdown = () => { setOpenStateDropdown(!openStateDropdown) };
    const [openFilterDropdown, setOpenFilterDropdown] = useState(false);
    const toggleFilterDropdown = () => { setOpenFilterDropdown(!openFilterDropdown) };
    const [openFeedDropdown, setOpenFeedDropdown] = useState(false);
    const toggleFeedDropdown = () => { setOpenFeedDropdown(!openFeedDropdown) };

    function clearAll() {
        dispatch({ type: ActionType.ResetAll })
    }

    function getFeedName() {
        let i = feeds.findIndex(x => x.id === state.feed);
        if (i >= 0) {
            return feeds[i].name ? feeds[i].name : feeds[i].id;
        }
    }

    function getCategoryTitle() {
        let i = state.availableCategories.findIndex(x => x.number === state.category);
        if (i >= 0) {
            return state.availableCategories[i].title;
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


    return (
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
                                <div ref={tagWrapperRef} data-id="tag" className="relative inline-block w-full">
                                    <div>
                                        <span onClick={toggleTagDropdown} className="rounded-md shadow-sm">
                                            <button type="button" className={`${state.tags.length > 0 ? 'border-indigo-600' : 'border-gray-300'} w-full inline-flex justify-center rounded-md border  px-2 py-2 bg-white text-xs leading-5 font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800 transition ease-in-out duration-150`} id="options-menu" aria-haspopup="true" aria-expanded="true">
                                                <span className="w-full truncate uppercase">
                                                    {state.tags.length > 0 ?
                                                        <>
                                                            {state.tags.join()}
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
                                                        <a key={i} href={void (0)} onClick={() => {
                                                            if (!state.tags.includes(tag.value)) {
                                                                dispatch({ type: ActionType.SelectTag, payload: tag.value })
                                                            } else {
                                                                dispatch({ type: ActionType.DeselectTag, payload: tag.value })
                                                            }
                                                        }} className={`${state.tags.includes(tag.value) ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 bg-white'} cursor-pointer block px-4 py-1 text-xs leading-5 focus:outline-none focus:bg-gray-100 focus:text-gray-900`} role="menuitem">
                                                            {tag.name}
                                                        </a>
                                                    ))}
                                                    <>
                                                        {(
                                                            <div className="w-full mt-2 flex justify-center">
                                                                {state.tags.length > 0 &&
                                                                    <span className="hidden sm:block mr-3">
                                                                        <button onClick={(e) => {
                                                                            dispatch({ type: ActionType.ResetTags })
                                                                        }} className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Clear</button>
                                                                    </span>}
                                                                <span className="hidden sm:block">
                                                                    <button onClick={(e) => {
                                                                        toggleTagDropdown()
                                                                    }} className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Close</button>
                                                                </span>
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
                                <div ref={stateWrapperRef} data-id="state" className="w-full relative inline-block text-left">
                                    <div>
                                        {status && (
                                            <span onClick={toggleStateDropdown} className="rounded-md shadow-sm">
                                                <button type="button" className={`${state.states.length > 0 ? 'border-indigo-600' : 'border-gray-300'} w-full inline-flex justify-center rounded-md border  px-2 py-2 bg-white text-xs leading-5 font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800 transition ease-in-out duration-150`} id="options-menu" aria-haspopup="true" aria-expanded="true">

                                                    <span className="w-full truncate uppercase">
                                                        {
                                                            state.states.length > 0 ?
                                                                <>
                                                                    {state.states.join()}
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
                                                        <a key={i} href={void (0)} onClick={() => {
                                                            if (state.states.includes(status.name)) {
                                                                dispatch({ type: ActionType.DeselectState, payload: status.name })
                                                            } else {
                                                                dispatch({ type: ActionType.SelectState, payload: status.name })
                                                            }
                                                        }} className={`${state.states.includes(status.name) ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 bg-white'} cursor-pointer block px-4 py-1 text-xs leading-5 focus:outline-none focus:bg-gray-100 focus:text-gray-900`} role="menuitem">
                                                            {status.value}
                                                        </a>
                                                    ))}
                                                    <>

                                                        {(
                                                            <div className="w-full mt-2 flex justify-center">
                                                                {state.states.length > 0 &&
                                                                    <span className="hidden sm:block mr-3">
                                                                        <button onClick={(e) => {
                                                                            dispatch({ type: ActionType.ResetStates })
                                                                        }} className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Clear</button>
                                                                    </span>}
                                                                <span className="hidden sm:block">
                                                                    <button onClick={(e) => {
                                                                        toggleStateDropdown()
                                                                    }} className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Close</button>
                                                                </span>
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
                                                <button type="button" className={`${state.feed ? 'border-indigo-600' : 'border-gray-300'} w-full inline-flex justify-center rounded-md border  px-2 py-2 bg-white text-xs leading-5 font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800 transition ease-in-out duration-150`} id="options-menu" aria-haspopup="true" aria-expanded="true">

                                                    <span className="w-full truncate uppercase">
                                                        {
                                                            state.feed ?
                                                                <>
                                                                    {getFeedName()}
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
                                                        <a key={i} href={void (0)} onClick={() => {

                                                            if(state.feed === feed.id ){
                                                                dispatch({ type: ActionType.DeselectFeed})
                                                                dispatch({ type: ActionType.SetAvailableCategories, payload: []})
                                                                dispatch({ type: ActionType.DeselectCategory })
                                                            }else{
                                                                dispatch({ type: ActionType.SelectFeed, payload: feed.id })
                                                                dispatch({ type: ActionType.SetAvailableCategories, payload: feed.categories })
                                                                dispatch({ type: ActionType.DeselectCategory })
                                                            }
                                                        }} className={`${feed.id === state.feed ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 bg-white'} cursor-pointer block px-4 py-1 text-xs leading-5 focus:outline-none focus:bg-gray-100 focus:text-gray-900`} role="menuitem">
                                                            {feed.name ? feed.name : feed.id}
                                                        </a>
                                                    ))}
                                                    <>

                                                        {(
                                                            <div className="w-full mt-2 flex justify-center">
                                                                {state.feed &&
                                                                    <span className="hidden sm:block mr-3">
                                                                        <button onClick={(e) => {
                                                                            dispatch({ type: ActionType.DeselectFeed })
                                                                            dispatch({ type: ActionType.SetAvailableCategories, payload: []})
                                                                            dispatch({ type: ActionType.DeselectCategory })
                                                                        }} className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Clear</button>
                                                                    </span>}
                                                                <span className="hidden sm:block">
                                                                    <button onClick={(e) => {
                                                                        toggleFeedDropdown()
                                                                    }} className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Close</button>
                                                                </span>
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
                                <div ref={catWrapperRef} data-id="category" className="relative inline-block w-full">
                                    <div>
                                        {(
                                            <span onClick={toggleCateDropdown} className="rounded-md shadow-sm">
                                                <button type="button" className={`${state.category ? 'border-indigo-600' : 'border-gray-300'} w-full inline-flex justify-center rounded-md border  px-2 py-2 bg-white text-xs leading-5 font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800 transition ease-in-out duration-150 cursor-not-allowed`} id="options-menu" aria-haspopup="true" aria-expanded="true">
                                                    <span className="w-full truncate uppercase">

                                                        {state.category ?
                                                            getCategoryTitle() : 'Category'
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
                                                    {state.availableCategories?.map((cat, i) => (
                                                        <a key={i} href={void (0)} onClick={() => {
                                                            if (state.category === cat.number) {
                                                                dispatch({ type: ActionType.DeselectCategory })
                                                            } else {
                                                                dispatch({ type: ActionType.SelectCategory, payload: cat.number })
                                                            }
                                                        }} className={`${state.category === cat.number ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 bg-white'} cursor-pointer block px-4 py-1 text-xs leading-5 focus:outline-none focus:bg-gray-100 focus:text-gray-900`} role="menuitem">
                                                            {cat.title}
                                                        </a>
                                                    ))}
                                                    <>

                                                        {(
                                                            <div className="w-full mt-2 flex justify-center">
                                                                {state.category &&
                                                                    <span className="hidden sm:block mr-3">
                                                                        <button onClick={(e) => {
                                                                            dispatch({ type: ActionType.DeselectCategory })
                                                                        }} className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Clear</button>
                                                                    </span>}
                                                                <span className="hidden sm:block">
                                                                    <button onClick={(e) => {
                                                                        toggleCateDropdown()
                                                                    }} className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Close</button>
                                                                </span>
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
                            <button onClick={(e) => {
                                onSubmit(state)
                                toggleFilterDropdown()
                            }} className="text-white text-sm bg-indigo-600 hover:bg-indigo-800 rounded w-1/2 p-2">Submit</button>
                            <button onClick={(e) => {
                                clearAll()
                            }} className="text-gray-800 text-sm border border-indigo-600 hover:bg-gray-200 rounded w-1/2 p-2">Clear All</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Filter