import { TOGGLE_SHOW_GROUPS, TOGGLE_SEARCH_FETCH, TOGGLE_FETCH_FRIENDS } from "./booleanTypes";

const initialState = {
    showGroups: false,
    activeFetch: false,
    fetchFriends: false,
};

const booleanReducer = (state = initialState, action: { type: any; }) => {
    switch (action.type)
    {
        case TOGGLE_SHOW_GROUPS:
            return { ...state, showGroups: !state.showGroups };
        case TOGGLE_SEARCH_FETCH:
            return { ...state, activeFetch: !state.activeFetch };
        case TOGGLE_FETCH_FRIENDS: 
            return { ...state, fetchFriends: !state.fetchFriends};
        default: 
            return state;
    }
};

export default booleanReducer;