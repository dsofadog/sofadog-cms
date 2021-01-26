import React, { useState, useEffect } from 'react';

import Comment, { CommentMode } from './Comment';

import { useDispatch } from 'react-redux';
import { addComment, updateComment, removeComment } from 'features/news-item/slices/news-item.slice';

type Props = {
    newsItem: any;
    hideComments: () => void
}

const Comments = (props: Props) => {

    const { newsItem, hideComments } = props

    const dispatch = useDispatch()
    const [addCommentVisibility, setAddCommentVisibility] = useState<boolean>(true)

    useEffect(() => {
        const toggleAddComment = () => {
            setAddCommentVisibility(false)
            setTimeout(() => setAddCommentVisibility(true), 100)
        }
        toggleAddComment()
    }, [newsItem.comments])

    return (
        <>
            <div className="w-full py-5">
                <div className="w-full mb-10 space-y-4">
                    {newsItem.comments?.map((comment, i) => (
                        <Comment
                            key={comment.id}
                            mode={CommentMode.View}
                            comment={comment}
                            onEdit={(text: string, commentId: string) => {
                                dispatch(updateComment(newsItem.id, commentId, text))
                            }}
                            onRemove={(commentId: string) => {
                                dispatch(removeComment(newsItem.id, commentId))
                            }}
                        />
                    ))}
                    {addCommentVisibility && (
                        <Comment
                            hideComments={hideComments}
                            mode={CommentMode.Add}
                            onAdd={(text: string) => {
                                dispatch(addComment(newsItem.id, text))
                            }} />
                    )}
                </div>
            </div>
        </>
    )
}

export default Comments