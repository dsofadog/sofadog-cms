import Link from "next/link"
import Tippy from '@tippyjs/react';
import moment from 'moment'

type Props = {
    newsItem: any
}

const NewsItemHeaderSection = (props: Props) => {
    const { newsItem } = props
    return (
        <div>
            <h2 className="text-sm text-gray-800 font-medium mr-auto">
                <Link href={`/cms?id=${newsItem?.id}`}>
                    <a>{newsItem?.title}</a>
                </Link>
            </h2>
            <small className="text-gray-400">
                <span className="mr-1">
                    <Tippy content="Created at">
                        <abbr title="">C</abbr>
                    </Tippy>: {moment.unix(newsItem?.created_at).format('lll')}
                </span>
                {newsItem?.due_date && (<span className="mr-1">
                    <Tippy content="Due date">
                        <abbr title="">D</abbr>
                    </Tippy>: {moment(newsItem?.due_date).format('lll')}
                </span>)}
                {newsItem?.enqueued_at && (<span className="mr-1">
                    <Tippy content="Enqueued date">
                        <abbr title="">E</abbr>
                    </Tippy>: {moment(newsItem?.enqueued_at).format('lll')}
                </span>)}
            </small>
            {newsItem?.tags.length > 0 && <div className="mt-1 mr-2">
                <div className="w-full space-x-2 flex">
                    {newsItem?.tags.map(tag => (
                        <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium leading-4 bg-blue-100 text-blue-800">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>}
        </div>
    )
}

export default NewsItemHeaderSection