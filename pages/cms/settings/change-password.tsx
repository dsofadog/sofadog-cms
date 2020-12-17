import { useContext, useState } from "react";

import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import Settings from "component/common/Settings"
import { LayoutContext } from "contexts";
import httpCms from "utils/http-cms";
import SubmitButton from "component/common/SubmitButton";
import PasswordForm, { Inputs, schema as passwordSchema } from "component/cms/users/PasswordForm";
import { useSelector } from "react-redux";
import { RootState } from "rootReducer";
import tokenManager from "utils/token-manager";

const schema = yup.object().shape({
    ...passwordSchema
})

const ChangePassword = () => {

    const { register, handleSubmit, errors, reset } = useForm<Inputs>({
        resolver: yupResolver(schema)
    })
    const {currentUser} = useSelector((state:RootState)=>state.auth)
    const { notify } = useContext(LayoutContext);
    const [loading, setLoading] = useState<boolean>(false)

    const changePassword = async function (data: Inputs) {
        try {

            const { password } = schema.cast(data)

            let payload = {
                email: currentUser.email,
                password
            };

            setLoading(true);
            const url = tokenManager.attachToken(`admin_user/${currentUser.email}/set_password`)
            const res = await httpCms.post(url, payload)

            notify('success')
            reset()
        } catch (err) {
            notify('danger')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Settings>
            <form onSubmit={handleSubmit(changePassword)}>
                <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Change password
                    </h3>
                </div>
                <div className="border-t border-b border-gray-200 px-4 sm:px-6 pt-5 pb-7">
                    <PasswordForm errors={errors} hideTitle={true} register={register} />
                </div>
                <div className="py-4 px-4 flex justify-end sm:px-6">
                    <SubmitButton label='Save' loading={loading} />
                </div>
            </form>

        </Settings>
    )
}

export default ChangePassword