import { combineReducers } from 'redux';
import {
    LOGIN_LOADING,
    LOGIN_SUCCESS,
    LOGIN_FAILURE
} from '../actions';

export let initialState = {
    auth: {
        user: null
    },
    loginPageData: {
        loading: false,
        error: null
    }
};

let authReducer = function(state = {}, action) {
    switch(action.type) {
        case LOGIN_SUCCESS:
            return {...state, user: action.playload};
        default: 
            return state;
    }
}

let loginPageDataReducer = function(state = {}, action) {
    switch(action.type) {
        case LOGIN_LOADING:
            return {...state, loading: action.playload};
        case LOGIN_SUCCESS:
            return {...state, error: null};
        case LOGIN_FAILURE:
            return {...state, error: action.playload};
    }
}

export default combineReducers({
    auth: authReducer,
    loginPageData： loginPageDataReducer
})

