import { getAuthUserData } from "./auth-reducer";

const SET_INITIALIZED_SUCCESS = "nft-distributor/app/SET_INITIALIZED_SUCCESS";

let initialState = {
    initialized: false
};

let appReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_INITIALIZED_SUCCESS:
            return {
                ...state,
                initialized: true
            };
        default:
            return state;
    }
};

//ActionCreator
const setInitializedSuccess = () => ({
    type: SET_INITIALIZED_SUCCESS
});
//ThunkCreator
export const initializeApp = () => async (dispatch) => {
    let promise = dispatch(getAuthUserData());
    await Promise.all([promise]);
    dispatch(setInitializedSuccess());
};


export default appReducer;
