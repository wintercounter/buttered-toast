import React, { createContext, useState, useEffect, useContext, useRef } from 'react'
import { createPortal } from 'react-dom'

export const defaultOptions = {
    duration: 3000,
    ref: null,
    Wrapper: ({ children }) => children,
    wrapperProps: {}
}

export const ToastContext = createContext()

export const ToastContextProvider = ({ children, options = defaultOptions }) => {
    const [opts, setOptions] = useState(options)
    const [Toast, setToast] = useState(null)
    const timeoutRef = useRef()
    const { ref, Wrapper, duration, wrapperProps } = opts

    useEffect(() => {
        clearTimeout(timeoutRef.current)
        if (Toast) {
            timeoutRef.current = setTimeout(() => {
                setToast(null)
                timeoutRef.current = null
            }, duration)
        }
    }, [Toast, opts])

    const show = (cmp, o) => {
        setOptions({ ...options, ...o })
        setToast(() => cmp)
    }

    return (
        <ToastContext.Provider value={{ show }}>
            {children}
            {Toast && ref && createPortal(<Wrapper {...wrapperProps}>{Toast}</Wrapper>, ref.current)}
            {Toast && !ref && <Wrapper {...wrapperProps}>{Toast}</Wrapper>}
        </ToastContext.Provider>
    )
}

export const useToast = () => {
    return useContext(ToastContext)
}
