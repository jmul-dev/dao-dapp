import { actionsEnums } from "../common/actionsEnums";

class ToastReducerState {
	constructor() {
		this.type = "info"; // info, danger, success
		this.headline = "";
		this.message = "";
		this.persisted = false;
	}
}

const handleSetErrorToast = (state, action) => {
	return {
		...state,
		type: "danger",
		headline: action.headline,
		message: action.message,
		persisted: action.persisted
	};
};

const handleSetInfoToast = (state, action) => {
	return {
		...state,
		type: "info",
		headline: action.headline,
		message: action.message
	};
};

const handleSetSuccessToast = (state, action) => {
	return {
		...state,
		type: "success",
		headline: action.headline,
		message: action.message
	};
};

const handleClearToast = (state, action) => {
	return {
		...state,
		type: "info",
		headline: "",
		message: "",
		persisted: false
	};
};

export const toastReducer = (state = new ToastReducerState(), action) => {
	switch (action.type) {
		case actionsEnums.SET_ERROR_TOAST:
			return handleSetErrorToast(state, action);
		case actionsEnums.SET_INFO_TOAST:
			return handleSetInfoToast(state, action);
		case actionsEnums.SET_SUCCESS_TOAST:
			return handleSetSuccessToast(state, action);
		case actionsEnums.CLEAR_TOAST:
			return handleClearToast(state, action);
		default:
			return state;
	}
};
