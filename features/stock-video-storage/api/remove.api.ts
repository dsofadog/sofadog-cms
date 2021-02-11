import httpCms from 'utils/http-cms'
import tokenManager from 'utils/token-manager'

export interface RemoveResponsePayload {
    stock_video: any;
}

export async function remove(id: string) {
    try {
        const url = tokenManager.attachToken(`stock_videos/${id}`)

        const { data } = await httpCms.delete<RemoveResponsePayload>(url)

        return data

    } catch (err) {
        throw err
    }
}
