import httpCms from 'utils/http-cms'

export interface QueryResponsePayload {
    stock_videos: any[];
}

const prepareUrl = (dataUrlObj) => {
    let apiUrl = "stock_videos?";
    Object.keys(dataUrlObj).forEach(key => {
        if (dataUrlObj[key] != "" && (dataUrlObj[key] != null && dataUrlObj[key] != undefined
        )) {
            apiUrl += key + "=" + dataUrlObj[key] + "&";
        }
    });
    apiUrl = apiUrl.slice(0, -1)

    return apiUrl;
}

export async function query(params: any) {
    try {
        const url = prepareUrl(params) //+'&token='+tokenManager.getToken()

        const { data } = await httpCms.get<QueryResponsePayload>(url)

        return data

    } catch (err) {

        throw err
    }
}

