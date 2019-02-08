import { actionsEnums } from "../../common/actionsEnums";

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
