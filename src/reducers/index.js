import { combineReducers } from "redux";
import { routerReducer } from "react-router-redux";
import { web3Reducer } from "./web3Reducer";
import { toastReducer } from "./toastReducer";
import { appReducer } from "./appReducer";
import { contractReducer } from "./contractReducer";
import { nameReducer } from "./nameReducer";
import { taoReducer } from "./taoReducer";

export const reducers = combineReducers({
	web3Reducer,
	toastReducer,
	appReducer,
	contractReducer,
	nameReducer,
	taoReducer,
	routing: routerReducer
});
