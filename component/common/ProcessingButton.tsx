import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

type Props = {
    className?: string;
    icon?: any;
    color: 'purple' | 'green' | 'white' | 'red';
    label: string;
    loading: boolean;
    form?: string;
    onClicked?: () => void;
    disabled?: boolean;
    type: 'button' | 'submit';
}

const ProcessingButton = (props: Props) => {
    const { className, color, icon, form, label, loading, onClicked, type, disabled } = props
    const css = (color === 'white'
        ? 'btn btn-default'
        : `bg-${color}-700 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-${color}-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${color}-500 sm:w-auto`)
        + (className ? ' ' + className : '')
    return (
        <button
            form={form}
            disabled={loading || disabled}
            type={type}
            onClick={typeof onClicked === 'function' ? onClicked : () => undefined}
            className={(loading || disabled? 'cursor-not-allowed disabled:opacity-50 ': '') + css}
        >
            {!loading && icon}
            {loading && <FontAwesomeIcon className="animate-spin h-5 w-5 mr-3" icon={['fas', 'spinner']} />}
            {loading ? 'Processing' : label}
        </button>
    )
}

export default ProcessingButton