import _ from 'lodash'
import { useEffect, useState } from 'react'
import Tippy from '@tippyjs/react'

export enum Status {
    New = 'new',
    AwaitingReviewByLeadJournalist = 'awaiting_review_by_lead_journalist',
    AwaitingVideoUpload = 'awaiting_video_upload',
    AwaitingReviewByLeadVideoEditor = 'awaiting_review_by_lead_video_editor',
    ReadyForPush = 'ready_for_push',
    PushedToFeed = 'pushed_to_feed',
    RemoveFromFeed = 'removed_from_feed',
    Transcoding = 'transcoding'
}
type Props = {
    name: Status;
}

const StatusBadge = (props: Props) => {

    const { name } = props

    const [bgcColor, setBgcColor] = useState<string>(null)
    useEffect(() => {
        let bgc: string;
        switch (name) {
            case Status.New:
                bgc = 'gray-100'
                break
            case Status.AwaitingReviewByLeadJournalist:
                bgc = 'yellow-100'
                break
            case Status.AwaitingVideoUpload:
                bgc = 'green-100'
                break
            case Status.Transcoding:
                bgc = 'blue-100'
                break
            case Status.AwaitingReviewByLeadVideoEditor:
                bgc = 'purple-100'
                break
            case Status.ReadyForPush:
                bgc = 'yellow-400'
                break
            case Status.RemoveFromFeed:
                bgc = 'red-400'
                break
            case Status.PushedToFeed:
                bgc = 'green-400'

        }

        setBgcColor(bgc)
    }, [name])


    function renderName(name: Status) {
        if (name === Status.AwaitingReviewByLeadJournalist) {
            return <span>
                <span className="mr-1">Awaiting review by</span>
                <Tippy content="Lead Journalist">
                    <abbr title="">LJ.</abbr>
                </Tippy>
            </span>
        } else if (name === Status.AwaitingReviewByLeadVideoEditor) {
            return <span>
                <span className="mr-1">Awaiting review by</span>
                <Tippy content="Lead Video Editor">
                    <abbr title="">LVE.</abbr>
                </Tippy>
            </span>
        } else {
            return _.upperFirst(name).replace(/_/g, ' ')
        }
    }

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs bg-${bgcColor} text-black`}>
            {renderName(name)}
        </span>
    )
}

export default StatusBadge