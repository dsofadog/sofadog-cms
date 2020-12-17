import httpCms from 'utils/http-cms'
import tokenManager from 'utils/token-manager'
import { User } from './login.api'

export interface ToggleShiftRequestPayload {
    email: string;
}

export interface ToggleShiftResponsePayload {
    user: User
}

export async function toggleShift(
    email: string
) {
    try {
        const url = tokenManager.attachToken(`admin_user/${email}/toggle_shift`)
        
        const payload = {
            email,
        }

        const {data} = await httpCms.patch<ToggleShiftResponsePayload>(url, payload)

        return data

    }catch(err){
        throw err
    }
}