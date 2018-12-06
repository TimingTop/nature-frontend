export const LOGIN_LOADING = 'LOGIN_LOADING';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';

export function loginLoading(data) {
    return {
        type: LOGIN_LOADING,
        payload: data
    }
}

export function loginSuccess(data) {
    return {
        type: LOGIN_SUCCESS,
        payload: data
    }
}

export function loginFailure(data) {
    return {
        type: LOGIN_FAILURE,
        payload: data
    }
}