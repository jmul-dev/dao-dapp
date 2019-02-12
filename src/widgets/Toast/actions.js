import { actionsEnums } from "common/actionsEnums";

export const setError = (headline, message, persisted) => {
	return {
		type: actionsEnums.SET_ERROR_TOAST,
		headline,
		message,
		persisted
	};
};

export const setInfo = (headline, message) => {
	return {
		type: actionsEnums.SET_INFO_TOAST,
		headline,
		message
	};
};

export const setSuccess = (headline, message) => {
	return {
		type: actionsEnums.SET_SUCCESS_TOAST,
		headline,
		message
	};
};

export const clearToast = () => {
	return {
		type: actionsEnums.CLEAR_TOAST
	};
};
