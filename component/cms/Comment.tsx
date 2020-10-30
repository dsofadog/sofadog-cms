import { config as f_config, library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import dynamic from "next/dynamic";
import { LayoutContext } from '../../contexts';
//import Editor from './Editor';

f_config.autoAddCss = false;
library.add(fas, fab);

const Editor = dynamic(
    () => {
        return import("./Editor");
    },
    { ssr: false }
);

const Comment = (props) => {
    const { setLoading, appUserInfo } = useContext(LayoutContext);
    const [comment, setComment] = useState(null);
    const [type, setType] = useState('view');
    const [isTrix, setIsTrix] = useState(false);
    const [body, setBody] = useState('');
    const [openActionDropdown, setOpenActionDropdown] = useState(false);
    const toggleActionDropdown = () => { setOpenActionDropdown(!openActionDropdown) };
    const actionWrapperRef = useRef(null);
    useOutsideAlerter(actionWrapperRef);

    useEffect(() => {
        if (props.comment) {
            setComment(props.comment);
        }
        if (props.type) {
            setType(props.type);
        }
    }, [props]);

    useEffect(() => {
        document.addEventListener("keydown", escFunction, false);
        return () => {
            document.removeEventListener("keydown", escFunction, false);
        };
    });

    function useOutsideAlerter(ref) {
        useEffect(() => {
            function handleClickOutside(event) {

                if (ref.current && !ref.current.contains(event.target)) {
                    if (ref.current.dataset.id === "action") {
                        setOpenActionDropdown(false);
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

    const escFunction = useCallback((event) => {
        if (event.keyCode === 27) {
            setIsTrix(false);
        }
        if (event.keyCode === 13) {
            //reply();
            event.preventDefault();
        }
    }, []);

    function submitComment() {
        console.log("comment body:", body);
    }

    

    return (
        <div className="w-full flex">
            <div className="w-auto mt-2 flex z-10">
                <span className="inline-flex items-center justify-center h-14 w-14 border-4 border-white rounded-full sfd-btn-primary">
                    <span className="text-lg font-medium leading-none text-white">{type === 'view' ? comment?.first_name.charAt(0) + comment?.last_name.charAt(0) : appUserInfo?.displayName}</span>
                </span>
            </div>
            <div className="w-full -ml-2 bg-gray-100 px-2 py-0.5 rounded-2xl">
                {type === 'view' ?
                    <>
                        <div ref={actionWrapperRef} data-id="action" className="relative w-full text-sm text-gray-600 flex justify-end space-x-2">
                            <span>{comment?.created}</span>
                            <FontAwesomeIcon onClick={() => toggleActionDropdown()} className="w-5 text-gray-600 cursor-pointer" icon={['fas', 'ellipsis-h']} />
                            {openActionDropdown && (
                                <div className="origin-top-left absolute right-0 mt-5 w-40 rounded-md shadow-lg z-20">
                                    <div className="rounded-md bg-blue-600 shadow-xs">
                                        <div className="" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                                            <a href={void (0)} className="flex space-x-2 rounded-t-md cursor-pointer block px-4 py-1 text-sm font-semibold leading-5 text-white hover:bg-blue-700 focus:outline-none" role="menuitem">
                                                <FontAwesomeIcon className="w-3" icon={['fas', 'pencil-alt']} />
                                                <span>Edit</span>
                                            </a>
                                            <a href={void (0)} className="flex space-x-2 rounded-b-md cursor-pointer block px-4 py-1 text-sm font-semibold leading-5 text-white hover:bg-blue-700 focus:outline-none" role="menuitem">
                                                <FontAwesomeIcon className="w-3" icon={['fas', 'trash-alt']} />
                                                <span>Delete</span>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="w-full space-y-1 px-2 pb-4">
                            <div>
                                <span className="text-base font-bold text-gray-800">{comment?.first_name} {comment?.last_name}, </span>
                                <span className="text-base text-gray-600">{comment?.job_title}</span>
                            </div>
                            <div>
                                <span className="text-base text-gray-600">{comment?.text}</span>
                            </div>
                        </div>
                    </>
                    :
                    <div className="w-full px-2 py-4">
                        {isTrix ?
                            <div className="w-full bg-white p-2 border rounded">
                                <Editor value={body} onChange={setBody} />
                                <button onClick={submitComment} className="px-2 py-1 bg-green-500 text-white text-sm mt-2 rounded">Add this comment</button>
                            </div>
                            :
                            <input onClick={() => setIsTrix(true)} className="form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5" placeholder="Add a comment or upload a file..." />
                        }
                    </div>
                }
            </div>
        </div>
    )
}

export default Comment