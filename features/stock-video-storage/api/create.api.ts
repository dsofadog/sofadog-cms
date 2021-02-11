import httpCms from 'utils/http-cms'
import tokenManager from 'utils/token-manager'

export interface CreateRequestPayload {
    stock_video: any;
}

export interface CreateResponsePayload {
    stock_video: any;
}

export async function create(video: any, tags: string[]) {
    try {
        console.log('tags',tags)
        const url = tokenManager.attachToken(`stock_videos`)//+(tags.length>0?'&tags='+tags.join(','): '')
        
        const formData = new FormData();
        formData.append("source_file", video);
        formData.append("tags", tags.join(','));
        const config = {
            headers: {
                'content-type': 'multipart/form-data',
                'Accept': 'multipart/form-data',
            }
        };

        const { data } = await httpCms.post<CreateResponsePayload>(url, formData, config)

        return data

    } catch (err) {
        throw err
    }
}