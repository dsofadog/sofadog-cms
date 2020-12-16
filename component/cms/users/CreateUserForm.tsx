import { useState, useContext } from 'react';

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from 'yup'

import SubmitButton from "component/common/SubmitButton";

import BasicInformationForm, {
    Inputs as BasicInformationInputs,
    schema as basicInformationSchema,
    defaultValues as basicInformationDefaultValues
} from './BasicInformationForm';
import RolesForm, {
    Inputs as RolesInputs,
    schema as rolesSchema,
    defaultValues as rolesDefaultValues
} from './RolesForm';
import PasswordForm, {
    Inputs as PasswordInputs,
    schema as passwordSchema,
    defaultValues as passwordDefaultValues
} from './PasswordForm';
import httpCms from 'utils/http-cms';
import { LayoutContext } from 'contexts';

interface Inputs extends BasicInformationInputs, RolesInputs, PasswordInputs { }

const schema = yup.object().shape({
    ...basicInformationSchema,
    ...rolesSchema,
    ...passwordSchema
})

const defaultValues = {
    ...basicInformationDefaultValues,
    ...rolesDefaultValues,
    ...passwordDefaultValues
}

type Props = {
    callback: (success: boolean) => void
}

const CreateUserForm = (props: Props) => {

    const { callback } = props

    const { appUserInfo, notify } = useContext(LayoutContext);
    const { register, handleSubmit, errors } = useForm<Inputs>({
        resolver: yupResolver(schema),
        defaultValues,
    })
    const [loading, setLoading] = useState<boolean>(false)

    const submit = async (data: Inputs) => {
        try {

            const { confirm_password, ...payload } = schema.cast(data)

            setLoading(true);
            
            await httpCms.post("admin_user?token=" + appUserInfo?.token, payload)

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

                            <BasicInformationForm errors={errors} register={register} />

                            <RolesForm register={register} />

                            <PasswordForm errors={errors} register={register} />

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

export default CreateUserForm