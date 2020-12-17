import Settings from "component/common/Settings"
import { useSelector } from "react-redux";
import { RootState } from "rootReducer";

const Profile = () => {

    const { currentUser } = useSelector((state: RootState)=>state.auth);

    return (
        <Settings>
            <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Profile
                </h3>
                {/* <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    Personal details and application.
                </p> */}
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6 mb-10">
                <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                    <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">
                            Full name
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                            {currentUser.first_name} {currentUser.last_name}
                        </dd>
                    </div>
                    <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">
                            Job title
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                            {currentUser.job_title}
                        </dd>
                    </div>
                    <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">
                            Email address
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                            {currentUser.email}
                        </dd>
                    </div>
                    <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">
                            On shift
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                            <span className={(currentUser.on_shift ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800') + ' inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium'}>
                                <svg className={(currentUser.on_shift ? 'text-green-400' : ' text-gray-400') + ' -ml-1 mr-1.5 h-2 w-2'} fill="currentColor" viewBox="0 0 8 8">
                                    <circle cx="4" cy="4" r="3" />
                                </svg>
                                {currentUser.on_shift ? 'Yes' : 'No'}
                            </span>
                        </dd>
                    </div>
                    <div className="sm:col-span-2">
                        <dt className="text-sm font-medium text-gray-500">
                            Roles
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                            {currentUser.admin_roles.map(role => (
                                <span key={role.id} className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-gray-100 text-gray-800 mr-2">
                                    {role.description}
                                </span>
                            ))}
                        </dd>
                    </div>
                </dl>
            </div>
        </Settings>
    )
}
export default Profile