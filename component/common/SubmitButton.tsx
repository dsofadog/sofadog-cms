import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import ProcessingButton from "./ProcessingButton"

type Props = {
    label: string;
    loading: boolean;
}

const SubmitButton = (props: Props) => {

    const { label, loading } = props

    return <ProcessingButton color='purple' label={label} loading={loading} type='submit' />
}

export default SubmitButton