import { useState, useRef, useEffect } from 'react';

import CmsConstant from 'utils/cms-constant';
import { useSelector } from 'react-redux';
import { RootState } from 'rootReducer';
import { useForm, FormProvider } from 'react-hook-form'
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from 'yup'
import SubmitButton from 'component/common/SubmitButton';
import moment from 'moment';
import DayPickerInput from 'react-day-picker/DayPickerInput'

type Props = {
    onSubmit: (filter: Inputs) => void
}

type Inputs = {
    category?: number | null;
    tags: string[];
    states: string[];
    feed: string;
    date?: string | null;
}

const schema = yup.object().shape({
    category: yup.number().label('Category'),
    tags: yup.array(yup.string()).label('Tags').default([]),
    states: yup.array(yup.string()).label('States').default([]),
    feed: yup.string().label('Feed').default(''),
    date: yup.string().label('Date'),
})

const defaultValues = schema.cast({})

const Filter = (props: Props) => {

    const { onSubmit } = props
    const { feeds } = useSelector((state: RootState) => state.feed)

    const methods = useForm<Inputs>({
        resolver: yupResolver(schema),
        defaultValues,
    })
    const { register, handleSubmit, errors, watch, setValue, setError, clearErrors, reset } = methods

    const tags = CmsConstant.Tags;
    const status = CmsConstant.Status;

    const [availableCategories, setAvailableCategories] = useState([])

    const values = watch()


    useEffect(() => {
        register('date')
    }, [])

    useEffect(() => {
        if (values.feed) {
            const matchedFeed = feeds.find(feed => feed.id === values.feed)
            console.log(matchedFeed)
            setAvailableCategories(matchedFeed.categories)

            if (
                !matchedFeed ||
                (matchedFeed && !matchedFeed.categories.map(category => category.number).includes(values.category))) {
                setValue('category', '')
            }
        } else {
            setAvailableCategories([])
            setValue('category', '')
        }

    }, [values.feed])

    function pickTextColorBasedOnBgColorSimple(bgColor, lightColor, darkColor) {
        if (!bgColor) return lightColor

        var color = (bgColor.charAt(0) === '#') ? bgColor.substring(1, 7) : bgColor;
        var r = parseInt(color.substring(0, 2), 16); // hexToR
        var g = parseInt(color.substring(2, 4), 16); // hexToG
        var b = parseInt(color.substring(4, 6), 16); // hexToB
        return (((r * 0.299) + (g * 0.587) + (b * 0.114)) > 186) ?
            darkColor : lightColor;
    }

    function getColorCode(category) {
        return category?.hex ? category?.hex : '#e5e7eb';
    }

    const submit = (data: Inputs) => {
        console.log('data', data)
        onSubmit(data)
    }

    return (
        <div data-id="filter" className="relative text-left ">
            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(submit)}>

                    <div className="mt-4 pb-8 w-full grid grid-cols-4 gap-2 px-4 sm:px-6 lg:px-8 pt-2 max-w-7xl mx-auto">

                        <div>
                            <div>
                                <h3 className="text-sm font-medium tracking-wide text-gray-500 uppercase">
                                    Tags
                                </h3>
                            </div>
                            <div className="max-w-lg">
                                <div className="mt-4 space-y-4">
                                    {tags.map(tag => {
                                        return (
                                            <div key={tag.value} className="flex items-center h-5">
                                                <input ref={register} id={'tag-' + tag.value} value={tag.value} defaultChecked={values.states.includes(tag.value)} name="tags" type="checkbox" className="h-4 w-4 text-purple-600 border-gray-300 rounded" />
                                                <label htmlFor={'tag-' + tag.value} className="pl-3 block text-sm font-medium text-gray-700">{tag.name}</label>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                        <div>
                            <div>
                                <h3 className="text-sm font-medium tracking-wide text-gray-500 uppercase">
                                    Status
                                </h3>
                            </div>
                            <div className="max-w-lg">
                                <div className="mt-4 space-y-4">
                                    {status.map(state => {
                                        return (
                                            <div key={state.name} className="flex items-center h-5">
                                                <input ref={register} id={'status-' + state.name} value={state.name} defaultChecked={values.states.includes(state.name)} name="states" type="checkbox" className="h-4 w-4 text-purple-600 border-gray-300 rounded" />
                                                <label htmlFor={'status-' + state.name} className="pl-3 block text-sm font-medium text-gray-700">{state.value}</label>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                        <div>
                            <div>
                                <h3 className="text-sm font-medium tracking-wide text-gray-500 uppercase">
                                    Feed
                                </h3>
                            </div>
                            <div>
                                <div className="max-w-lg">
                                    <div className="mt-4 space-y-4">
                                        {feeds.map(feed => {
                                            return (
                                                <div key={feed.id} className="flex items-center">
                                                    <input id={'feed-' + feed.id} ref={register} value={feed.id} defaultChecked={values.feed === feed.id} name="feed" type="radio" className="h-4 w-4 text-purple-600 border-gray-300" />
                                                    <label htmlFor={'feed-' + feed.id} className="pl-3 block text-sm font-medium text-gray-700">
                                                        {feed.name}
                                                    </label>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <div>
                                <h3 className="text-sm font-medium tracking-wide text-gray-500 uppercase">
                                    Category
                                </h3>
                            </div>
                            <div>
                                <div className="max-w-lg">
                                    <div className="mt-4 space-y-4">
                                        {availableCategories.map(category => {
                                            return (
                                                <div key={category.number} className="flex items-center">
                                                    <input id={'category-' + category.number} ref={register} value={category.number} defaultChecked={values.category === category.number} name="category" type="radio" className="h-4 w-4 text-purple-600 border-gray-300" />
                                                    <label
                                                        htmlFor={'category-' + category.number}
                                                        className="ml-3 flex items-center text-sm font-medium px-2 rounded-md "
                                                        style={{ width: '180px', backgroundColor: getColorCode(category), color: pickTextColorBasedOnBgColorSimple(category.hex, '#fff', '#000') }}
                                                    >
                                                        {category.title}
                                                    </label>
                                                </div>
                                            )
                                        })}
                                        {availableCategories.length === 0 && <p className="text-sm font-medium ">No categories are available</p>}
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className="bg-gray-50">
                        <div className="max-w-7xl mx-auto space-y-6 px-4 py-5 sm:space-y-0 sm:space-x-10 sm:px-6 lg:px-8">
                            <div className="flex justify-between">

                                <div className="flex">
                                    <label className="w-24 mr-2 block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                        From date
                                    </label>
                                    <DayPickerInput
                                        dayPickerProps={{ firstDayOfWeek: 1 }}
                                        classNames={{
                                            overlay: 'override-DayPickerInput-Overlay',
                                            overlayWrapper: 'DayPickerInput-OverlayWrapper ',
                                            container: (errors.date ? 'border-red-500 text-red-600 ' : 'border-transparent ') + 'text-sm form-input block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5 bg-white'
                                        }}
                                        format='YYYY-MM-DD'
                                        placeholder='YYYY-MM-DD'
                                        formatDate={(date) => moment(date).format('YYYY-MM-DD')}
                                        value={values.date}
                                        onDayChange={(date) => {
                                            const mDate = moment(date, 'YYYY-MM-DD', true)

                                            if (mDate.isValid()) {
                                                const formattedDate = moment(date).format('YYYY-MM-DD')
                                                setValue('date', formattedDate, {
                                                    shouldDirty: true,
                                                    shouldValidate: true
                                                })
                                                clearErrors('date')
                                            } else {
                                                setError('date', {
                                                    type: 'invalidDate',
                                                    message: 'Invalid date input'
                                                })
                                            }
                                        }} />
                                    {errors.date && <p className="mt-1 text-sm text-red-500">{errors.date.message}</p>}
                                </div>
                                <div className="">
                                    <button onClick={(e) => {
                                        reset(defaultValues)
                                        setAvailableCategories([])
                                    }} type="button" className="mr-3 text-gray-800 text-sm border border-indigo-600 hover:bg-gray-200 w-24 rounded p-2">Clear All</button>

                                    <SubmitButton loading={false} label='Submit' />
                                </div>
                            </div>
                        </div>
                    </div>
                </form>

            </FormProvider>

        </div>
    )
}

export default Filter