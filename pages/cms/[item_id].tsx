import { useRouter } from 'next/router';
import Router from 'next/router';
import { useContext, useEffect, useState } from 'react';
import Editor from '../../component/cms/Editor';
import NavHeader from "../../component/common/NavHeader";
import { LayoutContext } from '../../contexts';
import HttpCms from '../../utils/http-cms';
import { config as f_config, library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';

//Mirage Server
import { createServer } from "miragejs";
import CmsConstant from '../../utils/cms-constant';
createServer({
    routes() {
        this.passthrough('https://v-int.so.fa.dog/**');
        this.namespace = '/api';
        this.get("/news_items", () => ({
            news_items: [
                {
                    "id": "0be48eb0-1321-11eb-a65a-4785025e4324",
                    "title": "What's At Stake? Puerto Ricans and the Latino Vote ",
                    "category": 5,
                    "news_credits": [
                        {
                            "url": "",
                            "link_text": "AP "
                        }
                    ],
                    "visual_credits": [
                        {
                            "url": "",
                            "link_text": "AP "
                        },
                        {
                            "url": "",
                            "link_text": "Scanpix"
                        }
                    ],
                    "descriptions": [
                        {
                            "language": "english",
                            "sentences": [
                                "They have been American citizens since 1917, and yet they can’t vote So why are Trump and Biden tapping them? They comprise 27% of Hispanics of voting age in Florida, a key state for Trump’s 2016 victory This small island territory is in Hurricane Alley, and they have been reliant on federal aidThe candidates are banking on Latinos' close-knit ties to influence their friends and families in the mainland US Biden’s campaign says, “With your vote there, you help us here”Trump pledged $13B in aid for Hurricane Maria. He says he's ‘the best thing that happened to Puerto Rico'"
                            ]
                        }
                    ],
                    "updated_at": 1603231936,
                    "created_at": 1603231821,
                    "state": "pushed_to_feed",
                    "clips": [
                        {
                            "id": "4e3d9b08-1321-11eb-b334-596528e5b754",
                            "url": "https://cdn.so.fa.dog/aws-transcoded-clips-int/43-0be48eb0-1321-11eb-a65a-4785025e4324.m3u8",
                            "aspect_ratio": "43",
                            "updated_at": 1603231933,
                            "created_at": 1603231933
                        },
                        {
                            "id": "4e3e81b2-1321-11eb-b334-596528e5b754",
                            "url": "https://cdn.so.fa.dog/aws-transcoded-clips-int/1959-0be48eb0-1321-11eb-a65a-4785025e4324.m3u8",
                            "aspect_ratio": "1959",
                            "updated_at": 1603231933,
                            "created_at": 1603231933
                        },
                        {
                            "id": "4e3f5420-1321-11eb-b334-596528e5b754",
                            "url": "https://cdn.so.fa.dog/aws-transcoded-clips-int/169-0be48eb0-1321-11eb-a65a-4785025e4324.m3u8",
                            "aspect_ratio": "169",
                            "updated_at": 1603231933,
                            "created_at": 1603231933
                        }
                    ],
                    "tags": [],
                    "thumbnails": [
                        {
                            "id": "4e4027c4-1321-11eb-b334-596528e5b754",
                            "url": "https://cdn.so.fa.dog/thumbnails-int/0be48eb0-1321-11eb-a65a-4785025e4324.jpg_43.jpg",
                            "aspect_ratio": "43",
                            "updated_at": 1603231933,
                            "created_at": 1603231933
                        },
                        {
                            "id": "4e40f8d4-1321-11eb-b334-596528e5b754",
                            "url": "https://cdn.so.fa.dog/thumbnails-int/0be48eb0-1321-11eb-a65a-4785025e4324.jpg_1959.jpg",
                            "aspect_ratio": "1959",
                            "updated_at": 1603231933,
                            "created_at": 1603231933
                        },
                        {
                            "id": "4e41c8ae-1321-11eb-b334-596528e5b754",
                            "url": "https://cdn.so.fa.dog/thumbnails-int/0be48eb0-1321-11eb-a65a-4785025e4324.jpg_169.jpg",
                            "aspect_ratio": "169",
                            "updated_at": 1603231933,
                            "created_at": 1603231933
                        }
                    ],
                    "deleted": null,
                    "ordinal": 453,
                    "comments": null
                }
            ],
        }))
    },
})

f_config.autoAddCss = false;
library.add(fas, fab);

const Item = () => {
    const router = useRouter()
    const { item_id } = router.query;
    const { setLoading, appUserInfo } = useContext(LayoutContext);

    const [item, setItem] = useState(null);
    const [body, setBody] = useState('');

    const [sentences, setSentences] = useState(null);
    const [creditsData, setCreditsData] = useState(null);
    const [activeLang, setActiveLang] = useState(0);
    const [video, setVideo] = useState(null);
    const [isClips, setIsClips] = useState(false);
    const [clips, setClips] = useState({ video: null, thumbnails: null });
    const [isEdit, setIsEdit] = useState(false);

    const categories = CmsConstant.Category;
    const status = CmsConstant.Status;

    useEffect(() => {
        logoutUserCheck();
        console.log("item_id: ", item_id);
        if (item_id != undefined) {
            fetchItem();
        }
    }, [item_id]);

    useEffect(() => {
        if (item) {
            showSentences(0);
            showCredits('news_credits', item.news_credits);
        }
    }, [item]);

    function logoutUserCheck() {
        console.log(appUserInfo);
        if (appUserInfo == null) {
            //|| (appUserInfo?.token !="" && appUserInfo?.token != undefined)
            setLoading(false);
            console.log("isnadsadsa");
            Router.push('/');
            return false;
        }
    }

    function fetchItem() {
        setLoading(true);
        // HttpCms.get(`/news_items/${item_id}?token=abcdef`)
        //     .then(response => {
        //         setItem(response.data.news_items[0]);
        //         console.log(response.data.news_items[0], "response.data.data");
        //         setLoading(false);
        //     })
        //     .catch(e => {
        //         console.log(e);
        //         setLoading(false);
        //     });
        fetch("/api/news_items")
            .then((res) => res.json())
            .then((json) => {
                setItem(json.news_items[0]);
                console.log("items: ", item);
                setLoading(false);
            })
    }

    function showSentences(i) {
        setActiveLang(i);
        setSentences(item.descriptions[i]);
    }

    function showCredits(title, data) {
        setCreditsData({ title: title, data: data });
    }

    function showStatus(itemkey) {
        let statusReturn = '';
        status?.map((s, i) => {
            if (s.name === itemkey) {
                statusReturn = s.value;
            }
        });

        return statusReturn;
    }

    return (
        <>
            {item && (
                <div className="w-full h-full min-h-screen overflow-y-auto pb-20 bg-gray-500">
                    <NavHeader />
                    <div className="w-full min-h-96 p-4">
                        <div className="max-w-7xl mx-auto">
                            <div className="w-full">
                                <div className="w-full mx-auto h-auto max-h-2xl">
                                    <div className="flex flex-no-wrap justify-center">
                                        <div className="w-11/12 mx-auto flex-none float-left">
                                            <div className="md:flex mx-6 md:mx-auto w-full h-full">

                                                <div className={`border-${categories ? categories[item?.category].color : 'gray-200'} relative w-full h-full md:w-4/5 px-4 py-2 bg-white rounded-lg rounded-r-none border-l-8`}>
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
                                                                                <a key={i} href={void (0)} onClick={() => showSentences(i)} className={`${activeLang === i ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} cursor-pointer ml-8 group inline-flex items-center py-2 px-1 border-b-2 font-medium text-sm leading-5 focus:outline-none focus:text-indigo-800 focus:border-indigo-700 capitalize`} aria-current="page">
                                                                                    <span>{lang.language}</span>
                                                                                </a>
                                                                            ))}
                                                                        </nav>
                                                                    </div>
                                                                    <div className="mt-4" role="group" aria-labelledby="teams-headline">
                                                                        {sentences?.sentences.map((sentence, i) => (
                                                                            <div key={i} className="flex items-center space-x-3 pl-3">
                                                                                <div className="flex-shrink-0 w-2.5 h-2.5 rounded-full bg-indigo-500"></div>
                                                                                <div className="hover:text-gray-600 text-xs">
                                                                                    <span>{sentence}</span>
                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    <div className="w-full mb-16">
                                                        <div className="p-4 shadow rounded border border-gray-300">
                                                            <div className="block">
                                                                <div className="border-b border-gray-200">
                                                                    <nav className="flex -mb-px">
                                                                        <a href={void (0)} onClick={() => showCredits('news_credits', item?.news_credits)} className={`${creditsData?.title === 'news_credits' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} cursor-pointer ml-8 group inline-flex items-center py-2 px-1 border-b-2 font-medium text-sm leading-5  focus:outline-none focus:text-indigo-800 focus:border-indigo-700`} aria-current="page">
                                                                            <span>News Credits</span>
                                                                        </a>
                                                                        <a href={void (0)} onClick={() => showCredits('visual_credits', item?.visual_credits)} className={`${creditsData?.title === 'visual_credits' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} cursor-pointer ml-8 group inline-flex items-center py-2 px-1 border-b-2 font-medium text-sm leading-5 focus:outline-none focus:text-gray-700 focus:border-gray-300`}>
                                                                            <span>Visual Credits</span>
                                                                        </a>
                                                                    </nav>
                                                                </div>
                                                                <div className="mt-4 max-h-24 overflow-y-scroll" role="group" aria-labelledby="teams-headline">
                                                                    {creditsData?.data.map((credit, i) => (
                                                                        <div key={i} className="flex items-center space-x-3 pl-3">
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
                                                    <div className="absolute mb-4 mr-4">
                                                        <div className="w-full space-x-2 flex justify-end">
                                                            {item?.tags.map(tag => (
                                                                <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium leading-4 bg-blue-100 text-blue-800">
                                                                    {tag}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div className="w-full py-5">
                                                        <div className="w-full py-4 flex items-center text-center space-x-2">
                                                            <div className="w-1/6 flex items-center space-x-2">
                                                                <span className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-blue-500">
                                                                    <span className="text-lg font-medium leading-none text-white">3</span>
                                                                </span>
                                                                <label className="text-base font-bold text-gray-800 cursor-pointer">Comments</label>
                                                            </div>
                                                            <div className="w-5/6 h-1 border-b-2 border-black"></div>
                                                        </div>
                                                        <div className="w-full">

                                                        </div>
                                                        <Editor value={body} onChange={setBody} />
                                                    </div>
                                                </div>

                                                <div className={`bg-${categories[item?.category].color} w-full md:w-1/5 relative z-10 rounded-lg rounded-l-none`}>
                                                    <div className="inset-x-0 top-0 transform">
                                                        <div className="flex justify-center transform">
                                                            <span className={`bg-${categories[item?.category].color} shadow inline-flex w-full h-10 flex items-center justify-center text-center px-4 py-1 text-sm leading-5 font-semibold tracking-wider uppercase text-white`}>
                                                                {showStatus(item?.state)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="h-auto w-full flex items-start">
                                                        {item?.state != "awaiting_video_upload" ?
                                                            <>
                                                                {item.thumbnails.length > 0 && (
                                                                    <img className="h-auto w-full shadow-2xl"
                                                                        src={item.thumbnails[0].url} alt="" />
                                                                )}
                                                            </>
                                                            : null
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Item