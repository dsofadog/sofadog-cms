import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import ProcessingButton from "./ProcessingButton"

type Props = {
    label: string;
    loading: boolean;
    form?: string;
    className?: string;
}

const SubmitButton = (props: Props) => {

    const {className, label, loading, form } = props

    return <ProcessingButton 
    className={className}
    form={form}
    color='purple' 
    label={label} 
    loading={loading} 
    type='submit' />
}

export default SubmitButton