import { SET_SELECTED_USER_ID, SET_LOGGED_IN_USER_ID, SET_ADD_USER_PROFILE} from "./stringTypes";

const initialState = {
    selectedUserId: null,
    loggedInUserId: null,
    addUserProfile: null,
}

const stringReducer = (state = initialState, action: { type: string; payload: string; }) =>
{
    switch (action.type)
    {
        case SET_SELECTED_USER_ID:
            return { ...state, selectedUserId: action.payload};
        case SET_LOGGED_IN_USER_ID:
            return { ...state, loggedInUserId: action.payload};
        case SET_ADD_USER_PROFILE:
            return { ...state, addUserProfile: action.payload}
        default:
            return state;
    }
};

export default stringReducer;