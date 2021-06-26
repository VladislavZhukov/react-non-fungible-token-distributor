import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import thunkMiddleware from "redux-thunk";
import appReducer from "./app-reducer";
import authReducer from "./auth-reducer";
import distributorReducer from "./distributor-reducer";
import { reducer as formReducer } from "redux-form";


let reducers = combineReducers({
    app: appReducer,
    auth: authReducer,
    distributor: distributorReducer,
    form: formReducer,
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducers, composeEnhancers(applyMiddleware(thunkMiddleware)));

window.___store___ = store;

export default store;