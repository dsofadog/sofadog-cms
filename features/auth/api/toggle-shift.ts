import httpCms from 'utils/http-cms'
// import configManager from ''

export interface User {
    admin_roles: {
        id: string;
        deescription: string;
    }[],
    disabled: boolean | null;
    email: string;
    first_name: string;
    job_title: string;
    last_name: string;
    on_shift: boolean;
}

export interface LoginRequestPayload {
    username: string;
    password: string;
}

export interface LoginResponsePayload {
    token: string;
    user: User
}

export async function login(
    email: string,
    password: string
) {
    try {
        const url = 'admin_user/login'
        
        const payload = {
            email,
            password
        }

        const {data} = await httpCms.post<LoginResponsePayload>(url, payload)

        return data

    }catch(err){
        throw err
    }
}