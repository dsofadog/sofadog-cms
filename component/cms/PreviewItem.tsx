import Actions from "component/common/Actions"
import Owners from "component/common/Owners"
import NewsItemHeaderSection from "component/common/NewsItemHeaderSection"
import Comments from "./Comments"
import { useState, useEffect } from "react"

import _ from 'lodash'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useTimeout } from "rooks"

enum Language {
    English = 'english',
    Estonian = 'estonian'
}


const PreviewItem = (props) => {

    const { feeds, newsItem, onEdit } = props

    const [loadingThumbnails, setLoadingThumbnails] = useState<boolean>(false)
    const { start: fastStopLoadingThumbnails } = useTimeout(() => setLoadingThumbnails(false), 1000)
    const { start: slowStopLoadingThumbnails } = useTimeout(() => setLoadingThumbnails(false), 4000)

    const [category, setCategory] = useState<any>()
    const [activeLanguage, setActiveLanguage] = useState<Language>(Language.English)
    const [commentVisibility, setCommentVisibility] = useState(false)
    const [summary, setSummary] = useState<boolean>(true)

    useEffect(()=>{
        getFeedCategories()
    }, [])

    useEffect(() => {
        if (newsItem?.loading) {
            setLoadingThumbnails(true)
        }
        if (!newsItem?.loading && newsItem?.state === 'transcoding') {
            slowStopLoadingThumbnails()
        } else if (!newsItem?.loading && newsItem?.state !== 'transcoding') {
            fastStopLoadingThumbnails()
        }
    }, [newsItem?.loading])

    function getColorCode() {

        if (category != null) {
            return category?.hex ? category?.hex : '#e5e7eb';

        } else {
            return '#e5e7eb';
        }

    }

    function getFeedCategories() {
        let f = feeds?.findIndex(x => x.id === newsItem.feed_id);
        console.log("categories ", feeds[f]);
        let c = feeds[f]?.categories.findIndex(x => x.number === newsItem.category);
        console.log("feeds[f]?.categories[c] ", feeds[f]?.categories[c]);
        setCategory(feeds[f]?.categories[c]);
    }

    return (<>
        {/* <div className="relative">

            <div className="absolute inset-0 py-10">
                <div className="relative h-96">
                    <div className="absolute w-full bg-gray-200 h-80 rounded-3xl"></div>
                    <div className="absolute w-full bg-red-500 h-80 rounded-3xl transform -rotate-1 sm:-rotate-2"></div>
                </div>
            </div>
            

        </div> */}
        <div className="flex flex-nowrap justify-center">
            <div className="w-1/12 mx-auto flex-none float-left">
                <div className="bg-gray-300 p-1 h-32 w-1 mx-auto"></div>
            </div>
        </div>
        <div className="relative grid grid-cols-12">
            <div
                style={{ paddingTop: '4rem', paddingBottom: '1rem' }}
                className="col-span-2">
                <div>
                    {loadingThumbnails && 
                    
                    <span className="w-full inline-flex items-center justify-center sfd-btn-primary-static rounded-l-lg shadow-xl">
                            <span style={{ paddingTop: '133%' }}></span>
                            <FontAwesomeIcon className="w-16 h-16 p-2 rounded-full text-gray-200" icon={['fas', 'spinner']} spin />
                        </span>
                    }

                    {!loadingThumbnails && (newsItem?.thumbnails[0] && newsItem?.thumbnails[0].url
                        ? <img
                            src={newsItem?.thumbnails[0].url}
                            className="rounded-l-lg shadow-xl"
                        />
                        : <span className="w-full inline-flex items-center justify-center sfd-btn-primary-static rounded-l-lg shadow-xl">
                            <span style={{ paddingTop: '133%' }}></span>
                            <FontAwesomeIcon className="w-16 h-16 text-white" icon={['fas', 'image']} />
                            {/* <span className="text-lg font-medium leading-none text-white">N</span> */}
                        </span>)}
                </div>
            </div>

            <div className="col-span-10 bg-white shadow rounded-lg border-t-8 divide-y divide-gray-200" style={{borderColor: getColorCode()}}>
                <div className="grid grid-cols-7 gap-4 p-3">

                    <div className="md:col-span-2 sm:col-span-7 flex items-center">
                        <button type="button" onClick={() => setSummary(!summary)} className="btn btn-default mr-5">
                            <FontAwesomeIcon className="w-3 h-3 mr-2" icon={['fas', summary ? 'caret-down' : 'caret-up']} />
                            {summary ? 'Expand' : 'Collapse'}
                        </button>
                        <div className="sm:hidden">
                            <label htmlFor="tabs" className="sr-only">Select a tab</label>
                            <select id="tabs-language" name="tabs" className="block w-full focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md">
                                <option selected={activeLanguage === Language.English}>English</option>
                                <option selected={activeLanguage === Language.Estonian}>Estonian</option>
                            </select>
                        </div>
                        <div className="hidden sm:block">
                            <nav className="flex space-x-4" aria-label="Tabs">
                                <a onClick={() => setActiveLanguage(Language.English)} className={(activeLanguage === Language.English ? 'bg-gray-100 text-gray-700' : 'text-gray-500 hover:text-gray-700') + ' inline-flex items-center cursor-pointer px-3 py-2 font-medium text-sm rounded-md'}>
                                    English
                                                                            </a>
                                <a onClick={() => setActiveLanguage(Language.Estonian)} className={(activeLanguage === Language.Estonian ? 'bg-gray-100 text-gray-700' : 'text-gray-500 hover:text-gray-700') + ' inline-flex items-center cursor-pointer px-3 py-2 font-medium text-sm rounded-md'}>
                                    Estonian
                                                                            </a>
                            </nav>
                        </div>
                    </div>
                    <div className="md:col-span-3 sm:col-span-7">
                        <Owners newsItem={newsItem} />
                    </div>
                    <div className="md:col-span-2 sm:col-span-7">
                        <Actions newsItem={newsItem} onEdit={onEdit} />
                    </div>
                </div>
                <div className="px-6 py-6">
                    <NewsItemHeaderSection newsItem={newsItem} />

                    <div className={(summary ? 'max-h-36 overflow-hidden relative' : '')}>
                        {summary && <div onClick={() => setSummary(false)} className="fade absolute w-full h-20 bottom-0 cursor-pointer flex justify-center items-end">
                            <FontAwesomeIcon className='w-6 h-6 text-gray-300' icon={['fas', 'angle-double-down']} />
                        </div>}
                        <div className={activeLanguage !== Language.English ? 'hidden' : ''}>
                            {newsItem.descriptions.find(d => d.language === Language.English)?.sentences.map((sentence, index) => {
                                return (
                                    <>
                                        <div className={' hover:text-gray-600 text-base'}>
                                            <div className="wysiwyg w-full space-y-1 px-2 pr-5 pb-4 pt-4">
                                                <div>
                                                    <span style={{
                                                        overflowWrap: 'break-word',
                                                        wordWrap: 'break-word',
                                                        hyphens: 'auto'
                                                    }} className={'text-base text-gray-600'} dangerouslySetInnerHTML={{ __html: sentence }} ></span>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )
                            })}
                        </div>
                        <div className={activeLanguage !== Language.Estonian ? 'hidden' : ''}>
                            {newsItem.descriptions.find(d => d.language === Language.Estonian)?.sentences.map(sentence => {
                                return (
                                    <>
                                        <div className={(!false ? '' : 'truncate') + ' hover:text-gray-600 text-base'}>
                                            <div className="wysiwyg w-full space-y-1 px-2 pr-5 pb-4 pt-4">
                                                <div>
                                                    <span style={{
                                                        overflowWrap: 'break-word',
                                                        wordWrap: 'break-word',
                                                        hyphens: 'auto'
                                                    }} className="text-base text-gray-600" dangerouslySetInnerHTML={{ __html: sentence }} ></span>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )
                            })}
                        </div>


                        <div>
                            {newsItem.news_credits?.length > 0 &&
                                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                                    <dt className="text-sm font-medium text-gray-500">
                                        News credits
                                </dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
                                            {newsItem.news_credits.map(newsCredit => {
                                                return (
                                                    <>
                                                        <li className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                                                            <div className="w-0 flex-1 flex items-center">
                                                                <span className="ml-2 flex-1 w-0 truncate">
                                                                    {newsCredit.link_text}
                                                                </span>
                                                            </div>
                                                            <div className="ml-4 flex-shrink-0">
                                                                <a href={newsCredit.url} target="_blank" className="font-medium text-indigo-600 hover:text-indigo-500">
                                                                    Link
                                                                </a>
                                                            </div>
                                                        </li>
                                                    </>
                                                )
                                            })}


                                        </ul>
                                    </dd>
                                </div>
                            }

                            {newsItem.visual_credits?.length > 0 &&
                                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                                    <dt className="text-sm font-medium text-gray-500">
                                        Visual credits
                                </dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
                                            {newsItem.visual_credits.map(newsCredit => {
                                                return (
                                                    <>
                                                        <li className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                                                            <div className="w-0 flex-1 flex items-center">
                                                                <span className="ml-2 flex-1 w-0 truncate">
                                                                    {newsCredit.link_text}
                                                                </span>
                                                            </div>
                                                            <div className="ml-4 flex-shrink-0">
                                                                <a href={newsCredit.url} target="_blank" className="font-medium text-indigo-600 hover:text-indigo-500">
                                                                    Link
                                                                </a>
                                                            </div>
                                                        </li>
                                                    </>
                                                )
                                            })}


                                        </ul>
                                    </dd>
                                </div>
                            }

                        </div>
                    </div>




                </div>
                <div className="px-6 py-6">
                    <div className="w-full">
                        <div className="w-full flex text-center justify-end space-x-2">
                            <span className="text-white w-6 h-6 rounded-full p-3 bg-blue-600 text-xs flex items-center justify-center">{newsItem?.comments.length}</span>
                            <label
                                onClick={() => setCommentVisibility(!commentVisibility)}
                                className="text-sm font-bold text-gray-800 cursor-pointer hover:underline"
                            >Comments</label>
                        </div>
                        {commentVisibility && <Comments newsItem={newsItem} />}
                    </div>
                </div>
            </div>
        </div>


    </>)
}

export default PreviewItem