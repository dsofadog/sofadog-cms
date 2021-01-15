import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

type Props = {
    active: boolean;
    message?: string;
    children?: any;
}

const Loader = (props: Props) => {

    const { active, children, message } = props

    return (
        <>
            {active && (
                <div className="box-border p-4">
                    <div className="flex flex-row justify-center items-center">
                        <FontAwesomeIcon className="w-12 h-12 p-2 rounded-full" icon={['fas', 'spinner']} spin />
                        <p>{message || 'Loading...'}</p>
                    </div>
                </div>
            )}

            {!active && children}
        </>
    )
}

export default Loader