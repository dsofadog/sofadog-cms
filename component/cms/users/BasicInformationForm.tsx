import * as yup from 'yup'

type Props = {
    emailDisabled?: boolean;
    errors: any;
    register: any;
}

export interface Inputs {
    first_name: string;
    last_name: string;
    job_title: string;
    email: string;
}

export const schema = {
    first_name: yup.string().required().label('First name'),
    last_name: yup.string().required().label('Last name'),
    job_title: yup.string().required().label('Job title'),
    email: yup.string().required().label('Email'),
}

export const defaultValues = {
    first_name: '',
    last_name: '',
    job_title: '',
    email: ''
}

const BasicInformationForm = (props: Props) => {

    const { emailDisabled, errors, register } = props

    return (
        <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">Basic information</h3>
            <div className="grid grid-cols-6 gap-6 my-5">
                <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">First name</label>
                    <input
                        ref={register}
                        type="text"
                        name="first_name"
                        id="first-name"
                        className={(errors.first_name ? 'border-red-500' : '') + ' mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'}
                    />
                    {errors.first_name && <p className="mt-1 text-sm text-red-500">{errors.first_name.message}</p>}
                </div>

                <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="last-name" className="block text-sm font-medium text-gray-700">Last name</label>
                    <input
                        ref={register}
                        type="text"
                        name="last_name"
                        id="last-name"
                        className={(errors.last_name ? 'border-red-500' : '') + ' mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'}
                    />
                    {errors.last_name && <p className="mt-1 text-sm text-red-500">{errors.last_name.message}</p>}
                </div>

                <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
                    <input
                        disabled={!!emailDisabled}
                        ref={register}
                        autoComplete="nope"
                        type="text"
                        name="email"
                        id="email"
                        className={(errors.email ? 'border-red-500' : '') + ' mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md' + (emailDisabled ? ' cursor-not-allowed disabled:opacity-50' : '')}
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
                </div>

                <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="job-title" className="block text-sm font-medium text-gray-700">Job title</label>
                    <input
                        ref={register}
                        type="text"
                        name="job_title"
                        id="job-title"
                        className={(errors.job_title ? 'border-red-500' : '') + ' mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'}
                    />
                    {errors.job_title && <p className="mt-1 text-sm text-red-500">{errors.job_title.message}</p>}

                </div>

            </div>
        </div>
    )
}

export default BasicInformationForm