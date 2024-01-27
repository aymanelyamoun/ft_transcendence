import { TOGGLE_SHOW_GROUPS, TOGGLE_SEARCH_FETCH } from "./booleanTypes";

export const toggleShowGroups = () => ({
    type: TOGGLE_SHOW_GROUPS,
});

export const toggleSearchFetch = () => ({
    type: TOGGLE_SEARCH_FETCH,
});