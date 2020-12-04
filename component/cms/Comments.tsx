import React, { useState, useContext, useEffect } from 'react';

import { config as f_config, library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';

import Comment, { CommentMode } from './Comment';
import { LayoutContext } from 'contexts';
import httpCms from 'utils/http-cms';

f_config.autoAddCss = false;
library.add(fas, fab);

type Props = {
    newsItem: any
}

const Comments = (props: Props) => {

    const { newsItem } = props


    const { appUserInfo } = useContext(LayoutContext);
    const [comments, setComments] = useState([])


    useEffect(() => {
        setComments(newsItem.comments)
    }, [newsItem])


    const add = async function (text: string) {
        const url = `/news_items/${newsItem.id}/comments?token=${appUserInfo?.token}`
        const payload = { text }
        const res = await httpCms.post(url, payload)

        setComments(res.data.comments)
    }

    const edit = async function (text: string, commentId: string) {
        const url = `/news_items/${newsItem.id}/comments/${commentId}?token=${appUserInfo?.token}`
        const payload = { text }
        const res = await httpCms.patch(url, payload)

        setComments(res.data.comments)
    }

    const remove = async function (commentId: string) {
        const url = `/news_items/${newsItem.id}/comments/${commentId}?token=${appUserInfo?.token}`
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