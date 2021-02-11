
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { useForm, useFieldArray, FormProvider } from 'react-hook-form'
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from 'yup'
import _ from 'lodash'
import { useState, useEffect } from 'react';
import Editor from 'component/common/Editor';
import MultiSelect from 'component/common/MultiSelect';
import CmsConstant from 'utils/cms-constant';

import moment from 'moment'
import DayPickerInput from 'react-day-picker/DayPickerInput'
import { useDispatch, useSelector } from 'react-redux';

import { create, update, hideNewsItemForm } from 'features/news-item/slices/news-item.slice'
import { RootState } from 'rootReducer';

import SubmitButton from 'component/common/SubmitButton';

enum Tab {
    BasicInformation = 'basic_information',
    Descriptions = 'descriptions',
    Credits = 'credits'
}

enum Language {
    English = 'english',
    Estonian = 'estonian'
}

enum CreditType {
    NewsCredits = 'news_credits',
    VisualCredits = 'visual_credits'
}

interface Inputs {
    title: string;
    feed: string[];
    category: number[];
    tags: string[];
    dueDate: string;
    englishDescriptions: { text: string; }[];
    estonianDescriptions: { text: string; }[];
    newsCredits: { title: string; url: string }[];
    visualCredits: { title: string; url: string }[];
}

const schema = yup.object().shape({
    title: yup.string().required().label('Title').default(''),
    feed: yup.array(yup.string()).min(1).required().label('Feed').default(['global']),
    category: yup.array(yup.number()).min(1, 'Category is a required field').required().label('Category').default([]),
    tags: yup.array(yup.string()).required().label('Tags').default([]),
    dueDate: yup.string().required().label('Due date').default(moment().format('YYYY-MM-DD')),
    englishDescriptions: yup.array(yup.object().shape({
        text: yup.string().required().label('Description').test('match', 'Description is a required field', title => title !== '<p><br></p>')
    })).default([]),
    estonianDescriptions: yup.array(yup.object().shape({
        text: yup.string().required().label('Description').test('match', 'Description is a required field', title => title !== '<p><br></p>')
    })).default([]),
    newsCredits: yup.array(yup.object().shape({
        title: yup.string().required().label('Title'),
        url: yup.string().label('Url')
    })).default([]),
    visualCredits: yup.array(yup.object().shape({
        title: yup.string().required().label('Title'),
        url: yup.string().label('Url')
    })).default([])
})

const defaultValues = schema.cast({})

type Props = {
    newsItem?: any;
}

const NewsItemDialogForm = (props: Props) => {

    const { newsItem } = props
    const { newsItemFormIsVisible } = useSelector((state: RootState) => state.newsItem)
    const { feeds } = useSelector((state: RootState) => state.feed)

    const tags = CmsConstant.Tags
    const methods = useForm<Inputs>({
        resolver: yupResolver(schema),
        defaultValues,
    })

    const { control, register, handleSubmit, errors, watch, setValue, setError, clearErrors, trigger, reset } = methods
    const { fields: englishDescriptionFields, append: appendEnglishDescription, remove: removeEnglishDescription } = useFieldArray({
        control,
        name: 'englishDescriptions'
    })
    const { fields: estonianDescriptionFields, append: appendEstonianDescription, remove: removeEstonianDescription } = useFieldArray({
        control,
        name: 'estonianDescriptions'
    })
    const { fields: newsCreditFields, append: appendNewsCredit, remove: removeNewsCredit } = useFieldArray({
        control,
        name: 'newsCredits'
    })
    const { fields: visualCreditFields, append: appendVisualCredit, remove: removeVisualCredit } = useFieldArray({
        control,
        name: 'visualCredits'
    })

    const values = watch()

    const { progressBarLoading } = useSelector((state: RootState) => state.newsItem)
    const dispatch = useDispatch()

    const [submitDisabled, setSubmitDisabled] = useState<boolean>(false)
    const [activeTab, setActiveTab] = useState<Tab>(Tab.BasicInformation)
    const [activeLanguage, setActiveLanguage] = useState<Language>(Language.English)
    const [activeCreditType, setActiveCreditType] = useState<CreditType>(CreditType.NewsCredits)

    const [categories, setCategories] = useState([])

    useEffect(() => {
        register('dueDate')
    }, [])


    useEffect(() => {
        const run = () => {
            if (progressBarLoading) {
                setSubmitDisabled(true)
            } else {
                setTimeout(() => {
                    setSubmitDisabled(false)
                }, 400)
            }
        }
        run()
    }, [progressBarLoading])

    useEffect(() => {
        if (feeds) {
            const _categories = feeds.find(_feed => _feed.id === values.feed[0]).categories
            setCategories(_categories)
        }
    }, [feeds])

    useEffect(() => {
        if (newsItem) {
            const {
                title,
                feed_id,
                category,
                tags,
                due_date,
                descriptions,
                news_credits,
                visual_credits
            } = newsItem

            const _englishDesciptionWrapper = descriptions.find(d => d.language === Language.English)
            const _estonianDesciptionWrapper = descriptions.find(d => d.language === Language.Estonian)

            setTimeout(() => {

                setValue('title', title)
                setValue('feed', [feed_id])
                setValue('category', [category])
                setValue('tags', tags)
                setValue('dueDate', due_date)
                setValue('englishDescriptions', _englishDesciptionWrapper
                    ? _englishDesciptionWrapper.sentences.map(text => ({ text }))
                    : [])
                setValue('estonianDescriptions', _estonianDesciptionWrapper
                    ? _estonianDesciptionWrapper.sentences.map(text => ({ text }))
                    : [])
                setValue('newsCredits', news_credits.map(credit => ({ title: credit.link_text, url: credit.url })))
                setValue('visualCredits', visual_credits.map(credit => ({ title: credit.link_text, url: credit.url })))

            }, 1000)
        }
    }, [newsItem])


    const close = () => {
        dispatch(hideNewsItemForm())
    }

    const resetCategories = (feed) => {
        const _categories = feeds.find(_feed => _feed.id === feed).categories
        setCategories(_categories)
        setValue('categories', [], {
            shouldDirty: true,
            shouldValidate: true
        })
    }

    const submit = async (data: Inputs) => {

        const unpreparedData = schema.cast(data)

        console.log(unpreparedData)

        const preparedData = {
            category: unpreparedData.category[0],
            descriptions: [{
                language: Language.English,
                sentences: unpreparedData.englishDescriptions.map(description => description.text)
            }, {
                language: Language.Estonian,
                sentences: unpreparedData.estonianDescriptions.map(description => description.text)
            }],
            due_date: unpreparedData.dueDate,
            feed_id: unpreparedData.feed[0],
            news_credits: unpreparedData.newsCredits.map(newsCredit => ({
                url: newsCredit.url,
                link_text: newsCredit.title
            })),
            tags: unpreparedData.tags,
            title: unpreparedData.title,
            visual_credits: unpreparedData.visualCredits.map(visualCredit => ({
                url: visualCredit.url,
                link_text: visualCredit.title
            }))
        }

        if (newsItem) {
            dispatch(update(newsItem.id, preparedData))
        } else {
            dispatch(create(preparedData))
        }
    }

    const renderDescriptionFields = (language: Language) => {

        let fields: any[];
        let fieldName: string;
        let append: Function
        let remove: Function

        if (language === Language.English) {
            fields = englishDescriptionFields
            fieldName = 'englishDescriptions'
            append = appendEnglishDescription
            remove = removeEnglishDescription
        } else {
            fields = estonianDescriptionFields
            fieldName = 'estonianDescriptions'
            append = appendEstonianDescription
            remove = removeEstonianDescription
        }

        return (
            <>
                <div className="mt-3">
                    {fields.map((item, index) => (
                        <div className="w-full flex mb-5" key={item.id}>
                            <div className="px-1 py-2 mr-2">
                                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full sfd-btn-primary">
                                    <span className="text-xs font-medium leading-none text-white">#{index + 1}</span>
                                </span>
                            </div>
                            <div className="w-full bg-white rounded">
                                <Editor
                                    name={`${fieldName}[${index}].text`}
                                    defaultValue={item.text}
                                    error={errors[fieldName]?.[index]?.text && errors[fieldName][index]?.text.message}
                                />
                            </div>
                            <div className="py-2 ml-2">
                                <button type='button' onClick={() => remove(index)} className="inline-flex items-center justify-center w-7 h-7 mr-2 text-red-100 transition-colors duration-150 bg-red-700 rounded-full focus:shadow-outline hover:bg-red-800">
                                    <FontAwesomeIcon className="h-3 w-3" icon={['fas', 'trash']} />
                                </button>
                            </div>
                        </div>
                    ))}
                    {fields.length === 0 && (

                        <div className="rounded-md bg-yellow-50 p-4 mb-5">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    {/* Heroicon name: exclamation */}
                                    <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-yellow-800">
                                        No {language} descriptions has been added to this news item yet.
                                    </h3>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <div className="flex justify-center">
                    <button type="button" onClick={() => append({ text: '' })} className="w-full items-center inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:w-auto sm:text-xs">
                        <FontAwesomeIcon className="h-3 w-3 mr-2" icon={['fas', 'plus']} />
                        ADD
                    </button>
                </div>
            </>
        )
    }

    const renderCreditFields = (creditType) => {
        let fields: any[];
        let fieldName: string;
        let append: Function
        let remove: Function

        if (creditType === CreditType.NewsCredits) {
            fields = newsCreditFields
            fieldName = 'newsCredits'
            append = appendNewsCredit
            remove = removeNewsCredit
        } else {
            fields = visualCreditFields
            fieldName = 'visualCredits'
            append = appendVisualCredit
            remove = removeVisualCredit
        }

        return (
            <>
                <div className="mt-3">
                    {fields.map((item, index) => (
                        <div className="w-full flex mb-5 items-center" key={item.id}>
                            <div className="p-1 mr-2">
                                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full sfd-btn-primary">
                                    <span className="text-xs font-medium leading-none text-white">#{index + 1}</span>
                                </span>
                            </div>
                            <div className="w-full grid grid-cols-2 gap-3">
                                <div className="col-span-1 bg-white rounded">
                                    <input
                                        ref={register()}
                                        defaultValue={item.title}
                                        type="text"
                                        placeholder='Title'
                                        name={`${fieldName}[${index}].title`}
                                        className={(errors[fieldName]?.[index]?.title ? 'border-red-500' : '') + ' mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'}
                                    />
                                    {errors[fieldName]?.[index]?.title && <p className="mt-1 text-sm text-red-500">{errors[fieldName]?.[index]?.title.message}</p>}

                                </div>
                                <div className="col-span-1  bg-white rounded">
                                    <input
                                        ref={register()}
                                        defaultValue={item.url}
                                        type="text"
                                        placeholder='Url'
                                        name={`${fieldName}[${index}].url`}
                                        className={(errors[fieldName]?.[index]?.url ? 'border-red-500' : '') + ' mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'}
                                    />
                                    {errors[fieldName]?.[index]?.url && <p className="mt-1 text-sm text-red-500">{errors[fieldName]?.[index]?.url.message}</p>}

                                </div>
                            </div>

                            <div className="ml-2">
                                <button type='button' onClick={() => remove(index)} className="inline-flex items-center justify-center w-7 h-7 mr-2 text-red-100 transition-colors duration-150 bg-red-700 rounded-full focus:shadow-outline hover:bg-red-800">
                                    <FontAwesomeIcon className="h-3 w-3" icon={['fas', 'trash']} />
                                </button>
                            </div>
                        </div>
                    ))}
                    {fields.length === 0 && (

                        <div className="rounded-md bg-yellow-50 p-4 mb-5">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    {/* Heroicon name: exclamation */}
                                    <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-yellow-800">
                                        No {creditType.replace('_', ' ')} has been added to this news item yet.
                                    </h3>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <div className="flex justify-center">
                    <button type="button" onClick={() => append({ title: '', url: '' })} className="w-full items-center inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:w-auto sm:text-xs">
                        <FontAwesomeIcon className="h-3 w-3 mr-2" icon={['fas', 'plus']} />
                        ADD
                    </button>
                </div>
            </>
        )
    }

    const hasError = (key) => {
        return (
            // Errors in basic information
            (Tab[key] === Tab.BasicInformation &&
                (
                    errors.title ||
                    errors.feed ||
                    errors.category ||
                    errors.dueDate
                )
            )

            ||

            // Errors in descriptions
            (Tab[key] === Tab.Descriptions &&
                (
                    (errors.englishDescriptions && errors.englishDescriptions.length > 0) ||
                    (errors.estonianDescriptions && errors.estonianDescriptions.length > 0)
                )
            )

            ||

            // Errors in credits
            (Tab[key] === Tab.Credits &&
                (
                    (errors.newsCredits && errors.newsCredits.length > 0) ||
                    (errors.visualCredits && errors.visualCredits.length > 0)
                )
            )
        )
    }

    return (
        <>
            <div className="fixed z-30 inset-0 overflow-y-auto">
                <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">

                    <div className={(!newsItemFormIsVisible ? 'animate__fadeOut' : 'animate__fadeIn') + ' animate__animated animate__faster fixed inset-0 transition-opacity'} aria-hidden="true">
                        <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                    </div>
                    <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                    <div className={(!newsItemFormIsVisible ? 'animate__fadeOutUp' : 'animate__fadeInDown') + ' animate__animated animate__faster inline-block align-bottom bg-white rounded-lg text-left shadow-xl transform transition-all sm:my-8 sm:align-middle  sm:w-full md:w-2/3'} role="dialog" aria-modal="true" aria-labelledby="modal-headline">
                        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">

                            <div className="hidden sm:block absolute top-0 right-0 pt-4 pr-4">
                                <button onClick={close} type="button" className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                    <span className="sr-only">Close</span>
                                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <div className="sm:flex sm:items-start mb-10">

                                <div className="mt-3 sm:mt-0 sm:ml-4 sm:mr-4 sm:text-left w-full">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
                                        {newsItem ? 'Edit' : 'Create'} news item
                                    </h3>

                                    <div className="mt-2">
                                        <FormProvider {...methods}>
                                            <form id="news-item-form" onSubmit={handleSubmit(submit)}>
                                                <div>
                                                    <div className="sm:hidden">
                                                        <label htmlFor="tabs" className="sr-only">Select a tab</label>
                                                        <select onChange={(e) => setActiveTab(e.target.value as Tab)} id="tabs" name="tabs" className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                                                                {Object.keys(Tab).map(key => {
                                                                    return (
                                                                        <option 
                                                                        key={key} 
                                                                        value={Tab[key]} 
                                                                        selected={activeTab === Tab[key]}
                                                                        >
                                                                            {hasError(key) && '[Error] '}
                                                                            {_.upperFirst(Tab[key]).replace('_', ' ')}
                                                                        </option>
                                                                    )
                                                                })}
                                                        </select>
                                                    </div>
                                                    <div className="hidden sm:block">
                                                        <div className="border-b border-gray-200">
                                                            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                                                                {Object.keys(Tab).map(key => {
                                                                    return (
                                                                        <a
                                                                            key={key}
                                                                            onClick={() => setActiveTab(Tab[key])}
                                                                            className={(activeTab === Tab[key] ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300') + `  inline-flex items-center border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm cursor-pointer`}
                                                                        >
                                                                            {
                                                                                hasError(key)
                                                                                && <FontAwesomeIcon className="h-3 w-3 mr-2 text-red-400" icon={['fas', 'exclamation-circle']} />}
                                                                            {_.upperFirst(Tab[key]).replace('_', ' ')}
                                                                        </a>
                                                                    )
                                                                })}
                                                            </nav>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div>
                                                        <div className={activeTab === Tab.BasicInformation ? '' : 'hidden '}>
                                                            <div className="mt-6">
                                                                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                                                                    Title
                                                            </label>
                                                                <div className="mt-1">
                                                                    <textarea
                                                                        ref={register}
                                                                        name="title"
                                                                        rows={2}
                                                                        className={(errors.title ? 'border-red-500 ' : '') + `shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border-gray-300 rounded-md`}>
                                                                    </textarea>
                                                                    {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>}
                                                                </div>
                                                            </div>

                                                            <div className="mt-3">
                                                                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-3">
                                                                    <div className="col-span-1">
                                                                        <label className="block text-sm font-medium text-gray-700">
                                                                            Feed
                                                                    </label>
                                                                        <MultiSelect
                                                                            keyField='id'
                                                                            singleSelect={true}
                                                                            placeholder='Select feed'
                                                                            options={feeds}
                                                                            defaultValues={values.feed}
                                                                            name='feed'
                                                                            onChanged={(list) => {
                                                                                resetCategories(list[0])
                                                                                setValue('category', [], {
                                                                                    shouldDirty: true,
                                                                                    shouldValidate: true
                                                                                })
                                                                            }}
                                                                        />
                                                                    </div>
                                                                    <div className="col-span-1">
                                                                        <label className="block text-sm font-medium text-gray-700">
                                                                            Category
                                                                </label>
                                                                        <MultiSelect
                                                                            singleSelect={true}
                                                                            keyField='number'
                                                                            displayValue='title'
                                                                            placeholder='Select category'
                                                                            options={categories}
                                                                            defaultValues={values.category}
                                                                            name='category'
                                                                        />
                                                                    </div>
                                                                    <div className="col-span-1">
                                                                        <label className="block text-sm font-medium text-gray-700">
                                                                            Tags
                                                                </label>
                                                                        <MultiSelect
                                                                            singleSelect={false}
                                                                            keyField='value'
                                                                            displayValue='name'
                                                                            placeholder='Select tags'
                                                                            options={tags}
                                                                            defaultValues={values.tags}
                                                                            name='tags'
                                                                        />
                                                                    </div>

                                                                    <div className="col-span-1">
                                                                        <label className="block text-sm font-medium text-gray-700">
                                                                            Due date
                                                                </label>
                                                                        <DayPickerInput
                                                                            dayPickerProps={{ firstDayOfWeek: 1 }}
                                                                            classNames={{
                                                                                overlay: 'override-DayPickerInput-Overlay',
                                                                                overlayWrapper: 'DayPickerInput-OverlayWrapper ',
                                                                                container: (errors.dueDate ? 'border-red-500 text-red-600 ' : 'border-transparent ') + 'text-sm form-input block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5'
                                                                            }}
                                                                            onChange={(e) => {
                                                                                console.log(e)
                                                                            }}
                                                                            format='YYYY-MM-DD'
                                                                            placeholder='YYYY-MM-DD'
                                                                            formatDate={(date) => moment(date).format('YYYY-MM-DD')}
                                                                            value={values.dueDate}
                                                                            onDayChange={(date) => {
                                                                                console.log('date', date)
                                                                                const mDate = moment(date, 'YYYY-MM-DD', true)
                                                                                console.log(mDate)

                                                                                if (mDate.isValid()) {
                                                                                    console.log('date is valid')
                                                                                    const formattedDate = moment(date).format('YYYY-MM-DD')
                                                                                    setValue('dueDate', formattedDate, {
                                                                                        shouldDirty: true,
                                                                                        shouldValidate: true
                                                                                    })
                                                                                    clearErrors('dueDate')
                                                                                } else {
                                                                                    console.log('date is invalid')
                                                                                    setError('dueDate', {
                                                                                        type: 'invalidDate',
                                                                                        message: 'Invalid date input'
                                                                                    })
                                                                                }

                                                                                // trigger(name)
                                                                                // setItem({
                                                                                //     ...item,
                                                                                //     due_date: formattedDate
                                                                                // });
                                                                                // setSelectedDueDate(formattedDate)
                                                                            }} />
                                                                        {errors.dueDate && <p className="mt-1 text-sm text-red-500">{errors.dueDate.message}</p>}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className={(activeTab === Tab.Descriptions ? '' : 'hidden ')}>

                                                            <div className="pt-6">
                                                                <div className="flex items-center justify-between">
                                                                    <label htmlFor="about" className="block text-sm font-medium text-gray-700">
                                                                        {_.upperFirst(activeLanguage)} descriptions
                                                                </label>
                                                                    <div>
                                                                        <div className="sm:hidden">
                                                                            <label htmlFor="tabs" className="sr-only">Select a tab</label>
                                                                            <select id="tabs-language" name="tabs" className="block w-full focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md">
                                                                                <option selected={activeLanguage === Language.English}>English</option>
                                                                                <option selected={activeLanguage === Language.Estonian}>Estonian</option>
                                                                            </select>
                                                                        </div>
                                                                        <div className="hidden sm:block">
                                                                            <nav className="flex space-x-4" aria-label="Tabs">
                                                                                <a onClick={() => setActiveLanguage(Language.English)} className={(activeLanguage === Language.English ? 'bg-gray-100 text-gray-700' : 'text-gray-500 hover:text-gray-700') + ' inline-flex items-center cursor-pointer px-3 py-2 font-medium text-sm rounded-md'}>
                                                                                    {errors.englishDescriptions && errors.englishDescriptions.length > 0 && <FontAwesomeIcon className="h-3 w-3 mr-2 text-red-400" icon={['fas', 'exclamation-circle']} />}
                                                                                English
                                                                            </a>
                                                                                <a onClick={() => setActiveLanguage(Language.Estonian)} className={(activeLanguage === Language.Estonian ? 'bg-gray-100 text-gray-700' : 'text-gray-500 hover:text-gray-700') + ' inline-flex items-center cursor-pointer px-3 py-2 font-medium text-sm rounded-md'}>
                                                                                    {errors.estonianDescriptions && errors.estonianDescriptions.length > 0 && <FontAwesomeIcon className="h-3 w-3 mr-2 text-red-400" icon={['fas', 'exclamation-circle']} />}
                                                                                Estonian
                                                                            </a>
                                                                            </nav>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className={activeLanguage !== Language.English ? 'hidden' : ''}>{renderDescriptionFields(Language.English)}</div>
                                                                <div className={activeLanguage !== Language.Estonian ? 'hidden' : ''}>{renderDescriptionFields(Language.Estonian)}</div>
                                                            </div>
                                                        </div>

                                                        <div className={(activeTab === Tab.Credits ? '' : 'hidden ')}>
                                                            <div className="pt-6">
                                                                <div className="flex items-center justify-between">
                                                                    <label htmlFor="about" className="block text-sm font-medium text-gray-700">
                                                                        {_.upperFirst(activeCreditType).replace('_', ' ')}
                                                                    </label>
                                                                    <div>
                                                                        <div className="sm:hidden">
                                                                            <label htmlFor="tabs" className="sr-only">Select a tab</label>
                                                                            <select id="tabs-credit" name="tabs" className="block w-full focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md">
                                                                                <option selected={activeCreditType === CreditType.NewsCredits}>News credit</option>
                                                                                <option selected={activeCreditType === CreditType.VisualCredits}>Visual credit</option>
                                                                            </select>
                                                                        </div>
                                                                        <div className="hidden sm:block">
                                                                            <nav className="flex space-x-4" aria-label="Tabs">
                                                                                <a onClick={() => setActiveCreditType(CreditType.NewsCredits)} className={(activeCreditType === CreditType.NewsCredits ? 'bg-gray-100 text-gray-700' : 'text-gray-500 hover:text-gray-700') + ' inline-flex items-center cursor-pointer px-3 py-2 font-medium text-sm rounded-md'}>
                                                                                    {errors.newsCredits && errors.newsCredits.length > 0 && <FontAwesomeIcon className="h-3 w-3 mr-2 text-red-400" icon={['fas', 'exclamation-circle']} />}
                                                                                News credits
                                                                            </a>
                                                                                <a onClick={() => setActiveCreditType(CreditType.VisualCredits)} className={(activeCreditType === CreditType.VisualCredits ? 'bg-gray-100 text-gray-700' : 'text-gray-500 hover:text-gray-700') + ' inline-flex items-center cursor-pointer px-3 py-2 font-medium text-sm rounded-md'}>
                                                                                    {errors.visualCredits && errors.visualCredits.length > 0 && <FontAwesomeIcon className="h-3 w-3 mr-2 text-red-400" icon={['fas', 'exclamation-circle']} />}
                                                                                Visual credits
                                                                            </a>
                                                                            </nav>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className={activeCreditType !== CreditType.NewsCredits ? 'hidden' : ''}>{renderCreditFields(CreditType.NewsCredits)}</div>
                                                                <div className={activeCreditType !== CreditType.VisualCredits ? 'hidden' : ''}>{renderCreditFields(CreditType.VisualCredits)}</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </form>
                                        </FormProvider>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 px-4 py-3 sm:px-10  sm:grid grid-cols-1 md:flex md:flex-row-reverse">
                            <SubmitButton
                                className="w-full"
                                form='news-item-form'
                                label='Save'
                                loading={submitDisabled}
                            />
                            <button onClick={close} type="button" className="mr-2 mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default NewsItemDialogForm