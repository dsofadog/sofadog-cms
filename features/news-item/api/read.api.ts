import httpCms from 'utils/http-cms'
import tokenManager from 'utils/token-manager'

export interface ReadResponsePayload {
    news_items: any;
}

export async function read(id: string) {
    try {
        const url = tokenManager.attachToken(`news_items/${id}`)

        const { data } = await httpCms.get<ReadResponsePayload>(url)

        return data

    } catch (err) {
        throw err
    }
}