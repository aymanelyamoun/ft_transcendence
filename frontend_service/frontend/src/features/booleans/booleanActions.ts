import { TOGGLE_SHOW_GROUPS, TOGGLE_SEARCH_FETCH, TOGGLE_FETCH_FRIENDS } from "./booleanTypes";

export const toggleShowGroups = () => ({
    type: TOGGLE_SHOW_GROUPS,
});

export const toggleSearchFetch = () => ({
    type: TOGGLE_SEARCH_FETCH,
});

export const toggleFetchFriends = () => ({
    type: TOGGLE_FETCH_FRIENDS,
});