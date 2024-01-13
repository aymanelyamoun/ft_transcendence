import { TOGGLE_SHOW_GROUPS } from "./booleanTypes";

const initialState = {
    showGroups: false,
};

const booleanReducer = (state = initialState, action: { type: any; }) => {
    switch (action.type)
    {
        case TOGGLE_SHOW_GROUPS:
            console.log("ShowGroups state: ", !state.showGroups);
            return { ...state, showGroups: !state.showGroups };
        default: 
            return state;
    }
};

export default booleanReducer;