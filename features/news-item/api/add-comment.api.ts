import httpCms from 'utils/http-cms'
import tokenManager from 'utils/token-manager'

export interface AddCommentResponsePayload {
    comments: any;
}

export async function addComment(newsItemId: string, comment: string) {
    try {
        const url = tokenManager.attachToken(`news_items/${newsItemId}/comments`)
        const payload = { text: comment }

        const { data } = await httpCms.post<AddCommentResponsePayload>(url, payload)

        return data

    } catch (err) {
        throw err
    }
}