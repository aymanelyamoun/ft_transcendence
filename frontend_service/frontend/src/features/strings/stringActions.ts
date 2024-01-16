import { SET_SELECTED_USER_ID } from "./stringTypes"

export const setSelectedUserId= (userId: string) => ({
    type: SET_SELECTED_USER_ID,
    payload: userId,
});