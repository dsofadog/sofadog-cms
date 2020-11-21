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

    static Status1 = {
        'new': 'New',
        'awaiting_review_by_lead_journalist': 'Awaiting review by lead journalist',
        'awaiting_video_upload': 'Awaiting video upload',
        'awaiting_review_by_lead_video_editor': 'Awaiting review by lead video editor',
        'ready_for_push': 'Ready For Push',
        'pushed_to_feed': 'Pushed To Feed',
        'removed_from_feed': 'Removed From Feed',
        'transcoding': 'Transcoding'
    };

    static Status =[
        {
            id: 1,
            name: "new",
            value: "New",
        },
        {
            id: 2,
            name: "awaiting_review_by_lead_journalist",
            value: "Awaiting review by lead journalist",
        },
        {
            id: 3,
            name: "awaiting_video_upload",
            value: "Awaiting video upload",
        },
        {
            id: 4,
            name: "awaiting_review_by_lead_video_editor",
            value: "Awaiting review by lead video editor",
        },

        {
            id: 5,
            name: "ready_for_push",
            value: "Ready For Push",
        },
        {
            id: 6,
            name: "pushed_to_feed",
            value: "Pushed To Feed",
        },
        
        {
            id: 7,
            name: "removed_from_feed",
            value: "Removed From Feed",
        },
        {
            id: 8,
            name: "transcoding",
            value: "Transcoding",
        },
        {
            id: 9,
            name: "all",
            value: "All",
        }
       
    ]

    static roles = [
        {
            id: "super_user",
            description: "Super User"
        },
        {
            id: "journalist",
            description: "Journalist"
        },
        {
            id: "lead_journalist",
            description: "Lead Journalist"
        },
        {
            id: "video_editor",
            description: "Video Editor"
        },
        {
            id: "lead_video_editor",
            description: "Lead Video Editor"
        },
        {
            id: "feed_manager",
            description: "Feed Manager"
        },
        {
            id: "user_manager",
            description: "User Manager"
        }
    ]

    static stateByRoleOnLoad = {
        "journalist" :"new",
        "lead_journalist" :"awaiting_review_by_lead_journalist",
        "video_editor" :"awaiting_video_upload",
        "lead_video_editor" :"awaiting_review_by_lead_video_editor",
        "feed_manager" :"pushed_to_feed",
        'super_admin':"all",
      };
      static actionbyRoles =  {
        'journalist' :['new'],
        'lead_journalis':['new','awaiting_review_by_lead_journalist'],
        'video_editor':['awaiting_video_upload'],
        'lead_video_editor':['awaiting_video_upload','awaiting_review_by_lead_video_editor'],
        'feed_manager':['pushed_to_feed','ready_for_push','decrement_ordinal','increment_ordinal','removed_from_feed'],
        'user_manager':['user_manager'],
        'super_admin':['super_admin']
      };
}