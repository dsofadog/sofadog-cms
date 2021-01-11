import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'

import _ from 'lodash'

const MultiSelectLib: any = dynamic(
    () => import('multiselect-react-dropdown').then(module => module.Multiselect),
    {
        ssr: false
    }
)

type Option = {
    [k: string]: any;
    name: string;
}

type Props = {
    keyField: string;
    placeholder: string;
    options: Option[];
    displayValue?: string;
    singleSelect?: boolean,
    defaultValues: any[];
    name: string;
    onChanged?: Function
}

const MultiSelect = (props: Props) => {

    const { keyField, placeholder, options, displayValue, singleSelect, defaultValues, name, onChanged } = props
    const { register, setValue, trigger, errors } = useFormContext()

    const [selectedValues, setSelectedValues] = useState<Option[]>([])

    useEffect(() => {

        if (
            defaultValues && defaultValues.length > 0 &&
            options && options.length > 0
        ) {

            const list = []
            options.forEach((option: Option) => {
                if (defaultValues.includes(option[keyField])) {
                    list.push(option)
                }
            })
            setSelectedValues(list)
        }

        if (defaultValues && defaultValues.length === 0) {
            setSelectedValues([])
        }

    }, [defaultValues, options])

    useEffect(() => {
        if (name && register) {
            register(name)
        }
    }, [register, name])

    const select = (selectedList, selectedItem) => {
        let list: Option[]

        if (singleSelect) {
            list = [...selectedList]
            list.pop()
            list.push(selectedItem)
        } else {
            list = _.reject(selectedList, { [keyField]: selectedItem[keyField] })
            list = [...list, selectedItem]
        }
        updateValue(_.map(list, keyField))
    }

    const remove = (selectedList, removedItem) => {
        const list = _.reject(selectedList, { [keyField]: removedItem[keyField] })

        updateValue(_.map(list, keyField))
    }

    const updateValue = (list: string[]) => {
        setValue(name, list, {
            shouldDirty: true,
            shouldValidate: true
        })
        trigger(name)
        onChanged && onChanged(list)
    }

    return (
        <>
            <div className={singleSelect ? 'single-select' : 'multi-select'}>
                <MultiSelectLib
                    avoidHighlightFirstOption={true}
                    placeholder={placeholder}
                    singleSelect={!!singleSelect}
                    options={options} // Options to display in the dropdown
                    selectedValues={selectedValues} // Preselected value to persist in dropdown
                    onSelect={select} // Function will trigger on select event
                    onRemove={remove} // Function will trigger on remove event
                    displayValue={displayValue || 'name'} // Property name to display in the dropdown options
                    closeIcon="cancel"
                    style={{
                        searchBox: { // To change search box element look
                            'borderColor': errors[name] ? 'rgba(244, 63, 94)' : 'rgba(209, 213, 219)',
                            'borderRadius': '7px',
                            'fontSize': '0.875rem',
                            'minHeight': '38px',
                            'paddingTop': '1px',
                            'paddingLeft': '0px',
                            'paddingBottom': '0px',
                        },
                        inputField: { // To change input field position or margin
                            'fontSize': '0.875rem',
                            'margin': '0px',
                            'paddingTop': '0.3rem',
                            'paddingBottom': '0.3rem',
                            'paddingLeft': '0.65rem',
                            'paddingRight': '0.65rem',
                        },
                        optionContainer: {
                            'zIndex': '2',
                            'maxHeight': '150px'
                        },
                        option: {
                            'fontSize': '0.875rem',
                            'padding': '5px 10px'
                        },
                        chips: {
                            'margin': '4px',
                        }
                    }}
                />
                {errors[name] && <p className="mt-1 text-sm text-red-500">{errors[name].message}</p>}
            </div>

        </>
    )
}

export default MultiSelect