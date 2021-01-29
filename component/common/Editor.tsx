import dynamic from 'next/dynamic'
import { useFormContext } from 'react-hook-form'

const QuillNoSSRWrapper = dynamic(import('./QuillEditor'), {
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
            ref={register()}
            name={name}
            type="text" 
            defaultValue={defaultValue}
            className="hidden" 
            />
            <QuillNoSSRWrapper
            error={error}
            defaultValue={defaultValue}
            onChange={(e)=>{
                // console.log('editor on change',e)
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