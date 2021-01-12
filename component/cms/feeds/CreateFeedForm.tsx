import { useState } from 'react';

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from 'yup'

import SubmitButton from "component/common/SubmitButton";

import FeedForm, {
    Inputs as FeedInputs,
    schema as feedSchema,
    defaultValues as feedDefaultValues
} from './FeedForm';
import httpCms from 'utils/http-cms';
import tokenManager from 'utils/token-manager';
import notify from 'utils/notify';


const schema = yup.object().shape({
    ...feedSchema,
})

type Props = {
    callback: (success: boolean) => void
}

const CreateFeedForm = (props: Props) => {

    const { callback } = props

    const { register, handleSubmit, errors } = useForm<FeedInputs>({
        resolver: yupResolver(schema),
        defaultValues: feedDefaultValues,
    })
    const [loading, setLoading] = useState<boolean>(false)

    const submit = async (data: FeedInputs) => {
        try {

            const payload = schema.cast(data)

            setLoading(true);
            
            await httpCms.post(tokenManager.attachToken(`feeds`), payload)

            notify('success')
            callback(true)

        } catch (err) {

            notify('danger')
            setLoading(false);
            callback(false)

        } 
    }

    return (
        <div className="mt-5 md:mt-0 md:col-span-2">
            <form onSubmit={handleSubmit(submit)} autoComplete="off">
                <div className="shadow overflow-hidden sm:rounded-md">
                    <div className="px-4 py-5 bg-white sm:p-6">
                        <div className="space-y-8 divide-y divide-gray-200">

                            <FeedForm errors={errors} register={register} />

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

export default CreateFeedForm