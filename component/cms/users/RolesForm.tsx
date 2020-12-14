import * as yup from 'yup'
import CmsConstant from "utils/cms-constant";

const roles = CmsConstant.roles;

export interface Inputs {
    admin_roles: string[];
}

export const schema = {
    admin_roles: yup.array(yup.string()).required()
}

export const defaultValues = {
    admin_roles: [],
}

type Props = {
    register: any;
}

const RolesForm = (props: Props) => {

    const { register } = props

    return (
        <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900 my-5">Roles</h3>
            <fieldset className="my-5">
                <div className="space-y-4">
                    <div className="grid grid-cols-12 gap-6">
                        {roles.map(role => {
                            return (<div key={role.id} className="col-span-6 sm:col-span-3"><div key={role.id} className="flex items-start">
                                <div className="h-5 flex items-center">
                                    <input ref={register} defaultValue={role.id} name="admin_roles"
                                        id={role.id}
                                        type="checkbox"
                                        className="sh-4 w-4 text-indigo-600 rounded outline-none focus:shadow-none" />
                                </div>
                                <div className="ml-3 text-sm">
                                    <label htmlFor={role.id} className="font-medium text-gray-700">{role.description}</label>
                                </div>
                            </div></div>)
                        })}
                    </div>

                </div>
            </fieldset>
        </div>
    )
}

export default RolesForm