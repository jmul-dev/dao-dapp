import { combineReducers } from "redux";
import { routerReducer } from "react-router-redux";
import { web3Reducer } from "./web3Reducer";
import { toastReducer } from "./toastReducer";
import { appReducer } from "./appReducer";

export const reducers = combineReducers({
	web3Reducer,
	toastReducer,
	appReducer,
	routing: routerReducer
});
