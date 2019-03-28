import { actionsEnums } from "common/actionsEnums";

export const detectMobileBrowser = (isMobileBrowser) => {
	return {
		type: actionsEnums.DETECT_MOBILE_BROWSER,
		isMobileBrowser
	};
};

export const setNameId = (nameId) => {
	return {
		type: actionsEnums.SET_NAME_ID,
		nameId
	};
};

export const setLoggedInNameCompromised = (submittedTimestamp, lockedUntilTimestamp) => {
	return {
		type: actionsEnums.SET_LOGGED_IN_NAME_COMPROMISED,
		submittedTimestamp,
		lockedUntilTimestamp
	};
};

export const resetLoggedInNameCompromised = () => {
	return {
		type: actionsEnums.RESET_LOGGED_IN_NAME_COMPROMISED
	};
};
