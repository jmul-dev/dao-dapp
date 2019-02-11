import { actionsEnums } from "../common/actionsEnums";

class TAOReducerState {
	constructor() {
		this.nameId = null;
		this.nameInfo = null;
	}
}

const handleSetNameId = (state, action) => {
	return {
		...state,
		nameId: action.nameId
	};
};

const handleSetNameInfo = (state, action) => {
	return {
		...state,
		nameInfo: action.nameInfo
	};
};

export const taoReducer = (state = new TAOReducerState(), action) => {
	switch (action.type) {
		case actionsEnums.SET_NAME_ID:
			return handleSetNameId(state, action);
		case actionsEnums.SET_NAME_INFO:
			return handleSetNameInfo(state, action);
		default:
			return state;
	}
};
