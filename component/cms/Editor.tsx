import React, { useEffect, useRef } from 'react'
import 'trix';

const Editor = ({ value, onChange }) => {
    const trixEditor = useRef(null)

    useEffect(() => {
        trixEditor.current.addEventListener('trix-change', (e) => {
            onChange(trixEditor.current.value)
        })
    }, [trixEditor])

    useEffect(() => {
        if (!trixEditor.current) return
        if (trixEditor.current.inputElement.value === value) return
        trixEditor.current.value = value
    }, [value])

    return (
        React.createElement('trix-editor', { ref: trixEditor })
    )
}

export default Editor