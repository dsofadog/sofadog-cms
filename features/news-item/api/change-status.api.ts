import httpCms from 'utils/http-cms'
import tokenManager from 'utils/token-manager'

export interface ChangeStatusResponsePayload {
    news_item: any;
}

export async function changeStatus(id: string, action: string) {
    try {
        const url = tokenManager.attachToken(`news_items/${id}/${action}`)

        const { data } = await httpCms.post<ChangeStatusResponsePayload>(url, {})

        return data

    } catch (err) {
        throw err
    }
}