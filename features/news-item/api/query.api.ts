import httpCms from 'utils/http-cms'
import tokenManager from 'utils/token-manager'

export interface QueryResponsePayload {
    news_items: any;
}

const returnUrlForNewItems = (dataUrlObj) => {
    // let url = `news_items?token=abcdef&limit=${paginationData.limit}&date=${getCurrentDate("-")}`;
    let apiUrl = "news_items?";
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
        const url = returnUrlForNewItems(params)

        const { data } = await httpCms.get<QueryResponsePayload>(url)

        return data

    } catch (err) {
        throw err
    }
}

