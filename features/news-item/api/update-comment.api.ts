import httpCms from 'utils/http-cms'
import tokenManager from 'utils/token-manager'

export interface UpdateCommentResponsePayload {
    comments: any;
}

export async function updateComment(newsItemId: string, commentId: string, comment: string) {
    try {
        const url = tokenManager.attachToken(`news_items/${newsItemId}/comments/${commentId}`)
        const payload = { text: comment }

        const { data } = await httpCms.patch<UpdateCommentResponsePayload>(url, payload)

        return data

    } catch (err) {
        throw err
    }
}