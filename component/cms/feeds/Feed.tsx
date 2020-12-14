import { useState, useContext, useEffect } from "react";

import _ from 'lodash'

import Loader from "component/common/Loader";
import httpCms from "utils/http-cms";
import { LayoutContext } from "contexts";
import CategoryList from "./CategoryList";

type Props = {
    feed: any;
}

const Feed = (props: Props) => {

    const { feed } = props

    const { appUserInfo, notify } = useContext(LayoutContext);
    const [loading, setLoading] = useState<boolean>(false)

    console.log(feed)
    return (
        <>
        
            <CategoryList categories={feed.categories}/>
        </>

    )
}

export default Feed