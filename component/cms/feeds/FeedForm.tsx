import * as yup from 'yup'

type Props = {
    idDisabled?: boolean;
    errors: any;
    register: any;
}

export interface Inputs {
    id: string;
    name: string;
    description: string;
}

export const schema = {
    id: yup.string().required().matches(/^[a-z_-]+$/, 'Id can only contain lowercase alphabets underscores and hyphens').label('Id'),
    name: yup.string().required().label('Name'),
    description: yup.string().required().label('Description'),
}

export const defaultValues = {
    id: '',
    name: '',
    description: '',
}

const FeedForm = (props: Props) => {

    const { idDisabled, errors, register } = props

    return (
        <div>
            {/* <h3 className="text-lg leading-6 font-medium text-gray-900">Basic information</h3> */}
            <div className="grid grid-cols-6 gap-6 my-5">

                <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="id" className="block text-sm font-medium text-gray-700">Id</label>
                    <input
                        disabled={!!idDisabled}
                        ref={register}
                        type="text"
                        name="id"
                        id="id"
                        className={(errors.id ? 'border-red-500' : '') + ' mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md' + (idDisabled ? ' cursor-not-allowed disabled:opacity-50' : '')}
                    />
                    {errors.id && <p className="mt-1 text-sm text-red-500">{errors.id.message}</p>}
                </div>

                <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                        ref={register}
                        type="text"
                        name="name"
                        id="name"
                        className={(errors.name ? 'border-red-500' : '') + ' mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'}
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
                </div>

                <div className="col-span-6">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        ref={register}
                        name="description"
                        id="description"
                        className={(errors.description ? 'border-red-500' : '') + ' mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'}
                    />
                    {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>}
                </div>

            </div>
        </div>
    )
}

export default FeedForm