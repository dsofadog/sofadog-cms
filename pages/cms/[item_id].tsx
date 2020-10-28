import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import Editor from '../../component/cms/Editor';
import NavHeader from "../../component/common/NavHeader";
import { LayoutContext } from '../../contexts';
import HttpCms from '../../utils/http-cms';

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
        HttpCms.get(`/news_items/${item_id}?token=abcdef`)
            .then(response => {
                setItem(response.data.news_items[0]);
                console.log(response.data.news_items[0], "response.data.data");
                setLoading(false);
            })
            .catch(e => {
                console.log(e);
                setLoading(false);
            });
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