import { useEffect, useState, useContext } from 'react';
import dynamic from 'next/dynamic'

import { ConfirmationContext } from "contexts";

import notify from 'utils/notify'
import TimeAgo from 'react-timeago'

const QuillNoSSRWrapper = dynamic(import('react-quill'), {
    ssr: false,
    loading: () => <p>Loading ...</p>,
})

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useSelector } from 'react-redux';
import { RootState } from 'rootReducer';


export enum CommentMode {
    Add = 'add',
    Edit = 'edit',
    View = 'view'
}

type Props = {
    mode: CommentMode;
    comment?: any;
    onAdd?: (text: string) => void;
    onEdit?: (text: string, commentId: string) => void;
    onRemove?: (commentId: string) => void;
    hideComments?: ()=>void;
}

const Comment = (props: Props) => {

    const {
        mode: originalMode,
        comment: originalComment,
        onAdd,
        onEdit,
        onRemove,
        hideComments
    } = props

    const confirm = useContext(ConfirmationContext)
    const { currentUser } = useSelector((state: RootState) => state.auth)
    const [mode, setMode] = useState<CommentMode>(CommentMode.Add)
    const [comment, setComment] = useState(null);
    const [body, setBody] = useState('');
    const [isLoading, setLoading] = useState(false)

    useEffect(() => {
        setMode(originalMode)
    }, [originalMode])

    useEffect(() => {
        if (mode === CommentMode.Edit) {
            setBody(comment?.text)
        }
    }, [mode])

    useEffect(() => {
        if (originalComment) {
            setComment(originalComment)
            setBody(originalComment.body)
        }
    }, [originalComment])

    const submit = async function () {

        try {

            setLoading(true)

            if (mode === CommentMode.Add) {
                await onAdd(body)
                setBody('')
            } else if (mode === CommentMode.Edit) {
                await onEdit(body, comment.id)
                setMode(CommentMode.View)
            }

        } catch (err) {
            notify('danger')
        } finally {
            setLoading(false)
        }

    }

    const remove = async function () {

        confirm({
            variant: 'danger'
        }).then(async () => {
            try {
                setLoading(true)

                await onRemove(comment.id)
            } catch (err) {
                notify('danger')
            } finally {
                setLoading(false)
            }
        })

    }

    return (
        <div className="w-full flex">
            <div className="w-auto mt-2 flex z-10">
                <span className="inline-flex items-center justify-center h-14 w-14 border-4 border-white rounded-full sfd-btn-primary">
                    <span className="text-lg font-medium leading-none text-white">{mode === 'view' ? comment?.user.first_name.charAt(0) + comment?.user.last_name.charAt(0) : currentUser.first_name.charAt(0) + currentUser.last_name.charAt(0)}</span>
                </span>
            </div>
            <div className={([CommentMode.Add, CommentMode.Edit].includes(mode) && !isLoading ? 'bg-white' : 'bg-gray-100') + ' w-full -ml-2  px-2 py-0.5 rounded-2xl'}>
                {isLoading && (
                    <div className="box-border p-4">
                        <div className="flex flex-row text-grey justify-center items-center">
                            <FontAwesomeIcon className="w-12 h-12 p-2 rounded-full" icon={['fas', 'spinner']} spin />
                            <p>Loading...</p>
                        </div>
                    </div>
                )}
                {!isLoading && mode === CommentMode.View &&
                    <>
                        <div className="flex flex-row p-2">
                            <div>
                                <span className="text-base font-bold text-gray-800">{comment?.user.first_name} {comment?.user.last_name}, </span>
                                <span className="text-base text-gray-600">{comment?.user.job_title}</span>
                            </div>
                            <div className="flex-grow"></div>
                            <div data-id="action" className="text-sm text-gray-600 flex justify-end space-x-2">
                                <span><TimeAgo date={comment?.created_at} /></span>

                                {currentUser.email === comment?.user.email && (
                                    <>
                                        <span className="inline-flex rounded-md shadow-sm">
                                            <button
                                                onClick={() => setMode(CommentMode.Edit)}
                                                className="px-2 py-1 bg-white hover:bg-grey-50 text-black rounded text-xs cursor-pointer flex items-center"
                                            >
                                                <FontAwesomeIcon className="w-3 mr-2" icon={['fas', 'pencil-alt']} />
                                                <span>Edit</span>
                                            </button>
                                        </span>

                                        <span className="inline-flex rounded-md shadow-sm">
                                            <button
                                                onClick={() => remove()}
                                                className="px-2 py-1 bg-red-500 hover:bg-red-700 text-white rounded text-xs cursor-pointer flex items-center"
                                            >
                                                <FontAwesomeIcon className="w-3 mr-2" icon={['fas', 'trash-alt']} />
                                                <span>Delete</span>
                                            </button>
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="wysiwyg w-full space-y-1 px-2 pr-5 pb-4">
                            <div>
                                <span style={{
                                    overflowWrap: 'break-word',
                                    wordWrap: 'break-word',
                                    hyphens: 'auto'
                                }} className="text-base text-gray-600" dangerouslySetInnerHTML={{ __html: comment?.text }} ></span>
                            </div>
                        </div>
                    </>
                }
                {!isLoading && [CommentMode.Add, CommentMode.Edit].includes(mode) &&
                    <div className="w-full">
                        <div className="w-full bg-white p-2">
                            <QuillNoSSRWrapper theme="snow" value={body} onChange={setBody} />
                            <div className="flex space-x-2 justify-end mt-2">
                                <button onClick={() => mode === CommentMode.Add ? hideComments() : setMode(CommentMode.View)} className="btn btn-default">Cancel</button>
                                <button onClick={submit} className="btn btn-green">Submit</button>
                            </div>
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}

export default Comment