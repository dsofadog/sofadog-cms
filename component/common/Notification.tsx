import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useRouter } from "next/router";

import _ from 'lodash'
import httpCms from "utils/http-cms";
import { useState } from "react";
import MiniLoader from './MiniLoader'
import tokenManager from "utils/token-manager";
import notify from "utils/notify";


type Props = {
    notification: any;
    onRead: (notification: any) => void
}

const Notification = (props: Props) => {

    const { notification, onRead } = props

    const router = useRouter();
    const [isLoading, setLoading] = useState<boolean>(false)

    const notificationAction = (notification) => {
        if (notification.object_type === 'news_item') {
            router.replace('/cms?id=' + notification.object_id)
        }
    }

    const readNotification = async (notification) => {

        if (notification.read === false) {

            try {

                setLoading(true)
                const response = await httpCms.post(tokenManager.attachToken(`/notifications/${notification.id}/read`))
                if (response.data != null) {
                    setLoading(false)
                    onRead(response.data.notifications)
                } else {
                    alert("Something wrong !!");
                    notify('danger')
                    setLoading(false)
                }
            } catch (err) {
                notify('danger')
                setLoading(false)
            }

        }
    }

    return (
        <>
            <li key={notification.id} className="w-full flex px-4 py-1 text-xs leading-5 text-gray-700 hover:bg-gray-200 hover:text-gray-900 cursor-pointer items-center">
                <FontAwesomeIcon className="w-5 h-5 text-gray-400" icon={['fas', 'newspaper']} />
                <div className="ml-3 flex-1" onClick={(e) => notificationAction(notification)}>
                    <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                    <p className="text-sm text-gray-500">{_.upperFirst(notification.action.replace(/_/g, ' '))}</p>
                </div>
                <div className="w-1/12 flex items-center justify-end">
                    <MiniLoader active={isLoading}>
                        <FontAwesomeIcon onClick={() => readNotification(notification)} className="w-5 h-5 cursor-pointer hover:text-white rounded-full bg-gray-300 hover:bg-green-500 p-1" icon={['fas', 'check']} />
                    </MiniLoader>
                </div>
            </li>
        </>
    )
}

export default Notification