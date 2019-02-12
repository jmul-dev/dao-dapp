import { actionsEnums } from "common/actionsEnums";

class AppReducerState {
	constructor() {
		this.isMobileBrowser = false;
	}
}

const handleMobileBrowserDetection = (state, action) => {
	return {
		...state,
		isMobileBrowser: action.isMobileBrowser
	};
};

export const appReducer = (state = new AppReducerState(), action) => {
	switch (action.type) {
		case actionsEnums.DETECT_MOBILE_BROWSER:
			return handleMobileBrowserDetection(state, action);
		default:
			return state;
	}
};
