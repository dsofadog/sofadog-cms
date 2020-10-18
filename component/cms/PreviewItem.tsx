import { useEffect, useState } from "react";
import CmsConstant from '../../utils/cms-constant';

const PreviewItem = (props) => {

    const [item, setItem] = useState(null);
    const category = CmsConstant.Category;
    const [sentences, setSentences] = useState(null);
    const [creditsData, setCreditsData] = useState(null);

    useEffect(() => {
        setItem(props.item);
    }, [props]);

    useEffect(() => {
        if (item) {
            showSentences(0);
            showCredits('news_credits', item.news_credits);
        }
    }, [item]);

    function showSentences(i) {
        //console.log(item.descriptions[i])
        setSentences(item.descriptions[i]);
    }

    function showCredits(title, data) {
        //console.log(data)
        setCreditsData({ title: title, data: data });
        //console.log("creditsData: ",creditsData)
    }

    return (
        <>
            {category && item ? (
                <div className="w-full mx-auto">
                    <div className="flex flex-no-wrap justify-center">
                        <div className="w-1/12 mx-auto flex-none float-left">
                            <div className="bg-purple-700 p-1 h-32 w-1 mx-auto"></div>
                        </div>
                    </div>
                    <div className="flex flex-no-wrap justify-center">
                        <div className="w-11/12 mx-auto flex-none float-left">
                            <div className="md:flex shadow-lg mx-6 md:mx-auto w-full h-xl">

                                <div className={`border-${category[item?.category].color} relative w-full h-full md:w-4/5 px-4 py-2 bg-white rounded-l-lg border-l-8`}>
                                    <div className="mb-4">
                                        <div className="w-full flex justify-end">
                                            <button className="px-2 py-1 bg-red-500 text-white rounded text-xs cursor-pointer">Delete</button>
                                        </div>
                                    </div>
                                    <div className="flex items-center mb-4">
                                        <h2 className="text-base text-gray-800 font-medium mr-auto">{item?.title}</h2>
                                    </div>
                                    {item?.descriptions.length > 0 && (
                                        <div className="w-full mb-4">
                                            <div className="p-4 shadow rounded border border-gray-300">
                                                <div className="block">
                                                    <div className="border-b border-gray-200">
                                                        <nav className="flex -mb-px">
                                                            {item?.descriptions.map((lang, i) => (
                                                                <a href={void (0)} onClick={() => showSentences(i)} className={`${creditsData?.title === 'news_credits' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} cursor-pointer ml-8 group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm leading-5 focus:outline-none focus:text-indigo-800 focus:border-indigo-700 capitalize`} aria-current="page">
                                                                    <span>{lang.language}</span>
                                                                </a>
                                                            ))}
                                                        </nav>
                                                    </div>
                                                    <div className="mt-4" role="group" aria-labelledby="teams-headline">
                                                        {sentences?.sentences.map((sentence, i) => (
                                                            <div className="flex items-center space-x-3 pl-3">
                                                                <div className="flex-shrink-0 w-2.5 h-2.5 rounded-full bg-indigo-500"></div>
                                                                <div className="truncate hover:text-gray-600 text-xs">
                                                                    <span>{sentence}</span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="w-full">
                                        <div className="p-4 shadow rounded border border-gray-300">
                                            <div className="block">
                                                <div className="border-b border-gray-200">
                                                    <nav className="flex -mb-px">
                                                        <a href={void (0)} onClick={() => showCredits('news_credits', item?.news_credits)} className={`${creditsData?.title === 'news_credits' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} cursor-pointer ml-8 group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm leading-5  focus:outline-none focus:text-indigo-800 focus:border-indigo-700`} aria-current="page">
                                                            <span>News Credits</span>
                                                        </a>
                                                        <a href={void (0)} onClick={() => showCredits('visual_credits', item?.visual_credits)} className={`${creditsData?.title === 'visual_credits' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} cursor-pointer ml-8 group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm leading-5 focus:outline-none focus:text-gray-700 focus:border-gray-300`}>
                                                            <span>Visual Credits</span>
                                                        </a>
                                                    </nav>
                                                </div>
                                                <div className="mt-4" role="group" aria-labelledby="teams-headline">
                                                    {creditsData?.data.map((credit, i) => (
                                                        <div className="flex items-center space-x-3 pl-3">
                                                            <div className="flex-shrink-0 w-2.5 h-2.5 rounded-full bg-indigo-500"></div>
                                                            <div className="truncate hover:text-gray-600 text-xs">
                                                                <a href={credit.url} target="_blank">{credit.link_text}</a>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="absolute mb-4 mr-4 bottom-0 inset-x-0">
                                        <div className="w-full space-x-2 flex justify-end">
                                            {item?.tags.map(tag => (
                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium leading-4 bg-blue-100 text-blue-800">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className={`bg-${category[item?.category].color} w-full md:w-1/5 relative z-10 rounded-lg rounded-l-none`}>
                                    <div className="absolute inset-x-0 top-0 transform translate-y-px">
                                        <div className="flex justify-center transform translate-y-1/2">
                                            <span className={`bg-${category[item?.category].color} bg-opacity-75 shadow inline-flex w-full h-10 flex items-center justify-center text-center px-4 py-1 text-xs leading-5 font-semibold tracking-wider uppercase text-white`}>
                                                {item?.state}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="h-full w-full flex items-start">
                                        {item.thumbnails.length > 0 && (
                                            <img className="h-auto w-full shadow-2xl rounded-lg rounded-l-none rounded-b-none"
                                                src={item.thumbnails[0].url} alt="" />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}
        </>

    )
}

export default PreviewItem