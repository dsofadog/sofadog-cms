const ProgressSpinner = () => {
    return (
        <>
            <div className="fixed z-50 inset-0 overflow-y-auto">
                <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">

                    <div className="fixed inset-0 transition-opacity">
                        <div className="absolute inset-0 bg-black opacity-75"></div>
                    </div>

                    <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>&#8203;

                    <div className="inline-block align-bottom rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6" role="dialog" aria-modal="true" aria-labelledby="modal-headline">
                        <div className="w-full flex items-center justify-center">
                            <button type="button" className="cursor-wait bg-indigo-600 px-2 py-2 space-x-2 rounded flex text-white" disabled>
                                <div className="w-6 h-6 border-4 border-white rounded-full loader"></div>
                                <span>Processing</span>
                            </button>
                        </div>

                    </div>

                </div>
            </div>

        </>
    );
}

export default ProgressSpinner