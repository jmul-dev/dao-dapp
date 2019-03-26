import { actionsEnums } from "common/actionsEnums";

class AppReducerState {
	constructor() {
		this.isMobileBrowser = false;
		this.singlePageView = true;
	}
}

const handleMobileBrowserDetection = (state, action) => {
	return {
		...state,
		isMobileBrowser: action.isMobileBrowser
	};
};

const handleToggleView = (state, action) => {
	return {
		...state,
		singlePageView: !state.singlePageView
	};
};

export const appReducer = (state = new AppReducerState(), action) => {
	switch (action.type) {
		case actionsEnums.DETECT_MOBILE_BROWSER:
			return handleMobileBrowserDetection(state, action);
		case actionsEnums.TOGGLE_VIEW:
			return handleToggleView(state, action);
		default:
			return state;
	}
};
