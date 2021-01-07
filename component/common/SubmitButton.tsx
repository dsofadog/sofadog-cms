import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import ProcessingButton from "./ProcessingButton"

type Props = {
    label: string;
    loading: boolean;
    form?: string;
}

const SubmitButton = (props: Props) => {

    const { label, loading, form } = props

    return <ProcessingButton 
    form={form}
    color='purple' 
    label={label} 
    loading={loading} 
    type='submit' />
}

export default SubmitButton