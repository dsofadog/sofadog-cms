import Settings from "component/common/Settings"
import { useState, useEffect } from "react";

import _ from 'lodash'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import CreateUserForm from "component/cms/users/CreateUserForm";
import UserList from "component/cms/users/UserList";
import EditUserForm from "component/cms/users/EditUserForm";


enum Mode {
    Add = 'add',
    Edit = 'edit',
    View = 'view'
}

const Users = () => {

    const [mode, setMode] = useState<Mode>(Mode.View)
    const [user, setUser] = useState(null)

    useEffect(() => {
        if (user) {
            setMode(Mode.Edit)
        }
    }, [user])

    return (
        <Settings>
            <div className="flex items-center justify-between px-4 py-5 sm:px-6">
                <div className="flex items-center">
                    {mode !== Mode.View && <button type="button" className="btn btn-default mr-5" onClick={() => setMode(Mode.View)}>
                        <FontAwesomeIcon className="w-3 mr-2" icon={['fas', 'chevron-left']} />
                    Back
                </button>}
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                        {mode === Mode.View && 'Users'}
                        {mode === Mode.Add && 'Create user'}
                        {mode === Mode.Edit && 'Edit user'}
                    </h3>
                </div>

                {mode === Mode.View && <button type="button" className={'btn btn-green'} onClick={() => setMode(Mode.Add)}>
                    <FontAwesomeIcon className="w-3 mr-2" icon={['fas', 'plus']} />
                    New
                </button>}
            </div>

            <div className="border-t">
                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                    {mode === Mode.Add && <CreateUserForm callback={(success) => {
                        if (success) {
                            setMode(Mode.View)
                        }
                    }} />}
                    {mode === Mode.Edit && <EditUserForm
                    user={user} />}
                    {mode === Mode.View && <UserList onUserSelect={(user) => setUser(user)} />}
                </div>
            </div>

        </Settings>
    )
}

export default Users