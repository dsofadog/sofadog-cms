import * as React from "react";
import ConfirmationDialog, { ConfirmationOptions } from "component/common/ConfirmationDialog";

// https://dev.to/dmtrkovalenko/the-neatest-way-to-handle-alert-dialogs-in-react-1aoe

const ConfirmationContext = React.createContext<
    (options: ConfirmationOptions) => Promise<void>
>(Promise.reject);

const ConfirmationProvider = ({ children }) => {
    const [
        confirmationState,
        setConfirmationState
    ] = React.useState<ConfirmationOptions | null>(null);

    const awaitingPromiseRef = React.useRef<{
        resolve: () => void;
        reject: () => void;
    }>();

    const openConfirmation = (options: ConfirmationOptions) => {
        setConfirmationState(options);
        return new Promise<void>((resolve, reject) => {
            awaitingPromiseRef.current = { resolve, reject };
        });
    };

    const handleClose = () => {
        if (confirmationState.catchOnCancel && awaitingPromiseRef.current) {
            awaitingPromiseRef.current.reject();
        }

        setConfirmationState(null);
    };

    const handleSubmit = () => {
        if (awaitingPromiseRef.current) {
            awaitingPromiseRef.current.resolve();
        }

        setConfirmationState(null);
    };

    return (
        <ConfirmationContext.Provider value={openConfirmation}>
            <ConfirmationDialog
                open={Boolean(confirmationState)}
                onSubmit={handleSubmit}
                onClose={handleClose}
                {...confirmationState}
            />
            {children}
        </ConfirmationContext.Provider>
    );
};

export { ConfirmationContext, ConfirmationProvider }