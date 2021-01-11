import Link from "next/link"
import Tippy from '@tippyjs/react';
import moment from 'moment'

type Props = {
    newsItem: any;
    compressed?: boolean;
}

const NewsItemHeaderSection = (props: Props) => {
    const { newsItem, compressed } = props
    return (
        <div>
            {compressed && <h2 className="text-sm text-gray-800 font-medium mr-auto">
                <Link href={`/cms?id=${newsItem?.id}`}>
                    <a>{newsItem?.title}</a>
                </Link>
            </h2>}


            {!compressed && <h2>
                <Link href={`/cms?id=${newsItem?.id}`}>
                    <a className="mt-2 block text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                        {newsItem?.title}
                    </a>
                </Link>
            </h2>
            }

            <small className="text-gray-400">
                <span className="mr-1">
                    {compressed ? <Tippy content="Created date">
                        <abbr title="">C</abbr>
                    </Tippy> : 'Created date'}
                    : {moment.unix(newsItem?.created_at).format('lll')}
                </span>
                {newsItem?.due_date && <span>| </span>}
                {newsItem?.due_date && (<span className="mr-1">
                    {compressed ? <Tippy content="Due date">
                        <abbr title="">D</abbr>
                    </Tippy> : 'Due date'}
                    : {moment(newsItem?.due_date).format('lll')}
                </span>)}
                {newsItem?.enqueued_at && <span>| </span>}
                {newsItem?.enqueued_at && (<span className="mr-1">
                    {compressed ? <Tippy content="Enqueued date">
                        <abbr title="">E</abbr>
                    </Tippy> : 'Enqueued date'}
                    : {moment(newsItem?.enqueued_at).format('lll')}
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