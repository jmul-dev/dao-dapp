import { combineReducers } from "redux";
import { routerReducer } from "react-router-redux";
import { web3Reducer } from "./web3Reducer";
import { toastReducer } from "./toastReducer";
import { appReducer } from "./appReducer";
import { contractReducer } from "./contractReducer";
import { nameReducer } from "./nameReducer";
import { globalReducer } from "./globalReducer";

export const reducers = combineReducers({
	web3Reducer,
	toastReducer,
	appReducer,
	contractReducer,
	nameReducer,
	globalReducer,
	routing: routerReducer
});
