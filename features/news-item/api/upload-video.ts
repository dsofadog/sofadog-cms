import httpCms from 'utils/http-cms'
import tokenManager from 'utils/token-manager'

export interface UploadVideoRequestPayload {
    news_item: any;
}

export interface UploadVideoeResponsePayload {
    news_item: any;
}

export async function uploadVideo(id: string, video: any) {
    try {
        const url = tokenManager.attachToken(`news_items/${id}/upload_video`)
        const formData = new FormData();
        formData.append("source_file", video);
        const config = {
            headers: {
                'content-type': 'multipart/form-data',
                'Accept': 'multipart/form-data',
            }
        };

        const { data } = await httpCms.post<UploadVideoeResponsePayload>(url, formData, config)

        return data

    } catch (err) {
        throw err
    }
}