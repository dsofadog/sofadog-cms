import * as yup from 'yup'
import { ChromePicker } from 'react-color';
import { useState } from 'react';

type Props = {
    numberDisabled?: boolean;
    errors: any;
    register: any;
    setValue: Function;
    watch: Function;
}

export type Inputs = {
    number: number;
    title: string;
    colour: string;
    hex: string;
}

export const schema = {
    number: yup.number().required().label('Number').typeError('Must be a number'),
    title: yup.string().required().label('Title'),
    colour: yup.string().required().label('Colour'),
    hex: yup.string().required().label('Hex'),
}

export const defaultValues = {
    number: null,
    title: '',
    colour: '',
    hex: '',
}

const CategoryForm = (props: Props) => {

    const { numberDisabled, errors, register, setValue, watch } = props

    const [openPicker, setOpenPicker] = useState(false)


    const hex = watch('hex')

    console.log('hex',hex)

    const handleChangeComplete = (colour) => {
        setValue('hex', colour.hex)
        setOpenPicker(false)
    };

    return (
        <div>
            <div className="px-5 grid grid-cols-8 gap-6 my-5">
            <div className="col-span-8 sm:col-span-2">
                    <label htmlFor="number" className="block text-sm font-medium text-gray-700">Number</label>
                    <input
                        disabled={!!numberDisabled}
                        ref={register}
                        type="number"
                        name="number"
                        id="number"
                        className={(errors.number ? 'border-red-500' : '') + ' mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md' + (numberDisabled ? ' cursor-not-allowed disabled:opacity-50' : '')}
                    />
                    {errors.number && <p className="mt-1 text-sm text-red-500">{errors.number.message}</p>}
                </div>
                <div className="col-span-8 sm:col-span-2">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                        ref={register}
                        type="text"
                        name="title"
                        id="title"
                        className={(errors.title ? 'border-red-500' : '') + ' mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'}
                    />
                    {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>}
                </div>

                <div className="col-span-8 sm:col-span-2">
                    <label htmlFor="colour" className="block text-sm font-medium text-gray-700">Colour</label>
                    <input
                        ref={register}
                        type="text"
                        name="colour"
                        id="colour"
                        className={(errors.colour ? 'border-red-500' : '') + ' mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'}
                    />
                    {errors.colour && <p className="mt-1 text-sm text-red-500">{errors.colour.message}</p>}
                </div>

                <div className="col-span-8 sm:col-span-2">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Hex</label>
                    <input
                        ref={register}
                        type="text"
                        name="hex"
                        id="hex"
                        onClick={() => setOpenPicker(true)}  
                        className={(errors.hex ? 'border-red-500' : '') + ' mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'}
                    />
                    {openPicker && (
                        <div className="origin-top-right absolute right-0 mt-2 w-auto rounded-md shadow-lg z-50">
                            <ChromePicker color={hex} onChangeComplete={handleChangeComplete} />
                        </div>
                    )}
                    {errors.hex && <p className="mt-1 text-sm text-red-500">{errors.hex.message}</p>}
                </div>
            </div>
        </div>
    )
}

export default CategoryForm