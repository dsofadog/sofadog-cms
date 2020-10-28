import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import Editor from '../../component/cms/Editor';
import NavHeader from "../../component/common/NavHeader";
import { LayoutContext } from '../../contexts';
import HttpCms from '../../utils/http-cms';

//Mirage Server
import { createServer } from "miragejs";
createServer({
    routes() {
        this.get("/api/news_items", () => ({
            news_items: [
                {
                    "id": "0be48eb0-1321-11eb-a65a-4785025e4324",
                    "title": "What's At Stake? Puerto Ricans and the Latino Vote ",
                    "category": 5,
                    "news_credits": [
                        {
                            "url": "",
                            "link_text": "AP "
                        }
                    ],
                    "visual_credits": [
                        {
                            "url": "",
                            "link_text": "AP "
                        },
                        {
                            "url": "",
                            "link_text": "Scanpix"
                        }
                    ],
                    "descriptions": [
                        {
                            "language": "english",
                            "sentences": [
                                "They have been American citizens since 1917, and yet they can’t vote So why are Trump and Biden tapping them? They comprise 27% of Hispanics of voting age in Florida, a key state for Trump’s 2016 victory This small island territory is in Hurricane Alley, and they have been reliant on federal aidThe candidates are banking on Latinos' close-knit ties to influence their friends and families in the mainland US Biden’s campaign says, “With your vote there, you help us here”Trump pledged $13B in aid for Hurricane Maria. He says he's ‘the best thing that happened to Puerto Rico'"
                            ]
                        }
                    ],
                    "updated_at": 1603231936,
                    "created_at": 1603231821,
                    "state": "pushed_to_feed",
                    "clips": [
                        {
                            "id": "4e3d9b08-1321-11eb-b334-596528e5b754",
                            "url": "https://cdn.so.fa.dog/aws-transcoded-clips-int/43-0be48eb0-1321-11eb-a65a-4785025e4324.m3u8",
                            "aspect_ratio": "43",
                            "updated_at": 1603231933,
                            "created_at": 1603231933
                        },
                        {
                            "id": "4e3e81b2-1321-11eb-b334-596528e5b754",
                            "url": "https://cdn.so.fa.dog/aws-transcoded-clips-int/1959-0be48eb0-1321-11eb-a65a-4785025e4324.m3u8",
                            "aspect_ratio": "1959",
                            "updated_at": 1603231933,
                            "created_at": 1603231933
                        },
                        {
                            "id": "4e3f5420-1321-11eb-b334-596528e5b754",
                            "url": "https://cdn.so.fa.dog/aws-transcoded-clips-int/169-0be48eb0-1321-11eb-a65a-4785025e4324.m3u8",
                            "aspect_ratio": "169",
                            "updated_at": 1603231933,
                            "created_at": 1603231933
                        }
                    ],
                    "tags": [],
                    "thumbnails": [
                        {
                            "id": "4e4027c4-1321-11eb-b334-596528e5b754",
                            "url": "https://cdn.so.fa.dog/thumbnails-int/0be48eb0-1321-11eb-a65a-4785025e4324.jpg_43.jpg",
                            "aspect_ratio": "43",
                            "updated_at": 1603231933,
                            "created_at": 1603231933
                        },
                        {
                            "id": "4e40f8d4-1321-11eb-b334-596528e5b754",
                            "url": "https://cdn.so.fa.dog/thumbnails-int/0be48eb0-1321-11eb-a65a-4785025e4324.jpg_1959.jpg",
                            "aspect_ratio": "1959",
                            "updated_at": 1603231933,
                            "created_at": 1603231933
                        },
                        {
                            "id": "4e41c8ae-1321-11eb-b334-596528e5b754",
                            "url": "https://cdn.so.fa.dog/thumbnails-int/0be48eb0-1321-11eb-a65a-4785025e4324.jpg_169.jpg",
                            "aspect_ratio": "169",
                            "updated_at": 1603231933,
                            "created_at": 1603231933
                        }
                    ],
                    "deleted": null,
                    "ordinal": 453,
                    "comments": null
                }
            ],
        }))
    },
})

const Item = () => {
    const router = useRouter()
    const { item_id } = router.query;
    const { setLoading } = useContext(LayoutContext);

    const [item, setItem] = useState(null);
    const [body, setBody] = useState('');

    useEffect(() => {
        console.log("item_id: ", item_id);
        if (item_id != undefined) {
            fetchItem();
        }
    }, [item_id]);

    function fetchItem() {
        setLoading(true);
        // HttpCms.get(`/news_items/${item_id}?token=abcdef`)
        //     .then(response => {
        //         setItem(response.data.news_items[0]);
        //         console.log(response.data.news_items[0], "response.data.data");
        //         setLoading(false);
        //     })
        //     .catch(e => {
        //         console.log(e);
        //         setLoading(false);
        //     });
        fetch("/api/news_items")
            .then((res) => res.json())
            .then((json) => {
                setItem(json.news_items[0])
            })
    }

    return (
        <div className="w-full h-full min-h-screen bg-gray-500">
            <NavHeader />
            <div className="w-full min-h-96 p-4">
                <div className="max-w-4xl mx-auto h-full rounded bg-white p-4">
                    <Editor value={body} onChange={setBody} />
                </div>
            </div>
        </div>
    )
}

export default Item