import { useState } from "react";
import CmsConstant from '../../utils/cms-constant';

import { config as f_config, library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';

f_config.autoAddCss = false;
library.add(fas, fab, far);

const CreateItem = (props) => {

    const categories = CmsConstant.Category;
    const tags = CmsConstant.Tags;

    const [openTagDropdown, setOpenTagDropdown] = useState(false);
    const toggleTagDropdown = () => { setOpenTagDropdown(!openTagDropdown) };

    const [openCategoryDropdown, setOpenCategoryDropdown] = useState(false);
    const toggleCateDropdown = () => { setOpenCategoryDropdown(!openCategoryDropdown) };

    const [item, setItem] = useState(null);
    const [selectedTag, setSelectedTag] = useState([]);
    const [activeLang, setActiveLang] = useState(0);
    const [activeCredit, setActiveCredit] = useState(0);

    const blankSentence = { sentence: "", editable: true }
    const [descriptions, setDescriptions] = useState(
        [
            {
                language: "english",
                sentences: []
            },
            {
                language: "estonian",
                sentences: []
            }
        ]
    );

    const blankCreditSentence = { link_text: "", url: "", editable: true }
    const [credits, setCredits] = useState(
        [
            {
                credit: "News Credits",
                creditSentences: []
            },
            {
                credit: "Visual Credits",
                creditSentences: []
            }
        ]
    );

    function addBlankSentence(e) {
        e.preventDefault();
        const d = [...descriptions];
        d[activeLang].sentences.push(blankSentence);
        setDescriptions(d);
    }

    function handleSentenceChange(e, i) {
        e.preventDefault();
        const d = [...descriptions];
        d[activeLang].sentences[i].sentence = e.target.value;
        setDescriptions(d);
    }

    function changeSentenceState(e, i, state) {
        e.preventDefault();
        const d = [...descriptions];
        if (state === 'edit') {
            d[activeLang].sentences[i].editable = true;
        } else if (state === 'save') {
            d[activeLang].sentences[i].editable = false;
        } else if (state === 'delete') {
            d[activeLang].sentences.splice(i, 1);
        }
        setDescriptions(d);
    }

    function addBlankCreditSentence(e) {
        e.preventDefault();
        const c = [...credits];
        c[activeCredit].creditSentences.push(blankCreditSentence);
        setCredits(c);
    }

    function handleCreditSentenceChange(e, i, to) {
        e.preventDefault();
        const c = [...credits];
        if (to === 'text') {
            c[activeCredit].creditSentences[i].link_text = e.target.value;
        } else if (to === 'url') {
            c[activeCredit].creditSentences[i].url = e.target.value;
        }
        setCredits(c);
    }

    function changeCreditSentenceState(e, i, state) {
        e.preventDefault();
        const c = [...credits];
        if (state === 'edit') {
            c[activeCredit].creditSentences[i].editable = true;
        } else if (state === 'save') {
            c[activeCredit].creditSentences[i].editable = false;
        } else if (state === 'delete') {
            c[activeCredit].creditSentences.splice(i, 1);
        }
        setCredits(c);
    }

    function handleChangeInput(e) {
        setItem({
            ...item,
            title: e.target.value
        });
    }

    function handleClickSingleDropdown(cat) {
        setItem({
            ...item,
            category: `${cat.value}`
        });
        toggleCateDropdown();
    }

    function clearCategory() {
        setItem({
            ...item,
            category: ''
        });
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
        //toggleTagDropdown();
    }

    function clearTag(tag) {
        setSelectedTag(selectedTag.filter(item => item !== tag));
        setItem({
            ...item,
            tags: selectedTag
        });
    }

    function showSentences(i) {
        setActiveLang(i);
    }

    function showCredits(i) {
        setActiveCredit(i);
    }

    function saveData() {
        let newItem = {
            title: item.title,
            category: item.category,
            descriptions: [],
            news_credits: [],
            visual_credits: [],
            tags: selectedTag
        }

        if (descriptions) {
            let d = [];
            descriptions.map(description => {
                let lang = description.language;
                let sent = [];
                description.sentences.map(sentence => {
                    sent.push(sentence.sentence);
                });
                d.push({
                    language: lang,
                    sentences: sent
                })
            })
            setItem({
                ...item,
                descriptions: d
            });
            newItem.descriptions = d;
        }

        if (credits) {
            let nc = [];
            let vc = [];
            credits.map((credit, i) => {
                if (i === 0) {
                    credit.creditSentences.map(sentence => {
                        nc.push({
                            url: sentence.url,
                            link_text: sentence.link_text
                        })
                    });
                } else if (i === 1) {
                    credit.creditSentences.map(sentence => {
                        vc.push({
                            url: sentence.url,
                            link_text: sentence.link_text
                        })
                    });
                }
            });
            newItem.news_credits = nc;
            newItem.visual_credits = vc;
            setItem({
                ...item,
                news_credits: nc,
                visual_credits: vc
            });
        }
        console.log("Final Item Data: ", newItem);
        props.create(newItem);
    }


    return (
        <div className="w-full mx-auto">
            <div className="flex flex-no-wrap justify-center">
                <div className="w-1/12 mx-auto flex-none float-left">
                    <div className="bg-purple-700 p-1 h-32 w-1 mx-auto"></div>
                </div>
            </div>
            <div className="flex flex-no-wrap justify-center">
                <div className="w-11/12 mx-auto flex-none float-left">
                    <div className="md:flex shadow-lg mx-6 md:mx-auto w-full h-2xl">

                        <div className="relative w-full h-full md:w-4/5 px-4 py-2 bg-white rounded-l-lg border-l-8 border-white">
                            <div className="py-2">
                                <div className="w-full flex justify-end space-x-2">
                                    <button onClick={() => saveData()} className="px-2 py-1 bg-green-500 text-white rounded text-xs cursor-pointer">Save Data</button>
                                    <button onClick={() => props.close(false)} className="px-2 py-1 bg-blue-500 text-white rounded text-xs cursor-pointer">Cancel</button>
                                </div>
                            </div>
                            <div className="flex items-center mb-4">
                                <div className="w-full">
                                    <label htmlFor="about" className="block text-sm font-medium leading-5 text-gray-700">Title</label>
                                    <div className="mt-1 rounded-md shadow-sm">
                                        <textarea id="about" value={item?.title} rows={2} onChange={(e) => handleChangeInput(e)} className="form-textarea block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5" placeholder="Enter Title"></textarea>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full mb-4">
                                <div className="p-4 shadow rounded border border-gray-300">
                                    <div className="block">
                                        <div className="border-b border-gray-200">
                                            <nav className="flex -mb-px">
                                                <a href={void (0)} onClick={() => showSentences(0)} className={`${activeLang === 0 ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} cursor-pointer ml-8 group inline-flex items-center py-2 px-1 border-b-2 font-medium text-sm leading-5 focus:outline-none focus:text-indigo-800 focus:border-indigo-700 capitalize`} aria-current="page">
                                                    <span>English</span>
                                                </a>
                                                <a href={void (0)} onClick={() => showSentences(1)} className={`${activeLang === 1 ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} cursor-pointer ml-8 group inline-flex items-center py-2 px-1 border-b-2 font-medium text-sm leading-5 focus:outline-none focus:text-indigo-800 focus:border-indigo-700 capitalize`} aria-current="page">
                                                    <span>Estonian</span>
                                                </a>
                                                {/* <span className="ml-4">
                                                    <FontAwesomeIcon className="w-4 cursor-pointer text-blue-500 hover:text-blue-600" icon={['fas', 'plus-circle']} />
                                                </span> */}

                                            </nav>
                                        </div>
                                        <div className="mt-4 space-y-1" role="group" aria-labelledby="teams-headline">
                                            {/* <div className="w-full flex items-center space-x-3 px-3">
                                                <div className="flex-shrink-0 w-2.5 h-2.5 rounded-full bg-indigo-500"></div>
                                                <div className="w-11/12 truncate hover:text-gray-600 text-xs">
                                                    <span>12K people are at risk of dying every day from hunger linked to the virusOver 2B people lack access to safe, nutritious and sufficient food, 7M died of hunger this year World Food Programme says US$6.8B needed in six months to avert famine amid pandemic</span>
                                                </div>
                                                <div className="w-1/12 text-xs text-gray-600 flex space-x-2 justify-end">
                                                    <FontAwesomeIcon className="w-5 cursor-pointer hover:text-blue-600" icon={['fas', 'edit']} />
                                                    <FontAwesomeIcon className="w-3.5 cursor-pointer hover:text-red-800" icon={['fas', 'trash-alt']} />
                                                </div>
                                            </div>
                                            <div className="w-full flex items-center space-x-3 px-3">
                                                <div className="flex-shrink-0 w-2.5 h-2.5 rounded-full bg-indigo-500"></div>
                                                <div className="w-11/12 mt-1 relative rounded-md shadow-sm">
                                                    <input id="text" className="form-input block w-full text-xs sm:leading-3" placeholder="Enter sentence" />
                                                </div>
                                                <div className="w-1/12 text-xs text-gray-600 flex space-x-2 justify-end">
                                                    <FontAwesomeIcon className="w-5 cursor-pointer hover:text-white rounded-full bg-gray-300 hover:bg-green-500 p-1" icon={['fas', 'check']} />
                                                    <FontAwesomeIcon className="w-3.5 cursor-pointer hover:text-red-800" icon={['fas', 'trash-alt']} />
                                                </div>
                                            </div> */}
                                            {descriptions[activeLang].sentences.map((sentence, i) => (
                                                <>
                                                    {sentence.editable ?
                                                        <div className="w-full flex items-center space-x-3 px-3">
                                                            <div className="flex-shrink-0 w-2.5 h-2.5 rounded-full bg-indigo-500"></div>
                                                            <div className="w-11/12 mt-1 relative rounded-md shadow-sm">
                                                                <input value={sentence.sentence} onChange={(e) => handleSentenceChange(e, i)} className="form-input block w-full text-xs sm:leading-3" placeholder="Enter sentence" />
                                                            </div>
                                                            <div className="w-1/12 text-xs text-gray-600 flex space-x-2 justify-end">
                                                                <FontAwesomeIcon onClick={(e) => changeSentenceState(e, i, 'save')} className="w-5 cursor-pointer hover:text-white rounded-full bg-gray-300 hover:bg-green-500 p-1" icon={['fas', 'check']} />
                                                                <FontAwesomeIcon onClick={(e) => changeSentenceState(e, i, 'delete')} className="w-3.5 cursor-pointer hover:text-red-800" icon={['fas', 'trash-alt']} />
                                                            </div>
                                                        </div>
                                                        :
                                                        <div className="w-full flex items-center space-x-3 px-3">
                                                            <div className="flex-shrink-0 w-2.5 h-2.5 rounded-full bg-indigo-500"></div>
                                                            <div className="w-11/12 truncate hover:text-gray-600 text-xs">
                                                                <span>{sentence.sentence}</span>
                                                            </div>
                                                            <div className="w-1/12 text-xs text-gray-600 flex space-x-2 justify-end">
                                                                <FontAwesomeIcon onClick={(e) => changeSentenceState(e, i, 'edit')} className="w-5 cursor-pointer hover:text-blue-600" icon={['fas', 'edit']} />
                                                                <FontAwesomeIcon onClick={(e) => changeSentenceState(e, i, 'delete')} className="w-3.5 cursor-pointer hover:text-red-800" icon={['fas', 'trash-alt']} />
                                                            </div>
                                                        </div>
                                                    }
                                                </>
                                            ))}

                                            {descriptions[activeLang].sentences.length < 3 && (
                                                <div className="flex items-center space-x-3 px-3">
                                                    <div className="flex-shrink-0 w-2.5 h-2.5 rounded-full bg-indigo-500"></div>
                                                    <button onClick={(e) => addBlankSentence(e)} className="text-white px-2 py-1 bg-indigo-600 rounded text-xs">+ Add Sentence</button>
                                                </div>
                                            )}

                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full">
                                <div className="p-4 shadow rounded border border-gray-300">
                                    <div className="block">
                                        <div className="border-b border-gray-200">
                                            <nav className="flex -mb-px">
                                                <a href={void (0)} onClick={() => showCredits(0)} className={`${activeCredit === 0 ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} cursor-pointer ml-8 group inline-flex items-center py-2 px-1 border-b-2 font-medium text-sm leading-5  focus:outline-none focus:text-indigo-800 focus:border-indigo-700`} aria-current="page">
                                                    <span>News Credits</span>
                                                </a>
                                                <a href={void (0)} onClick={() => showCredits(1)} className={`${activeCredit === 1 ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} cursor-pointer ml-8 group inline-flex items-center py-2 px-1 border-b-2 font-medium text-sm leading-5 focus:outline-none focus:text-gray-700 focus:border-gray-300`}>
                                                    <span>Visual Credits</span>
                                                </a>
                                            </nav>
                                        </div>
                                        <div className="mt-4 space-y-1 max-h-24 overflow-y-scroll" role="group" aria-labelledby="teams-headline">
                                            {/* <div className="w-full flex items-center space-x-3 px-3">
                                                <div className="flex-shrink-0 w-2.5 h-2.5 rounded-full bg-indigo-500"></div>
                                                <div className="w-11/12 truncate hover:text-gray-600 text-xs">
                                                    <a href="#" target="_blank">YT: BFI</a>
                                                </div>
                                                <div className="w-1/12 text-xs text-gray-600 flex space-x-2 justify-end">
                                                    <FontAwesomeIcon className="w-5 cursor-pointer hover:text-blue-600" icon={['fas', 'edit']} />
                                                    <FontAwesomeIcon className="w-3.5 cursor-pointer hover:text-red-800" icon={['fas', 'trash-alt']} />
                                                </div>
                                            </div>
                                            <div className="w-full flex items-center space-x-3 px-3">
                                                <div className="flex-shrink-0 w-2.5 h-2.5 rounded-full bg-indigo-500"></div>
                                                <div className="w-11/12 mt-1 relative rounded-md shadow-sm flex space-x-4">
                                                    <input id="text" className="form-input block w-full text-xs sm:leading-3" placeholder="Enter Title" />
                                                    <input id="text" className="form-input block w-full text-xs sm:leading-3" placeholder="Enter URL" />
                                                </div>
                                                <div className="w-1/12 text-xs text-gray-600 flex space-x-2 justify-end">
                                                    <FontAwesomeIcon className="w-5 cursor-pointer hover:text-white rounded-full bg-gray-300 hover:bg-green-500 p-1" icon={['fas', 'check']} />
                                                    <FontAwesomeIcon className="w-3.5 cursor-pointer hover:text-red-800" icon={['fas', 'trash-alt']} />
                                                </div>
                                            </div> */}
                                            {credits[activeCredit].creditSentences.map((sentence, i) => (
                                                <>
                                                    {sentence.editable ?
                                                        <div className="w-full flex items-center space-x-3 px-3">
                                                            <div className="flex-shrink-0 w-2.5 h-2.5 rounded-full bg-indigo-500"></div>
                                                            <div className="w-11/12 mt-1 relative rounded-md shadow-sm flex space-x-4">
                                                                <input value={sentence.link_text} onChange={(e) => handleCreditSentenceChange(e, i, 'text')} className="form-input block w-full text-xs sm:leading-3" placeholder="Enter Title" />
                                                                <input value={sentence.url} onChange={(e) => handleCreditSentenceChange(e, i, 'url')} className="form-input block w-full text-xs sm:leading-3" placeholder="Enter URL" />
                                                            </div>
                                                            <div className="w-1/12 text-xs text-gray-600 flex space-x-2 justify-end">
                                                                <FontAwesomeIcon onClick={(e) => changeCreditSentenceState(e, i, 'save')} className="w-5 cursor-pointer hover:text-white rounded-full bg-gray-300 hover:bg-green-500 p-1" icon={['fas', 'check']} />
                                                                <FontAwesomeIcon onClick={(e) => changeCreditSentenceState(e, i, 'delete')} className="w-3.5 cursor-pointer hover:text-red-800" icon={['fas', 'trash-alt']} />
                                                            </div>
                                                        </div>
                                                        :
                                                        <div className="w-full flex items-center space-x-3 px-3">
                                                            <div className="flex-shrink-0 w-2.5 h-2.5 rounded-full bg-indigo-500"></div>
                                                            <div className="w-11/12 truncate hover:text-gray-600 text-xs">
                                                                <a href={sentence.url} target="_blank">{sentence.link_text}</a>
                                                            </div>
                                                            <div className="w-1/12 text-xs text-gray-600 flex space-x-2 justify-end">
                                                                <FontAwesomeIcon onClick={(e) => changeCreditSentenceState(e, i, 'edit')} className="w-5 cursor-pointer hover:text-blue-600" icon={['fas', 'edit']} />
                                                                <FontAwesomeIcon onClick={(e) => changeCreditSentenceState(e, i, 'delete')} className="w-3.5 cursor-pointer hover:text-red-800" icon={['fas', 'trash-alt']} />
                                                            </div>
                                                        </div>
                                                    }
                                                </>
                                            ))}
                                            <div className="flex items-center space-x-3 px-3">
                                                <div className="flex-shrink-0 w-2.5 h-2.5 rounded-full bg-indigo-500"></div>
                                                <button onClick={(e) => addBlankCreditSentence(e)} className="text-white px-2 py-1 bg-indigo-600 rounded text-xs capitalize">+ Add {credits[activeCredit].credit}</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute mb-4 mr-4 bottom-0 inset-x-0 flex">
                                <div className="w-full ml-4 space-x-2 flex justify-start">
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
                                    {item && categories && (
                                        <>
                                            {item.category?.length > 0 && (
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
                                <div className="w-full space-x-2 flex justify-end">
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
                            </div>
                        </div>

                        <div className="w-full md:w-1/5 relative z-10 bg-gray-100 border-l border-gray-200 p-2 rounded-lg rounded-l-none">

                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreateItem