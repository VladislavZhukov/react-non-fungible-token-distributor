import { waxAPI } from "../api/apiWAX";
import { setErrorMessage } from "./distributor-reducer";

const SET_USER_DATA = "nft-distributor/auth/SET_USER_DATA";

let initialState = {
    userAccount: null,
    pubKeys: null,
    isAuth: false
};

let authReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_USER_DATA:
            return {
                ...state,
                ...action.data
            };
        default:
            return state;
    }
};

//ActionCreator
const setAuthUserData = (userAccount, pubKeys, isAuth) => ({
    type: SET_USER_DATA,
    data: { userAccount, pubKeys, isAuth }
});
//ThunkCreator
export const getAuthUserData = () => async (dispatch) => {
    const response = await waxAPI.login();
    if (response !== undefined) {
        dispatch(setAuthUserData(response.userAccount, response.pubKeys, true));
    } else if (response === undefined) {
        dispatch(setErrorMessage('wax wallet is buggy, push F5 button, maybe this will decide trouble'));
    }
};

export default authReducer;