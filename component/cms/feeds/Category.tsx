import _ from 'lodash'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useState, useContext, useEffect } from 'react'
import * as yup from 'yup'
import ProcessingButton from 'component/common/ProcessingButton'
import SubmitButton from 'component/common/SubmitButton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { LayoutContext } from 'contexts'
import httpCms from 'utils/http-cms'
import CategoryForm, {Inputs, schema as rawSchema} from './CategoryForm'

enum Mode {
    View = 'view',
    Edit = 'edit',
    Removed = 'removed'
}

type Props = {
    category: any
    onRemove: (number: number, callback: ()=>void) => void
}

const schema = yup.object().shape({
    title: rawSchema.title,
    colour: rawSchema.colour,
    hex: rawSchema.hex,
})

const Category = (props: Props) => {

    const { category, onRemove } = props

    const { register, handleSubmit, errors, setValue, watch } = useForm<Inputs>({
        resolver: yupResolver(schema),
        defaultValues: category,
    })
    const { appUserInfo, notify } = useContext(LayoutContext);

    const [mode, setMode] = useState(Mode.View)
    const [removing, setRemoving] = useState<boolean>(false)
    const [saving, setSaving] = useState<boolean>(false)
    const [updatedCategory, setUpdatedCategory] = useState(null)

    useEffect(() => {
        setUpdatedCategory(category)
    }, [])

    function pickTextColorBasedOnBgColorSimple(bgColor, lightColor, darkColor) {
        if (!bgColor) return lightColor

        var color = (bgColor.charAt(0) === '#') ? bgColor.substring(1, 7) : bgColor;
        var r = parseInt(color.substring(0, 2), 16); // hexToR
        var g = parseInt(color.substring(2, 4), 16); // hexToG
        var b = parseInt(color.substring(4, 6), 16); // hexToB
        return (((r * 0.299) + (g * 0.587) + (b * 0.114)) > 186) ?
            darkColor : lightColor;
    }

    const save = async (data: Inputs) => {
        try {
            setSaving(true)

            const payload = schema.cast(data)

            const url = `feed/${category.feed}/categories/${category.number}?token=${appUserInfo?.token}`
            const res = await httpCms.post(url, payload)

            const { categories } = res.data.feed

            const matchedCategory = _.find(categories, c => c.number === category.number)
            setUpdatedCategory(matchedCategory)
            console.log(res.data.feed, matchedCategory)
            setMode(Mode.View)
            notify('success')
        } catch (err) {

            notify('danger')
        } finally {
            setSaving(false);
        }
    }

    const remove = async () =>{

        setRemoving(true)
        await onRemove(category, ()=>{
            setRemoving(false)
        })
            
    }

    return (
        <>
            {mode === Mode.View && (
                <a onClick={() => setMode(Mode.Edit)} className="cursor-pointer block hover:bg-gray-50">
                    <div className="px-4 py-4 sm:px-6 flex justify-between items-center">
                        <div className="flex flex-1 items-center justify-between">
                            <p className="text-sm font-medium text-black">
                                <span className="mr-5 inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-gray-100 text-gray-800">
                                    {updatedCategory?.number}
                                </span>
                                <span>
                                    {updatedCategory?.title}
                                </span>
                            </p>
                            <div >
                                <p
                                    style={{ width: '180px', backgroundColor: updatedCategory?.hex, color: pickTextColorBasedOnBgColorSimple(updatedCategory?.hex, '#fff', '#000') }}
                                    className="inline-flex justify-center items-center px-2.5 py-0.5 rounded-md text-sm font-mediumx">
                                    {_.upperFirst(updatedCategory?.colour)}: {updatedCategory?.hex}
                                </p>
                            </div>
                        </div>
                        <div className="flex-shrink-0 ml-5">
                            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                        </div>

                    </div>
                </a>
            )}
            {mode === Mode.Edit && (
                <form onSubmit={handleSubmit(save)}>
                    <CategoryForm numberDisabled={true} errors={errors} register={register} setValue={setValue} watch={watch} />

                    <div className="flex justify-between items-center px-4 py-3 bg-gray-50 text-right sm:px-6">
                        <div>
                            <ProcessingButton
                                icon={<FontAwesomeIcon className="w-4 h-4 fill-current mr-2" icon={['fas', 'trash']} />}
                                onClicked={remove}
                                color="white"
                                type="button"
                                label="Remove"
                                loading={removing} />
                        </div>
                        <div>
                            <button className="btn btn-default mr-2" onClick={() => setMode(Mode.View)}>Cancel</button>
                            <SubmitButton loading={saving} label='Save' />

                        </div>

                    </div>
                </form>
            )}
        </>
    )
}

export default Category