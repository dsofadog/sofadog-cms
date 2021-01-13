import { useState, useEffect, useContext } from "react";

import _ from 'lodash';

import Loader from "component/common/Loader";
import httpCms from "utils/http-cms";
import Category from "./Category";
import tokenManager from "utils/token-manager";
import notify from 'utils/notify'
import { ConfirmationContext } from "contexts";

type Props = {
    categories: any[]
}

const CategoryList = (props: Props) => {

    const { categories } = props

    const confirm = useContext(ConfirmationContext)

    const [loading, setLoading] = useState<boolean>(false)

    const [updatedCategories, setUpdatedCategories] = useState(null)
    useEffect(() => {
        setUpdatedCategories(categories)
    }, [])

    const remove = async (category, callback) => {

        confirm({
            variant: 'danger'
        }).then(async () => {
            try {
                setLoading(true)
                const url = tokenManager.attachToken(`feed/${category.feed}/categories/${category.number}`)
                const res = await httpCms.delete(url)

                setUpdatedCategories(res.data.feed.categories)

                notify('success')
            } catch (err) {
                notify('danger')
            } finally {
                setLoading(false)
                callback()
            }
        })


    }

    return (
        <>
            <Loader active={loading}>
                <ul className="divide-y divide-gray-200">
                    {updatedCategories && updatedCategories.map(category => {
                        return (
                            <li key={category.number}>
                                <Category category={category} onRemove={remove} />
                            </li>
                        )
                    })}
                </ul>
            </Loader>

        </>

    )
}

export default CategoryList