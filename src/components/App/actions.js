import { actionsEnums } from "../../common/actionsEnums";

export const detectMobileBrowser = (isMobileBrowser) => {
	return {
		type: actionsEnums.DETECT_MOBILE_BROWSER,
		isMobileBrowser
	};
};
