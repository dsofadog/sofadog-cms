const NewsItemsHeader = () => {
    return (
        <header className="bg-white shadow z-10">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between">
                <h1 className="text-3xl font-bold leading-tight text-gray-900">
                    News Items
                </h1>
                <div className="mt-3 flex sm:mt-0 sm:ml-4">
                    <button type="button" className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        New
                    </button>
                </div>
            </div>
        </header>
    )
}

export default NewsItemsHeader