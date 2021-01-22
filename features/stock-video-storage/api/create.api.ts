import httpCms from 'utils/http-cms'
import tokenManager from 'utils/token-manager'
import {v4 as uuid} from 'uuid'
import faker from 'faker'
import moment from 'moment'

export interface CreateRequestPayload {
    stock_video: any;
}

export interface CreateResponsePayload {
    stock_video: any;
}


const tags = []

for(let i = 0; i<10; i++){
    tags.push(faker.lorem.word())
}

export async function create(video: any, tags: string[]) {
    try {
        const url = tokenManager.attachToken(`stock_videos`)+(tags.length>0?'&tags='+tags.join(','): '')
        
        const formData = new FormData();
        formData.append("source_file", video);
        const config = {
            headers: {
                'content-type': 'multipart/form-data',
                'Accept': 'multipart/form-data',
            }
        };


        const { data } = await httpCms.post<CreateResponsePayload>(url, formData, config)

        return data

    } catch (err) {
        return {
            stock_video: {
                id: uuid(),
                url: "https://cdn.so.fa.dog/aws-transcoded-clips-int/43-503ff1d8-5658-11eb-a0b0-4bb0b3f4ccb9.m3u8",
                thumbnail: `https://picsum.photos/id/${Math.floor(Math.random() * 100) + 1}/200/200`,
                tags: faker.random.arrayElements(tags),
                created_at: moment().subtract((Math.random()*100) +1, 'days').format('YYYY-MM-DD')
            }
        }
        throw err
    }
}