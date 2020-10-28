import { config as f_config, library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { useCallback, useContext, useEffect, useState } from 'react';
import { LayoutContext } from '../../contexts';
import Editor from './Editor';

f_config.autoAddCss = false;
library.add(fas, fab);
const Comment = (props) => {
    const { setLoading, appUserInfo } = useContext(LayoutContext);
    const [comment, setComment] = useState(null);
    const [type, setType] = useState('view');
    const [isTrix, setIsTrix] = useState(false);
    const [body, setBody] = useState('');

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

    const escFunction = useCallback((event) => {
        if (event.keyCode === 27) {
            setIsTrix(false);
        }
        if (event.keyCode === 13) {
            //reply();
            event.preventDefault();
        }
    }, []);

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
                        <div className="w-full text-sm text-gray-600 flex justify-end space-x-2">
                            <span>{comment?.created}</span>
                            <FontAwesomeIcon className="w-5 text-gray-600 cursor-pointer" icon={['fas', 'ellipsis-h']} />
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