import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

type Props = {
    active: boolean;
    children: any;
}

const MiniLoader = (props: Props) => {

    const { active, children } = props

    return (
        <>
            <div>
                <div className="flex flex-row justify-center items-center">
                    {children}

                    {active && <FontAwesomeIcon className="w-4 h-4 ml-1  rounded-full" icon={['fas', 'spinner']} spin />}
                </div>
            </div>
        </>
    )
}

export default MiniLoader