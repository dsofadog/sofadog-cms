import React, { useState, useEffect } from 'react';

import Comment, { CommentMode } from './Comment';
import httpCms from 'utils/http-cms';

import tokenManager from 'utils/token-manager'

type Props = {
    newsItem: any
}

const Comments = (props: Props) => {

    const { newsItem } = props

    const [comments, setComments] = useState([])

    useEffect(() => {
        setComments(newsItem.comments)
    }, [newsItem])


    const add = async function (text: string) {
        const url = tokenManager.attachToken(`/news_items/${newsItem.id}/comments`)
        const payload = { text }
        const res = await httpCms.post(url, payload)

        setComments(res.data.comments)
    }

    const edit = async function (text: string, commentId: string) {
        const url = tokenManager.attachToken(`/news_items/${newsItem.id}/comments/${commentId}`)
        const payload = { text }
        const res = await httpCms.patch(url, payload)

        setComments(res.data.comments)
    }

    const remove = async function (commentId: string) {
        const url = tokenManager.attachToken(`/news_items/${newsItem.id}/comments/${commentId}`)
        const res = await httpCms.delete(url)
        
        setComments(res.data.comments)
    }


    return (
        <>
            <div className="w-full py-5">
                <div className="w-full mb-10 space-y-4">
                    {comments?.map((comment, i) => (
                        <Comment mode={CommentMode.View} comment={comment} onEdit={edit} onRemove={remove} />
                    ))}
                    <Comment mode={CommentMode.Add} onAdd={add} />
                </div>
            </div>
        </>
    )
}

export default Comments