import * as actionTypes from '../actions/actionTypes';
import {updateObject} from '../../shared/utility'; 

const initialState = {
    token: null,
    userId: null,
    error: null,
    loading: false,
    authRedirectPath: '/',
    passwordFailedToMatch: false
}

const authStart = (state) => {
    return updateObject(state, {
        error: null, 
        loading: true,
        passwordFailedToMatch: false
    })
}

const authSuccess = (state, action) => {
    return updateObject(state, {
        token: action.idToken,
        userId: action.userId,
        error: null,
        loading: false,
    })
}

const authFail = (state, action) => {
    return updateObject(state, {
        error: action.error,
        loading: false
    })
}

const setAuthRedirectPath = (state, action) => {
    return updateObject(state, {authRedirectPath: action.path})
}

const authLogout = (state) => {
    return updateObject(state, {
        token: null, 
        userId: null, 
    }) 
}

const passwordFailedToMatch = (state) => {
    return updateObject(state, {passwordFailedToMatch: true, error: null}); 
}

const resetErrors = (state) => {
    return updateObject(state, {error: null, passwordFailedToMatch: false}); 
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.AUTH_START:
            return authStart(state); 
        case actionTypes.AUTH_SUCCESS:
            return authSuccess(state, action);
        case actionTypes.AUTH_FAIL:
            return authFail(state, action); 
        case actionTypes.AUTH_LOGOUT:
            return authLogout(state); 
        case actionTypes.SET_AUTH_REDIRECT_PATH:
            return setAuthRedirectPath(state, action); 
        case actionTypes.PASSWORD_FAILED_TO_MATCH:
            return passwordFailedToMatch(state); 
        case actionTypes.RESET_ERRORS:
            return resetErrors(state); 
        default:
            return state;
    }
}

export default reducer; 