import httpCms from 'utils/http-cms'
import tokenManager from 'utils/token-manager'

export interface RemoveCommentResponsePayload {
    comments: any;
}

export async function removeComment(newsItemId: string, commentId: string) {
    try {
        const url = tokenManager.attachToken(`news_items/${newsItemId}/comments/${commentId}`)

        const { data } = await httpCms.delete<RemoveCommentResponsePayload>(url)

        return data

    } catch (err) {
        throw err
    }
}