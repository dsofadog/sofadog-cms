import { useState, useEffect } from 'react';

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from 'yup'

import SubmitButton from "component/common/SubmitButton";
import httpCms from 'utils/http-cms';
import FeedForm, {
    Inputs,
    schema as feedSchema,
    defaultValues as feedDefaultValues
} from './FeedForm';
import tokenManager from 'utils/token-manager';
import notify from 'utils/notify';

const schema = yup.object().shape({
    name: feedSchema.name,
    description: feedSchema.description
})

type Props = {
    feed: any;
    onUpdated: (feed)=>void
}

const EditFeedForm = (props: Props) => {

    const { feed, onUpdated } = props

    const { register, handleSubmit, errors, reset } = useForm<Inputs>({
        resolver: yupResolver(schema),
        defaultValues: feedDefaultValues,
    })
    const [loading, setLoading] = useState<boolean>(false)
    const [updatedFeed, setUpdatedFeed] = useState(null)

    useEffect(() => {
        reset(feed)
        setUpdatedFeed(feed)
    }, [])
    
    const submit = async (data: Inputs) => {
        try {
            setLoading(true);

            const { id } = updatedFeed
            const payload = schema.cast(data)

            // console.log('updatedFeed', updatedFeed, 'payload', payload)
            const res = await httpCms.post(tokenManager.attachToken(`feeds`), {
                ...payload,
                id
            })

            reset(res.data.feed)
            setUpdatedFeed(res.data.feed)
            setLoading(false);
            onUpdated(res.data.feed)
        } catch (err) {
            setUpdatedFeed(updatedFeed)
            notify('danger')
            setLoading(false);
        } 
    }

    return (
        <div className="mt-5 md:mt-0 md:col-span-2">
            <form onSubmit={handleSubmit(submit)} autoComplete="off">
                <div className="shadow overflow-hidden sm:rounded-md">
                    <div className="px-4 py-5 bg-white sm:p-6">
                        <div className="space-y-8 divide-y divide-gray-200">

                            <FeedForm idDisabled={true} errors={errors} register={register} />

                        </div>

                    </div>
                    <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                        <SubmitButton label='Save' loading={loading} />
                    </div>
                </div>
            </form>
        </div>
    )
}

export default EditFeedForm