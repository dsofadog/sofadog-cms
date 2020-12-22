import httpCms from 'utils/http-cms'
import tokenManager from 'utils/token-manager'

export interface RemoveResponsePayload {
    news_item: any;
}

export async function remove(id: string) {
    try {
        const url = tokenManager.attachToken(`news_items/${id}`)

        const { data } = await httpCms.delete<RemoveResponsePayload>(url)

        return data

    } catch (err) {
        throw err
    }
}
