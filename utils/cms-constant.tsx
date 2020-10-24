export default class CmsConstant {
    static Category = [
        {
            id: 1,
            name: "LIFE & POLITICS",
            value: '0',
            color: "purple-700"
        },
        {
            id: 2,
            name: "FASHION & ART",
            value: '1',
            color: "orange-300"
        },
        {
            id: 3,
            name: "CELEBRITIES",
            value: '2',
            color: "sfd-pink"
        },
        {
            id: 4,
            name: "ENTERTAINMENT",
            value: '3',
            color: "red-600"
        },
        {
            id: 5,
            name: "NATURE",
            value: '4',
            color: "sfd-green"
        },
        {
            id: 6,
            name: "SCIENCE",
            value: '5',
            color: "gray-900"
        },
        {
            id: 7,
            name: "BUSINESS & TECH",
            value: '6',
            color: "blue-600"
        },
        {
            id: 8,
            name: "SELF-IMPROVEMENT",
            value: '7',
            color: "yellow-300"
        }
    ]

    static Tags = [
        {
            id: 1,
            name: "Local Estonian Content",
            value: "Local Estonian Content",
        },
        {
            id: 2,
            name: "NSFW",
            value: "NSFW",
        },
        {
            id: 3,
            name: "NSFL",
            value: "NSFL",
        }
    ]

    static Status = {
        'new': 'New',
        'awaiting_review_by_lead_journalist': 'Awaiting review by lead journalist',
        'awaiting_video_upload': 'Awaiting video upload',
        'awaiting_review_by_lead_video_editor': 'Awaiting review by lead video editor',
        'ready_for_push': 'Ready For Push',
        'pushed_to_feed': 'Pushed To Feed',
        'removed_from_feed': 'Removed From Feed',
        'transcoding': 'Transcoding'
    };
}