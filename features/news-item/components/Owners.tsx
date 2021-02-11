import StatusBadge, { Status } from "./StatusBadge"
import _ from 'lodash'

const Owner = (props: { status: string; email: string }) => {

    const { status, email } = props

    return (
        <>
            <span className="w-full inline-flex truncate flex items-center justify-between text-xs">
                <span className="inline-block">
                    <StatusBadge name={status as Status} />
                </span>
                <span className="truncate text-gray-500">
                   {email || 'Unclaimed'}
                </span>
            </span>
        </>
    )
}

const OwnerListItem = (props: {selected: boolean; status: string; email: string}) => {
    const {selected, status, email} = props
    return (
        <li id="listbox-item-0" role="option" className={'text-gray-900 cursor-default select-none relative py-2 pl-3 pr-3'}>
            <div className="flex">
                <Owner status={status} email={email}/>
            </div>
        </li>
    )
}

type Props = {
    newsItem: any
}

import cmsConstants from 'utils/cms-constant'
import { useOutsideClickRef } from "rooks"
import { useState } from "react"

const Owners = (props: Props) => {

    const { newsItem } = props

    const [ref] = useOutsideClickRef(() => setDropdownIsActive(false));
    const [dropdownIsActive, setDropdownIsActive] = useState<boolean>(false)

    return (
        <>

            <div ref={ref}>
                <div className="mt-1 relative">
                    <button onClick={()=>setDropdownIsActive(!dropdownIsActive)} type="button" aria-haspopup="listbox" aria-expanded="true" aria-labelledby="listbox-label" className="relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-9 py-1.5 text-left cursor-default focus:outline-none text-xs">
                        <Owner status={newsItem?.state} email={newsItem?.owners[newsItem?.state]}/>
                        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                            <svg className="h-3 w-3 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </span>
                    </button>
                    {dropdownIsActive && <div className="absolute mt-1 w-full z-20 rounded-md bg-white shadow-lg">
                        <ul tabIndex={-1} role="listbox" aria-labelledby="listbox-label" aria-activedescendant="listbox-item-3" className="max-h-80 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                            {_.keys(cmsConstants.Status1).map(status=>{
                                return <OwnerListItem 
                                key={status}
                                selected={status === newsItem?.state}
                                status={status}
                                email={newsItem?.owners[status]}
                                />
                            })}
                        </ul>
                    </div>}
                </div>
            </div>
        </>
    )
}

export default Owners

