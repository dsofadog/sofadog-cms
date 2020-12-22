import httpCms from 'utils/http-cms'
import tokenManager from 'utils/token-manager'

export interface CreateRequestPayload {
    news_item: any;
}

export interface CreateResponsePayload {
    news_item: any;
}

export async function create(newsItem: any) {
    try {
        const url = tokenManager.attachToken(`news_items`)
        const payload = newsItem

        const { data } = await httpCms.post<CreateResponsePayload>(url, payload)

        return data

    } catch (err) {
        throw err
    }
}