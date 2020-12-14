import * as yup from 'yup'

type Props = {
    errors: any;
    hideTitle?: boolean;
    register: any;
}

export interface Inputs {
    password: string;
    confirm_password: string;
}

export const schema = {
    password: yup.string().min(6).required().label('Password'),
    confirm_password: yup.string()
        .oneOf([yup.ref('password'), null], 'Passwords must match')
}

export const defaultValues = {
    password: '',
    confirm_password: ''
}


const PasswordForm = (props: Props) => {

    const { errors, hideTitle, register } = props
    
    return (
        <div>
            {!hideTitle && <h3 className="text-lg leading-6 font-medium text-gray-900 my-5">Password</h3>}
            <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12 sm:col-span-6">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                    <input
                        autoComplete="new-password"
                        ref={register}
                        type="password"
                        name="password"
                        id="password"
                        className={(errors.password ? 'border-red-500' : '') + ' mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-light-blue-500 focus:border-light-blue-500 sm:text-sm'}
                    />
                    {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>}
                </div>
                <div className="col-span-12 sm:col-span-6">
                    <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">Confirm password</label>
                    <input
                        autoComplete="new-password"
                        ref={register}
                        type="password"
                        name="confirm_password"
                        id="confirm-password"
                        className={(errors.confirm_password ? 'border-red-500' : '') + ' mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-light-blue-500 focus:border-light-blue-500 sm:text-sm'}
                    />
                    {errors.confirm_password && <p className="mt-1 text-sm text-red-500">{errors.confirm_password.message}</p>}
                </div>
            </div>
        </div>
    )
}

export default PasswordForm