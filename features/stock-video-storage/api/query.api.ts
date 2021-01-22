import httpCms from 'utils/http-cms'
import tokenManager from 'utils/token-manager'
import moment from 'moment';
import {v4 as uuid} from 'uuid'
import faker from 'faker'

export interface QueryResponsePayload {
    stock_videos: any[];
}

const tags = []

for(let i = 0; i<10; i++){
    tags.push(faker.lorem.word())
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
        const url = prepareUrl(params)

        const { data } = await httpCms.get<QueryResponsePayload>(url)

        return data

    } catch (err) {

        let list = []
        for(let i = 0; i< 50; i++){
            list.push({
                id: uuid(),
                url: "https://cdn.so.fa.dog/aws-transcoded-clips-int/43-503ff1d8-5658-11eb-a0b0-4bb0b3f4ccb9.m3u8",
                thumbnail: `https://picsum.photos/id/${Math.floor(Math.random() * 100) + 1}/200/200`,
                tags: faker.random.arrayElements(tags),
                created_at: moment().subtract((Math.random()*100) +1, 'days').format('YYYY-MM-DD')
            })
        }


        return {
            stock_videos: list
        }
        // throw err
    }
}

