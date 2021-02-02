import { useState, useEffect } from 'react';

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from 'yup'
import _ from 'lodash'

import ProcessingButton from 'component/common/ProcessingButton';
import SubmitButton from "component/common/SubmitButton";
import httpCms from 'utils/http-cms';
import BasicInformationForm, {
    Inputs as BasicInformationInputs,
    schema as rawBasicInformationSchema,
    defaultValues as basicInformationDefaultValues
} from './BasicInformationForm';
import RolesForm, {
    Inputs as RolesInputs,
    schema as rawRolesSchema,
    defaultValues as rolesDefaultValues
} from './RolesForm';
import PasswordForm, {
    Inputs as PasswordInputs,
    schema as rawPasswordSchema,
    defaultValues as passwordDefaultValues
} from './PasswordForm';
import tokenManager from 'utils/token-manager';
import notify from 'utils/notify';


const basicInformationSchema = yup.object().shape({
    first_name: rawBasicInformationSchema.first_name,
    last_name: rawBasicInformationSchema.last_name,
    job_title: rawBasicInformationSchema.job_title,
})

const rolesSchema = yup.object().shape({
    ...rawRolesSchema,
})

const passwordSchema = yup.object().shape({
    ...rawPasswordSchema
})

type Props = {
    user: any;
}

enum Tab {
    BasicInformation = 'basic_information',
    Roles = 'roles',
    ChangePassword = 'change_password',
    Settings = 'settings'
}

const commonTabCss = 'cursor-pointer px-3 py-2 font-medium text-sm rounded-md'
const activeTabCss = 'bg-gray-100 text-gray-700 ' + commonTabCss
const inactiveTabCss = 'text-gray-500 hover:text-gray-700 ' + commonTabCss

const EditUserForm = (props: Props) => {

    const {
        user
    } = props

    const basicInformationForm = useForm<BasicInformationInputs>({
        resolver: yupResolver(basicInformationSchema),
        defaultValues: basicInformationDefaultValues,
    })
    const rolesForm = useForm<RolesInputs>({
        resolver: yupResolver(rolesSchema),
        defaultValues: rolesDefaultValues,
    })
    const passwordForm = useForm<PasswordInputs>({
        resolver: yupResolver(passwordSchema),
        defaultValues: passwordDefaultValues,
    })

    const [updatedUser, setUpdatedUser] = useState(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [changingStatus, setChangingStatus] = useState<boolean>(false)
    const [currentTab, setCurrentTab] = useState<Tab>(Tab.BasicInformation)


    useEffect(() => {
        resetBasicInformationForm(user)
        resetRolesForm(user)
        setUpdatedUser(user)
    }, [])

    const submitInformation = async (data: BasicInformationInputs) => {
        try {
            setLoading(true);

            const { email } = updatedUser
            const payload = basicInformationSchema.cast(data)

            const res = await httpCms.patch(tokenManager.attachToken(`admin_user/${email}`), payload)

            resetBasicInformationForm(res.data.user)
            setUpdatedUser(res.data.user)

            notify('success')
        } catch (err) {
            resetBasicInformationForm(updatedUser)
            notify('danger')
        } finally {
            setLoading(false);
        }
    }

    const submitRoles = async (data: RolesInputs) => {
        try {
            setLoading(true);

            const { admin_roles: rawOldRoles, email } = updatedUser
            const { admin_roles: newRoles } = basicInformationSchema.cast(data)

            const oldRoles = rawOldRoles.map(role => role.id)

            const missingNewRoles = _.difference(newRoles, oldRoles)
            const missingOldRoles = _.difference(oldRoles, newRoles)

            let res: any

            for (const role of missingNewRoles) {
                const url = tokenManager.attachToken(`admin_user/${email}/add_role`)
                const payload = { email: user.email, role }
                res = await httpCms.patch(url, payload)
            }
            for (const role of missingOldRoles) {
                const url = tokenManager.attachToken(`admin_user/${email}/remove_role`)
                const payload = { email: user.email, role }
                res = await httpCms.patch(url, payload)
            }

            resetRolesForm(res.data.user)
            setUpdatedUser(res.data.user)

            notify('success')
        } catch (err) {
            resetRolesForm(updatedUser)
            notify('danger')
        } finally {
            setLoading(false);
        }
    }


    const submitPassword = async (data: PasswordInputs) => {
        try {
            setLoading(true);

            const { email } = updatedUser
            const { password } = passwordSchema.cast(data)
            const payload = {
                email,
                password
            }

            await httpCms.post(tokenManager.attachToken(`admin_user/${email}/set_password`), payload)

            passwordForm.reset(passwordDefaultValues)

            notify('success')
        } catch (err) {
            notify('danger')
        } finally {
            setLoading(false);
        }
    }

    const changeUserStatus = async (action: 'enable' | 'disable') => {
        try {
            setChangingStatus(true);

            const { email } = updatedUser
            const payload = {
                email,
            }

            const res = await httpCms.post(tokenManager.attachToken(`admin_user/${email}/${action}`), payload)

            setUpdatedUser(res.data.user)

            notify('success')
        } catch (err) {
            notify('danger')
        } finally {
            setChangingStatus(false);
        }
    }

    // const deleteUser = async () => {

    // }

    function resetBasicInformationForm(user: any) {
        const {
            first_name,
            last_name,
            email,
            job_title,
        } = user

        basicInformationForm.reset({
            first_name,
            last_name,
            email,
            job_title
        })
    }

    function resetRolesForm(user: any) {
        const { admin_roles } = user

        rolesForm.reset({ admin_roles: admin_roles ? admin_roles.map(role => role.id) : [] })
    }

    return (
        <>
            <div className="px-5 py-3 border-b">
                <div className="sm:hidden">
                    <label htmlFor="tabs" className="sr-only">Select a tab</label>
                    <select onChange={(e)=>setCurrentTab(e.target.value as Tab)} id="tabs" name="tabs" className="block w-full focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md">
                        <option value={Tab.BasicInformation}>Basic Information</option>
                        <option value={Tab.Roles}>Roles</option>
                        <option value={Tab.ChangePassword}>Change password</option>
                        <option value={Tab.Settings}>Status</option>
                    </select>
                </div>
                <div className="hidden sm:block">
                    <nav className="flex space-x-4" aria-label="Tabs">
                        <a onClick={() => setCurrentTab(Tab.BasicInformation)} className={currentTab === Tab.BasicInformation ? activeTabCss : inactiveTabCss}>
                            Information
                        </a>
                        <a onClick={() => setCurrentTab(Tab.Roles)} className={currentTab === Tab.Roles ? activeTabCss : inactiveTabCss}>
                            Roles
                        </a>
                        <a onClick={() => setCurrentTab(Tab.ChangePassword)} className={currentTab === Tab.ChangePassword ? activeTabCss : inactiveTabCss}>
                            Change password
                        </a>
                        <a onClick={() => setCurrentTab(Tab.Settings)} className={currentTab === Tab.Settings ? activeTabCss : inactiveTabCss}>
                            Settings
                        </a>
                    </nav>
                </div>
            </div>
            <div className="mt-5 md:mt-0 md:col-span-2">
                {currentTab === Tab.BasicInformation && <form onSubmit={basicInformationForm.handleSubmit(submitInformation)} autoComplete="off">
                    <div className="shadow overflow-hidden sm:rounded-md">
                        <div className="px-4 py-5 bg-white sm:p-6">
                            <div className="space-y-8 divide-y divide-gray-200">
                                <BasicInformationForm emailDisabled={true} errors={basicInformationForm.errors} register={basicInformationForm.register} />
                            </div>
                        </div>
                        <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                            <SubmitButton label='Save' loading={loading} />
                        </div>
                    </div>
                </form>}

                {currentTab === Tab.Roles && <form onSubmit={rolesForm.handleSubmit(submitRoles)} autoComplete="off">
                    <div className="shadow overflow-hidden sm:rounded-md">
                        <div className="px-4 py-5 bg-white sm:p-6">
                            <div className="space-y-8 divide-y divide-gray-200">
                                <RolesForm register={rolesForm.register} />
                            </div>
                        </div>
                        <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                            <SubmitButton label='Save' loading={loading} />
                        </div>
                    </div>
                </form>}

                {currentTab === Tab.ChangePassword && <form onSubmit={passwordForm.handleSubmit(submitPassword)} autoComplete="off">
                    <div className="shadow overflow-hidden sm:rounded-md">
                        <div className="px-4 py-5 bg-white sm:p-6">
                            <div className="space-y-8 divide-y divide-gray-200">
                                <PasswordForm hideTitle={true} errors={passwordForm.errors} register={passwordForm.register} />
                            </div>
                        </div>
                        <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                            <SubmitButton label='Save' loading={loading} />
                        </div>
                    </div>
                </form>}

                {currentTab === Tab.Settings && <form autoComplete="off">
                    <div className="shadow overflow-hidden sm:rounded-md">
                        <div className="px-4 py-5 bg-white sm:p-6">
                            <div className="space-y-8 divide-y divide-gray-200">
                                <div>
                                    <p className="mb-5">{updatedUser.first_name} {updatedUser.last_name} is currently <span className={(updatedUser.disabled ? 'text-red-600' : 'text-green-600') + ' font-semibold'}>{updatedUser.disabled ? 'disabled' : 'enabled'}</span>.</p>
                                    {updatedUser.disabled && <ProcessingButton label='Enable user' type='button' color='white' loading={changingStatus} onClicked={() => changeUserStatus('enable')} />}
                                    {!updatedUser.disabled && <ProcessingButton label='Disable user' type='button' color='white' loading={changingStatus} onClicked={() => changeUserStatus('disable')} />}
                                </div>
                                {/* <div>
                                    <p className="my-5">Once you delete the user, there is no going back. Please be certain.</p>
                                    <ProcessingButton label='Delete user' type='button' color='red' loading={false} onClicked={deleteUser} />
                                </div> */}
                            </div>
                        </div>
                    </div>
                </form>}


            </div>
        </>
    )
}

export default EditUserForm