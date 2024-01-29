import { SET_ADD_USER_PROFILE, SET_SELECTED_USER_ID } from "./stringTypes";
import { SET_LOGGED_IN_USER_ID } from "./stringTypes";

export const setSelectedUserId= (userId: string) => ({
    type: SET_SELECTED_USER_ID,
    payload: userId,
});

export const setLoggedInUserId = (userId: string) => ({
    type: SET_LOGGED_IN_USER_ID,
    payload: userId,
});

export const setAddUserProfile = (userId: string) => ({
    type: SET_ADD_USER_PROFILE,
    payload: userId,
});