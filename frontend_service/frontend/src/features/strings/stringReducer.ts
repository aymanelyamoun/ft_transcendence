import { SET_SELECTED_USER_ID } from "./stringTypes";

const initialState = {
    selectedUserId: null,
}

const stringReducer = (state = initialState, action: { type: string; payload: string; }) =>
{
    switch (action.type)
    {
        case SET_SELECTED_USER_ID:
            return { ...state, selectedUserId: action.payload};
        default:
            return state;
    }
};

export default stringReducer;