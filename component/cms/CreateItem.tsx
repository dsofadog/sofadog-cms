import { useEffect, useState, useContext, useRef } from "react";

import { config as f_config, library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';

import { LayoutContext } from 'contexts';
import CmsConstant from 'utils/cms-constant';
import HttpCms from 'utils/http-cms';
import DescriptionInputs from './DescriptionInputs';


f_config.autoAddCss = false;
library.add(fas, fab, far);

const CreateItem = (props) => {
   
    //const categories = CmsConstant.Category;
    const tags = CmsConstant.Tags;
    const [categories, setCotegories] = useState(null);
    const [openTagDropdown, setOpenTagDropdown] = useState(false);
    const toggleTagDropdown = () => { setOpenTagDropdown(!openTagDropdown) };

    const [openFeedDropdown, setOpenFeedDropdown] = useState(false);
    const toggleFeedDropdown = () => { setOpenFeedDropdown(!openFeedDropdown) };

    const [openCategoryDropdown, setOpenCategoryDropdown] = useState(false);
    const toggleCateDropdown = () => { setOpenCategoryDropdown(!openCategoryDropdown) };
    const { setLoading, appUserInfo,currentUserPermission } = useContext(LayoutContext);
    const [item, setItem] = useState(null);
    const [selectedTag, setSelectedTag] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [activeLang, setActiveLang] = useState(0);
    const [activeCredit, setActiveCredit] = useState(0);
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [formproceed, setFormproceed] = useState(false);
    const [selectedFeed,setSelectedFeed] = useState(null);
    const [feeds,setFeeds] = useState(null);
    const blankSentence = { sentence: "", editable: true, error: false }
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

    const blankCreditSentence = { link_text: "", url: "", editable: true, error: false }
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

    const catWrapperRef = useRef(null);
    const feedWrapperRef = useRef(null);
    const tagWrapperRef = useRef(null);
    useOutsideAlerter(catWrapperRef);
    useOutsideAlerter(tagWrapperRef);
    useOutsideAlerter(feedWrapperRef);

    useEffect(() => {
        getFeeds();
        if (props.state === 'edit') {
            clearData();
            console.log("In update item: ", props.data);
            console.log("categories: ", categories);
            let data = props.data;
            setItem({
                title: data.title,
                category: data.category
            });
            setSelectedCategory(data.category);
            setSelectedFeed(data.feed_id);
            if (data.tags.length > 0) {
                setSelectedTag(data.tags);
            }
            if (data.news_credits.length > 0) {
                const c = credits;
                data.news_credits.map((news, i) => {
                    //console.log("news: ",news);
                    c[0].creditSentences.push({ link_text: news.link_text, url: news.url, editable: false });
                    setCredits(c);
                });
            }
            if (data.visual_credits.length > 0) {
                const c = credits;
                data.visual_credits.map((visual, i) => {
                    //console.log("visual: ",visual);
                    c[1].creditSentences.push({ link_text: visual.link_text, url: visual.url, editable: false });
                    setCredits(c);
                });
            }
            if (data.descriptions.length > 0) {
                data.descriptions.map((description, i) => {
                    //console.log("description: ", description);
                    if (description.language === 'english') {
                        const d = descriptions;
                        if (description.sentences.length > 0) {
                            description.sentences.map(sentence => {
                                d[0].sentences.push({
                                    sentence: sentence,
                                    editable: false
                                })
                            });
                        }
                        setDescriptions(d);
                    }
                    if (description.language === 'estonian') {
                        const d = descriptions;
                        if (description.sentences.length > 0) {
                            description.sentences.map(sentence => {
                                d[1].sentences.push({
                                    sentence: sentence,
                                    editable: false
                                })
                            });
                        }
                        setDescriptions(d);
                    }
                });
            }

        }
    }, [props.state]);

    useEffect(()=>{
        if(props.state === 'edit'){
            let i = feeds?.findIndex(x => x.id === props?.data.feed_id);
            if(i >= 0){
                handleClickSingleDropdownFeed(feeds[i]);
            }
             
        }
    },[feeds])
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

    function clearData() {
        setItem(null);
        setSelectedTag([]);
        setSelectedCategory(null);
        setSelectedFeed(null);
        setDescriptions([{ language: "english", sentences: [] }, { language: "estonian", sentences: [] }]);
        setCredits([{ credit: "News Credits", creditSentences: [] }, { credit: "Visual Credits", creditSentences: [] }]);
    }

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
        if (e.target.value != "" && e.target.value != null) {
            d[activeLang].sentences[i].error = false;
        }

        setDescriptions(d);
    }

    function changeSentenceState(e, i, state) {
        e.preventDefault();
        const d = [...descriptions];
        if (state === 'edit') {
            d[activeLang].sentences[i].editable = true;
        } else if (state === 'save') {
            console.log(d[activeLang].sentences[i].sentence, "asdsa");
            if (d[activeLang].sentences[i].sentence == "") {
                alert("you can't save empty value");
            } else {
                d[activeLang].sentences[i].editable = false;
            }

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

            if (c[activeCredit].creditSentences[i].link_text == "") {
                alert("you can't save empty value");
            } else {
                c[activeCredit].creditSentences[i].editable = false;
            }

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
            category: `${cat.number}`
        });
        setSelectedCategory(cat.number);
        toggleCateDropdown();
    }

    function clearCategory() {
        setItem({
            ...item,
            category: null
        });
        setSelectedCategory(null);
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
        toggleTagDropdown();
    }

    function clearTag(tag) {
        setSelectedTag(selectedTag.filter(item => item !== tag));
        setItem({
            ...item,
            tags: selectedTag
        });
    }


    function handleClickSingleDropdownFeed(feed) {
        console.log("selected feed",feed.id)
        
        setItem({
            ...item,
            feed_id: feed.id
        });
        console.log("items",item)
        setSelectedFeed(feed.id);
        console.log("cate ",feed.categories);
        setCotegories(feed.categories);
        setOpenFeedDropdown(false);
    }

    function clearFeeds() {
        setItem({
            ...item,
             feed_id: null
        });
        setSelectedFeed(null);
    }

    function showSentences(i) {
        setActiveLang(i);
    }

    function showCredits(i) {
        setActiveCredit(i);
    }

    function descriptionValidation(): Boolean {
        if (descriptions) {
            let d = [];
            descriptions.map(description => {
                if (description.sentences.length > 0) {
                    let lang = description.language;
                    let sent = [];
                    description.sentences.map(sentence => {
                        if (sentence.sentence == "") {
                            sentence.error = true;
                            return false;
                        }
                    });


                }
            })
        }
        return true;
    }

    function creditVisualValidation(): Boolean {
        if (credits) {
            credits.map((credit, i) => {
                if (i === 0) {
                    credit.creditSentences.map(sentence => {
                        // if(sentence.url==""){
                        //     sentence.error = true;
                        //  }
                        if (sentence.link_text == "") {
                            sentence.error = true;
                            return false;
                        }



                    });
                } else if (i === 1) {
                    credit.creditSentences.map(sentence => {
                        // if(sentence.url==""){
                        //     sentence.error = true;
                        //  }
                        if (sentence.link_text == "") {
                            sentence.error = true;
                            return false;
                        }


                    });
                }
            });

            return true;

        }


    }

    function categoryValidation(): Boolean {
      
        //console.log(item?.category);
        //console.log(selectedTag);
        if (selectedCategory === null) {
            return false;
        } else {
            return true;
        }

    }

    function tagValidation() {
        if (selectedTag.length == 0) {
            return false;
        }
    }

    function validationData() {
        setFormSubmitted(true);
        let desc = descriptionValidation();
        let credit = creditVisualValidation();
        let category = categoryValidation();
        if (desc && credit && category && item?.title != undefined) {
            return true;
        } else {
            return false
        }
        // tagValidation();

    }

    function apicallForServer() {
        let newItem = {
            title: item?.title,
            category: selectedCategory,
            descriptions: [],
            news_credits: [],
            visual_credits: [],
            tags: selectedTag,
            feed_id:item?.feed_id
        }

        if (descriptions) {
            let d = [];
            descriptions.map(description => {
                if (description.sentences.length > 0) {
                    let lang = description.language;
                    let sent = [];
                    description.sentences.map(sentence => {
                        sent.push(sentence.sentence);
                    });
                    d.push({
                        language: lang,
                        sentences: sent
                    })
                }
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
        if (props.state === 'edit') {
            //newItem.id = props.data.id;
            props.update(newItem);
        } else {
            props.create(newItem);
        }
    }


    function getFeeds(){
       
            //setLoading(true);
            HttpCms.get("/feeds?token="+appUserInfo?.token)
            .then((response) => {
                console.log("response: ",response.data);
                setFeeds(response.data.feeds)
            })
            .catch((e) => {
                console.log(e);
            })
            .finally(() => {
                setLoading(false);
            });
 
    }

    function saveData() {
        console.log("items on submit :- ",item);
        //console.log(selectedTag);
        let conditionMatch = validationData();
        if (conditionMatch) {
            apicallForServer();
        }
    }
    
    function getFeedName() {
        console.log("getFeedName: ",selectedFeed);
        let i = feeds.findIndex(x => x.id === selectedFeed);
        if (i >= 0) {
            return feeds[i].name ? feeds[i].name : feeds[i].id;
        }
    }
    function getColorCode(){

        if(categories != null){
           
            let i = categories?.findIndex(c => c.number === selectedCategory);
            console.log("categories:-- ",i);
            if(i >= 0){
               
                return categories[i].hex ? categories[i].hex : '#e5e7eb';
            }else{
                return '#e5e7eb';
            }
        }else{
            return '#e5e7eb';
        }
       
    }
    function getCategoryName(){
        if(categories != null){
            let i = categories?.findIndex(c => c.number === selectedCategory);
            if(i >= 0){
                return categories[i].title ? categories[i].title : '';
            }else{
                return '';
            }
        }else{
            return '';
        }
       
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
                    {/* ${item?.category != undefined ? categories[item?.category].color : 'gray-200'} */}
                        <div style={{borderColor: getColorCode()}}className={`border relative w-full h-full md:w-4/5 px-4 py-2 bg-white rounded-l-lg border-l-8`}>
                            <div className="py-2">
                                <div className="w-full flex justify-end space-x-2">
                                    <button onClick={() => saveData()} className="px-2 py-1 bg-green-500 text-white rounded text-xs cursor-pointer">{props.state === 'edit' ? 'Update ' : 'Save '} Data</button>
                                    <button onClick={() => props.close(false)} className="px-2 py-1 bg-blue-500 text-white rounded text-xs cursor-pointer">Cancel</button>
                                </div>
                            </div>
                            <div className="flex items-center mb-4">
                                <div className="w-full">
                                    <label htmlFor="about" className="block text-sm font-medium leading-5 text-gray-700">Title</label>
                                    <div className="mt-1 rounded-md shadow-sm">
                                        <textarea id="about" value={item?.title} rows={2} onChange={(e) => handleChangeInput(e)} className={`${item?.title == undefined && formSubmitted ? 'border-red-500 text-red-600' : ''} form-textarea block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5 `} placeholder="Enter Title"></textarea>
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
                                        <div className="mt-4 space-y-1 max-h-24 overflow-y-scroll" role="group" aria-labelledby="teams-headline">
                                            {descriptions[activeLang].sentences.map((sentence, i) => (
                                                <>
                                                    {sentence.editable ?
                                                        <div className="w-full flex items-center space-x-3 px-3">
                                                            <div className="flex-shrink-0 w-2.5 h-2.5 rounded-full bg-indigo-500"></div>
                                                            <div className="w-11/12 mt-1 relative rounded-md shadow-sm">

                                                                <input value={sentence.sentence} onChange={(e) => handleSentenceChange(e, i)} className={`${sentence.error ? 'border-red-500 text-red600' : ' '} form-input block w-full text-xs sm:leading-3 `} placeholder="Enter sentence" />
                                                            </div>
                                                            <div className="w-1/12 text-xs text-gray-600 flex items-center space-x-2 justify-end">
                                                                <FontAwesomeIcon onClick={(e) => changeSentenceState(e, i, 'save')} className="w-5 h-5 cursor-pointer hover:text-white rounded-full bg-gray-300 hover:bg-green-500 p-1" icon={['fas', 'check']} />
                                                                <FontAwesomeIcon onClick={(e) => changeSentenceState(e, i, 'delete')} className="w-3.5 h-3.5 cursor-pointer hover:text-red-800" icon={['fas', 'trash-alt']} />
                                                            </div>
                                                        </div>
                                                        :
                                                        <div className="w-full flex items-center space-x-3 px-3">
                                                            <div className="flex-shrink-0 w-2.5 h-2.5 rounded-full bg-indigo-500"></div>
                                                            <div className="w-11/12 truncate hover:text-gray-600 text-xs">
                                                                <span>{sentence.sentence}</span>
                                                            </div>
                                                            <div className="w-1/12 text-xs text-gray-600 flex items-center space-x-2 justify-end">
                                                                <FontAwesomeIcon onClick={(e) => changeSentenceState(e, i, 'edit')} className="w-5 h-5 cursor-pointer hover:text-blue-600" icon={['fas', 'edit']} />
                                                                <FontAwesomeIcon onClick={(e) => changeSentenceState(e, i, 'delete')} className="w-3.5 h-3.5 cursor-pointer hover:text-red-800" icon={['fas', 'trash-alt']} />
                                                            </div>
                                                        </div>
                                                    }
                                                </>
                                            ))}

                                            {descriptions[activeLang].sentences.length < 8 && (
                                                <div className="flex items-center space-x-3 px-3">
                                                    <div className="flex-shrink-0 w-2.5 h-2.5 rounded-full bg-indigo-500"></div>
                                                    <button onClick={(e) => addBlankSentence(e)} className="text-white px-2 py-1 bg-indigo-600 rounded text-xs">+ Add Sentence</button>
                                                </div>
                                            )}

                                            {(descriptions[0].sentences.length == 0 && descriptions[1].sentences.length == 0) && formSubmitted && (
                                                <div className="flex items-center space-x-3 px-3">
                                                    <div className="flex-shrink-0 items-center rounded-full text-base text-red-600">*</div>
                                                    <span className="text-red-600 text-xs capitalize">Please add at least one sentence</span>
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
                                            {credits[activeCredit].creditSentences.map((sentence, i) => (
                                                <>
                                                    {sentence.editable ?
                                                        <div className="w-full flex items-center space-x-3 px-3">
                                                            <div className="flex-shrink-0 w-2.5 h-2.5 rounded-full bg-indigo-500"></div>
                                                            <div className="w-11/12 mt-1 relative rounded-md shadow-sm flex space-x-4">
                                                                <input value={sentence.link_text} onChange={(e) => handleCreditSentenceChange(e, i, 'text')} className={`${sentence.link_text == "" && formSubmitted ? 'border-red-500 text-red600' : ' '} form-input block w-full text-xs sm:leading-3 `} placeholder="Enter Title" />
                                                                <input value={sentence.url} onChange={(e) => handleCreditSentenceChange(e, i, 'url')} className={`${sentence.url == "" && formSubmitted ? '' : ' '} form-input block w-full text-xs sm:leading-3 `} placeholder="Enter URL" />
                                                            </div>
                                                            <div className="w-1/12 text-xs text-gray-600 flex items-center space-x-2 justify-end">
                                                                <FontAwesomeIcon onClick={(e) => changeCreditSentenceState(e, i, 'save')} className="w-5 h-5 cursor-pointer hover:text-white rounded-full bg-gray-300 hover:bg-green-500 p-1" icon={['fas', 'check']} />
                                                                <FontAwesomeIcon onClick={(e) => changeCreditSentenceState(e, i, 'delete')} className="w-3.5 h-3.5 cursor-pointer hover:text-red-800" icon={['fas', 'trash-alt']} />
                                                            </div>
                                                        </div>
                                                        :
                                                        <div className="w-full flex items-center space-x-3 px-3">
                                                            <div className="flex-shrink-0 w-2.5 h-2.5 rounded-full bg-indigo-500"></div>
                                                            <div className="w-11/12 truncate hover:text-gray-600 text-xs">
                                                                <a href={sentence.url} target="_blank">{sentence.link_text}</a>
                                                            </div>
                                                            <div className="w-1/12 text-xs text-gray-600 flex items-center space-x-2 justify-end">
                                                                <FontAwesomeIcon onClick={(e) => changeCreditSentenceState(e, i, 'edit')} className="w-5 h-5 cursor-pointer hover:text-blue-600" icon={['fas', 'edit']} />
                                                                <FontAwesomeIcon onClick={(e) => changeCreditSentenceState(e, i, 'delete')} className="w-3.5 h-3.5 cursor-pointer hover:text-red-800" icon={['fas', 'trash-alt']} />
                                                            </div>
                                                        </div>
                                                    }
                                                </>
                                            ))}
                                            <div className="flex items-center space-x-3 px-3">
                                                <div className="flex-shrink-0 w-2.5 h-2.5 rounded-full bg-indigo-500"></div>
                                                <button onClick={(e) => addBlankCreditSentence(e)} className="text-white px-2 py-1 bg-indigo-600 rounded text-xs capitalize">+ Add {credits[activeCredit].credit}</button>
                                            </div>
                                            {(credits[0].creditSentences.length == 0 && credits[1].creditSentences.length == 0) && formSubmitted && (
                                                <div className="flex items-center space-x-3 px-3">
                                                    <div className="flex-shrink-0 items-center rounded-full text-base text-red-600">*</div>
                                                    <span className="text-red-600 text-xs capitalize">Please add at least one credit</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute mb-4 mr-4 bottom-0 inset-x-0 flex">
                            <div className="w-full ml-4 space-x-2 flex justify-start">
                                    <div ref={feedWrapperRef} data-id="feed" className="relative inline-block text-left">
                                        <div>
                                            {feeds && (
                                                <span onClick={toggleFeedDropdown} className="rounded-md shadow-sm">
                                                    <button type="button" className={`${(selectedFeed === null) && formSubmitted ? 'border-red-500 text-red-600' : 'border-transparent '} inline-flex justify-center w-full rounded-md border border-gray-300 px-2 py-0.5 bg-white text-xs leading-5 font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800 transition ease-in-out duration-150`}
                                                        id="options-menu" aria-haspopup="true" aria-expanded="true">
                                                        Choose Feed
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
                                                            <a key={i} href={void (0)} onClick={() => handleClickSingleDropdownFeed(feed)} className="cursor-pointer block px-4 py-1 text-xs leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900" role="menuitem">
                                                                {feed.name}
                                                            </a>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {feeds && (
                                        <>
                                            {selectedFeed != null && (
                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium leading-4 bg-blue-100 text-blue-800">
                                                    {getFeedName()}
                                                    <button onClick={() => clearFeeds()} type="button" className="flex-shrink-0 ml-1.5 inline-flex text-indigo-500 focus:outline-none focus:text-indigo-700" aria-label="Remove small badge">
                                                        <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                                                            <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
                                                        </svg>
                                                    </button>
                                                </span>
                                            )}
                                        </>

                                    )}
                                </div>
                                <div className="w-full ml-4 space-x-2 flex justify-start">
                                    <div ref={catWrapperRef} data-id="category" className="relative inline-block text-left">
                                        <div>
                                            {categories && (
                                                <span onClick={toggleCateDropdown} className="rounded-md shadow-sm">
                                                    <button type="button" className={`${(selectedCategory === null) && formSubmitted ? 'border-red-500 text-red-600' : 'border-transparent '} inline-flex justify-center w-full rounded-md border border-gray-300 px-2 py-0.5 bg-white text-xs leading-5 font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800 transition ease-in-out duration-150`}
                                                        id="options-menu" aria-haspopup="true" aria-expanded="true">
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
                                                                {cat.title}
                                                            </a>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {categories && (
                                        <>
                                            {item?.category != null && (
                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium leading-4 bg-blue-100 text-blue-800">
                                                    {getCategoryName()}
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

                                


                                <div className="w-full space-x-2 flex justify-end z-50">
                                    <div ref={tagWrapperRef} data-id="tag" className="relative inline-block text-left">
                                        <div>
                                            <span onClick={toggleTagDropdown} className="rounded-md shadow-sm">
                                                <button type="button" className={`${selectedTag.length == 0 && formSubmitted ? '' : ' '} inline-flex justify-center w-full rounded-md border border-gray-300 px-2 py-0.5 bg-white text-xs leading-5 font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800 transition ease-in-out duration-150`}

                                                    id="options-menu" aria-haspopup="true" aria-expanded="true">
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

                        <div style={{backgroundColor: getColorCode()}} className={`w-full md:w-1/5 relative z-10 rounded-lg rounded-l-none`}>

                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreateItem