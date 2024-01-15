import { createStore, combineReducers } from 'redux';
import booleanReducer from './features/booleans/booleanReducer';

const rootReducer = combineReducers({
    booleans: booleanReducer,
    // need to add here when neccessary
});

const store = createStore(rootReducer);

export default store;