import { useState, useContext } from 'react';

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from 'yup'

import SubmitButton from "component/common/SubmitButton";

import CategoryForm, {
    Inputs,
    schema as rawInputs,
    defaultValues
} from './CategoryForm';
import httpCms from 'utils/http-cms';
import { LayoutContext } from 'contexts';
import tokenManager from 'utils/token-manager';


const schema = yup.object().shape({
    ...rawInputs,
})

type Props = {
    feed: any;
    onCreated: (feed) => void
}

const CreateCategoryForm = (props: Props) => {

    const { onCreated, feed} = props

    const { notify } = useContext(LayoutContext);
    const { register, handleSubmit, errors, setValue, watch } = useForm<Inputs>({
        resolver: yupResolver(schema),
        defaultValues: defaultValues,
    })
    const [loading, setLoading] = useState<boolean>(false)

    const submit = async (data: Inputs) => {
        try {

            const payload = schema.cast(data)

            setLoading(true);
            
            const res = await httpCms.post(tokenManager.attachToken(`feed/${feed.id}/categories`), payload)

            notify('success')
            onCreated(res.data.feed)

        } catch (err) {

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

                            <CategoryForm errors={errors} register={register} setValue={setValue} watch={watch} />

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

export default CreateCategoryForm