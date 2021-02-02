import { useState, useEffect } from "react";
import httpCms from "utils/http-cms";

import _ from 'lodash'

import Loader from "component/common/Loader";
import tokenManager from "utils/token-manager";
import notify from "utils/notify";

type Props = {
    onUserSelect: (user: any) => void
}

const UserList = (props: Props) => {

    const { onUserSelect } = props

    const [loading, setLoading] = useState<boolean>(false)
    const [users, setUsers] = useState(null);

    useEffect(() => {
        refresh();
    }, []);

    async function refresh() {
        try {
            setLoading(true);
            
            let url = tokenManager.attachToken(`admin_users`);
            const res = await httpCms.get(url)

            setUsers(_.sortBy(res.data.users, (user) => {
                return _.lowerCase(user.first_name)
            }));

            console.log(_.groupBy(users, 'email'))

        } catch (err) {
            notify('danger')
        } finally {
            setLoading(false);
        }

    }

    return (
        <>
            <Loader active={loading}>
                <ul className="divide-y divide-gray-200">
                    {users && users.map(user => {
                        return (
                            <li key={user.email}>
                                <a onClick={() => onUserSelect(user)} className={(user.disabled ? 'bg-gray-100' : '') + ' cursor-pointer block hover:bg-gray-50'}>
                                    <div className="flex items-center px-4 py-4 sm:px-6">
                                        <div className="min-w-0 flex-1 flex items-center">
                                            <div className="flex-shrink-0">
                                                <span className={(user.disabled ? 'bg-gray-400' : 'sfd-btn-primary') + ' cursor-pointer inline-flex items-center justify-center h-12 w-12 rounded-full'}>
                                                    <span className="text-lg font-medium leading-none text-white">
                                                        {user.first_name.charAt(0) + user.last_name.charAt(0)}
                                                    </span>
                                                </span>
                                            </div>
                                            <div className="min-w-0 flex-1 px-4 md:grid md:grid-cols-3 md:gap-4">
                                                <div>
                                                    <p className={(user.disabled ? 'text-gray-600' : 'text-indigo-600') + ' text-sm font-medium truncate'}>{user.first_name} {user.last_name}</p>
                                                    <p className="mt-2 flex items-center text-sm text-gray-500">
                                                        <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                                        </svg>
                                                        <span className="truncate">{user.email}</span>
                                                    </p>
                                                </div>
                                                <div className="hidden md:block">
                                                    <div>
                                                        <p className="text-sm text-gray-900">
                                                            Job title
                                                </p>
                                                        <p className="mt-2 flex items-center text-sm text-gray-500">
                                                            {user.job_title}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="hidden md:block">
                                                    <div>
                                                        <p className="text-sm text-gray-900">
                                                            Roles
                                                </p>
                                                        {user.admin_roles.map(role => (
                                                            <span key={user.email+'-'+role.id} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 mr-2">
                                                                {role.description}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    </div>
                                </a>
                            </li>
                        )
                    })}
                </ul>
            </Loader>

        </>

    )
}

export default UserList