import httpCms from 'utils/http-cms'
import tokenManager from 'utils/token-manager'

export interface ChangeOrderResponsePayload {
    news_item: any;
}

export async function changeOrder(id: string, direction: string) {
    try {
        const url = tokenManager.attachToken(`news_items/${id}/${direction}`)

        const { data } = await httpCms.post<ChangeOrderResponsePayload>(url, {})

        return data

    } catch (err) {
        throw err
    }
}