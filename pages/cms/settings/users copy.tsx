import Settings from "component/common/Settings"
import { useContext } from "react";
import { LayoutContext } from "contexts";

const Password = () => {

    const {
        appUserInfo,
    } = useContext(LayoutContext);

    return (
        <Settings>
            <form action="#" method="POST">

                <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Password
                </h3>
                    {/* <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    Personal details and application.
                </p> */}
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:px-6 mb-10">
                    {/* Profile section */}
                    <div className="py-6 px-4 sm:p-6 lg:pb-8">
                        <div>
                            <h2 className="text-lg leading-6 font-medium text-gray-900">Profile</h2>
                            <p className="mt-1 text-sm text-gray-500">
                                This information will be displayed publicly so be careful what you share.
                            </p>
                        </div>

                        <div className="mt-6 flex flex-col lg:flex-row">
                            <div className="flex-grow space-y-6">
                                <div>
                                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                        Username
                                    </label>
                                    <div className="mt-1 rounded-md shadow-sm flex">
                                        <span className="bg-gray-50 border border-r-0 border-gray-300 rounded-l-md px-3 inline-flex items-center text-gray-500 sm:text-sm">
                                            workcation.com/
                                        </span>
                                        <input type="text" name="username" id="username" autoComplete="username" className="focus:ring-light-blue-500 focus:border-light-blue-500 flex-grow block w-full min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300" value="lisamarie" />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="about" className="block text-sm font-medium text-gray-700">
                                        About
                                    </label>
                                    <div className="mt-1">
                                        <textarea id="about" name="about" rows={3} className="shadow-sm focus:ring-light-blue-500 focus:border-light-blue-500 mt-1 block w-full sm:text-sm border-gray-300 rounded-md"></textarea>
                                    </div>
                                    <p className="mt-2 text-sm text-gray-500">
                                        Brief description for your profile. URLs are hyperlinked.
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 flex-grow lg:mt-0 lg:ml-6 lg:flex-grow-0 lg:flex-shrink-0">
                                <p className="text-sm font-medium text-gray-700" aria-hidden="true">
                                    Photo
                                </p>
                                <div className="mt-1 lg:hidden">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 inline-block rounded-full overflow-hidden h-12 w-12" aria-hidden="true">
                                            <img className="rounded-full h-full w-full" src="https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=80h" alt="" />
                                        </div>
                                        <div className="ml-5 rounded-md shadow-sm">
                                            <div className="group relative border border-gray-300 rounded-md py-2 px-3 flex items-center justify-center hover:bg-gray-50 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-light-blue-500">
                                                <label htmlFor="user_photo" className="relative text-sm leading-4 font-medium text-gray-700 pointer-events-none">
                                                    <span>Change</span>
                                                    <span className="sr-only"> user photo</span>
                                                </label>
                                                <input id="user_photo" name="user_photo" type="file" className="absolute w-full h-full opacity-0 cursor-pointer border-gray-300 rounded-md" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="hidden relative rounded-full overflow-hidden lg:block">
                                    <img className="relative rounded-full w-40 h-40" src="https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=320&h=320&q=80" alt="" />
                                    <label htmlFor="user-photo" className="absolute inset-0 w-full h-full bg-black bg-opacity-75 flex items-center justify-center text-sm font-medium text-white opacity-0 hover:opacity-100 focus-within:opacity-100">
                                        <span>Change</span>
                                        <span className="sr-only"> user photo</span>
                                        <input type="file" id="user-photo" name="user-photo" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer border-gray-300 rounded-md" />
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-12 gap-6">
                            <div className="col-span-12 sm:col-span-6">
                                <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">First name</label>
                                <input type="text" name="first_name" id="first_name" autoComplete="given-name" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-light-blue-500 focus:border-light-blue-500 sm:text-sm" />
                            </div>

                            <div className="col-span-12 sm:col-span-6">
                                <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">Last name</label>
                                <input type="text" name="last_name" id="last_name" autoComplete="family-name" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-light-blue-500 focus:border-light-blue-500 sm:text-sm" />
                            </div>

                            <div className="col-span-12">
                                <label htmlFor="url" className="block text-sm font-medium text-gray-700">URL</label>
                                <input type="text" name="url" id="url" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-light-blue-500 focus:border-light-blue-500 sm:text-sm" />
                            </div>

                            <div className="col-span-12 sm:col-span-6">
                                <label htmlFor="company" className="block text-sm font-medium text-gray-700">Company</label>
                                <input type="text" name="company" id="company" autoComplete="organization" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-light-blue-500 focus:border-light-blue-500 sm:text-sm" />
                            </div>
                        </div>
                    </div>

                    {/* Privacy section */}
                    <div className="pt-6 divide-y divide-gray-200">
                        <div className="px-4 sm:px-6">
                            <div>
                                <h2 className="text-lg leading-6 font-medium text-gray-900">Privacy</h2>
                                <p className="mt-1 text-sm text-gray-500">
                                    Ornare eu a volutpat eget vulputate. Fringilla commodo amet.
                                </p>
                            </div>
                            <ul className="mt-2 divide-y divide-gray-200">
                                <li className="py-4 flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <p id="privacy-option-label-1" className="text-sm font-medium text-gray-900">
                                            Available to hire
                                        </p>
                                        <p id="privacy-option-description-1" className="text-sm text-gray-500">
                                            Nulla amet tempus sit accumsan. Aliquet turpis sed sit lacinia.
                                        </p>
                                    </div>
                                    {/* On: "bg-teal-500", Off: "bg-gray-200" */}
                                    <button type="button" aria-pressed="true" aria-labelledby="privacy-option-label-1" aria-describedby="privacy-option-description-1" className="ml-4 bg-gray-200 relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-light-blue-500">
                                        <span className="sr-only">Use setting</span>
                                        {/* On: "translate-x-5", Off: "translate-x-0" */}
                                        <span aria-hidden="true" className="translate-x-0 inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"></span>
                                    </button>
                                </li>
                                <li className="py-4 flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <p id="privacy-option-label-2" className="text-sm font-medium text-gray-900">
                                            Make account private
                                        </p>
                                        <p id="privacy-option-description-2" className="text-sm text-gray-500">
                                            Pharetra morbi dui mi mattis tellus sollicitudin cursus pharetra.
                                        </p>
                                    </div>
                                    {/* On: "bg-teal-500", Off: "bg-gray-200" */}
                                    <button type="button" aria-pressed="false" aria-labelledby="privacy-option-label-2" aria-describedby="privacy-option-description-2" className="ml-4 bg-gray-200 relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-light-blue-500">
                                        <span className="sr-only">Use setting</span>
                                        {/* On: "translate-x-5", Off: "translate-x-0" */}
                                        <span aria-hidden="true" className="translate-x-0 inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"></span>
                                    </button>
                                </li>
                                <li className="py-4 flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <p id="privacy-option-label-3" className="text-sm font-medium text-gray-900">
                                            Allow commenting
                                        </p>
                                        <p id="privacy-option-description-3" className="text-sm text-gray-500">
                                            Integer amet, nunc hendrerit adipiscing nam. Elementum ame
                                        </p>
                                    </div>
                                    {/* On: "bg-teal-500", Off: "bg-gray-200" */}
                                    <button type="button" aria-pressed="true" aria-labelledby="privacy-option-label-3" aria-describedby="privacy-option-description-3" className="ml-4 bg-gray-200 relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-light-blue-500">
                                        <span className="sr-only">Use setting</span>
                                        {/* On: "translate-x-5", Off: "translate-x-0" */}
                                        <span aria-hidden="true" className="translate-x-0 inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"></span>
                                    </button>
                                </li>
                                <li className="py-4 flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <p id="privacy-option-label-4" className="text-sm font-medium text-gray-900">
                                            Allow mentions
                                        </p>
                                        <p id="privacy-option-description-4" className="text-sm text-gray-500">
                                            Adipiscing est venenatis enim molestie commodo eu gravid
                                        </p>
                                    </div>
                                    {/* On: "bg-teal-500", Off: "bg-gray-200" */}
                                    <button type="button" aria-pressed="true" aria-labelledby="privacy-option-label-4" aria-describedby="privacy-option-description-4" className="ml-4 bg-gray-200 relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-light-blue-500">
                                        <span className="sr-only">Use setting</span>
                                        {/* On: "translate-x-5", Off: "translate-x-0" */}
                                        <span aria-hidden="true" className="translate-x-0 inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"></span>
                                    </button>
                                </li>
                            </ul>
                        </div>

                    </div>
                </div>
                <div className="mt-4 py-4 px-4 flex justify-end sm:px-6 divide-gray-200">
                    <button type="button" className="bg-white border border-gray-300 rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-light-blue-500">
                        Cancel
                            </button>
                    <button type="submit" className="ml-5 bg-blue-700 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        Save
                            </button>
                </div>
            </form>

        </Settings>
    )
}
export default Password