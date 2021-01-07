import dynamic from 'next/dynamic'
import { useFormContext } from 'react-hook-form'
import { useEffect } from 'react'

const QuillNoSSRWrapper = dynamic(import('react-quill'), {
    ssr: false,
    loading: () => <p>Loading ...</p>,
})

type Props = {
    name: string;
    defaultValue: any;
    error: any;
}
const Editor = (props: Props)=>{
    const {name, defaultValue, error} = props
    const {register, setValue, trigger} = useFormContext()

    return (
        <>
            <input 
            ref={register}
            name={name}
            type="text" 
            defaultValue={defaultValue}
            className="hidden" 
            />
            <QuillNoSSRWrapper
            className={error?'has-error': ''}
            defaultValue={defaultValue}
            onChange={(e)=>{
                console.log('editor on change',e)
                setValue(name, e, {
                    shouldDirty: true,
                    shouldValidate: true
                })
                trigger(name)
            }}
            />
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </>
         
    )
}

export default Editor



{/* <input 
            ref={register}
            name={`englishDescriptions[${index}].text`}
            type="text" 
            className="hidden" 
            />
            <QuillNoSSRWrapper
            defaultValue={values.englishDescriptions[index]?.text}
            onChange={(e)=>{
                console.log(e)
                setValue(`englishDescriptions[${index}].text`, e, {
                    shouldDirty: true,
                    shouldValidate: true
                })
            }}
        /> */}