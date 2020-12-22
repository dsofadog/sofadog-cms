import httpCms from 'utils/http-cms'
import tokenManager from 'utils/token-manager'

export interface UpdateRequestPayload {
    news_item: any;
}

export interface UpdateResponsePayload {
    news_item: any;
}

export async function update(id: string, newsItem: any) {
    try {
        const url = tokenManager.attachToken(`news_items/${id}`)
        const payload = newsItem

        const { data } = await httpCms.patch<UpdateResponsePayload>(url, payload)

        return data

    } catch (err) {
        throw err
    }
}
