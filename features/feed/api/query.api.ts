import httpCms from 'utils/http-cms'
import tokenManager from 'utils/token-manager'

export interface Category {
    colour: string;
    feed: string;
    hex: string;
    number: number;
    title: string;
}

export interface Feed {
    description: string;
    id: string;
    name: string;
    categories: Category[]
}

export interface QueryResponsePayload {
    feeds: Feed[];
}

export async function query() {
    try {
        const url = tokenManager.attachToken(`feeds`)

        const { data } = await httpCms.get<QueryResponsePayload>(url)

        return data

    } catch (err) {
        throw err
    }
}

