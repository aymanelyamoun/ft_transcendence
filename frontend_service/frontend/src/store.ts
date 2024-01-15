import { createStore, combineReducers } from 'redux';
import booleanReducer from './features/booleans/booleanReducer';
import stringReducer from './features/strings/stringReducer';

const rootReducer = combineReducers({
    booleans: booleanReducer,
    strings: stringReducer,
    // need to add here when neccessary
});

const store = createStore(rootReducer);

export default store;