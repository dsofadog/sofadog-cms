import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

type Props = {
    icon?: any;
    color: 'purple' | 'green' | 'white' | 'red';
    label: string;
    loading: boolean;
    form?: string;
    onClicked?: () => void;
    type: 'button' | 'submit';
}

const ProcessingButton = (props: Props) => {
    const { color, icon, form, label, loading, onClicked, type } = props
    const css = color === 'white' 
    ? 'btn btn-default'
    : `bg-${color}-700 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-${color}-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${color}-500 sm:w-auto`
    return (
        <button
            form={form}
            disabled={loading}
            type={type}
            onClick={typeof onClicked === 'function' ? onClicked : () => undefined}
            className={(loading? 'cursor-not-allowed disabled:opacity-50 ': '') + css}
        >
            {!loading && icon}
            {loading && <FontAwesomeIcon className="animate-spin h-5 w-5 mr-3" icon={['fas', 'spinner']} />}
            {loading ? 'Processing' : label}
        </button>
    )
}

export default ProcessingButton