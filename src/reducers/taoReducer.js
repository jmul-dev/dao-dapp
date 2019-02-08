import { actionsEnums } from "../common/actionsEnums";

class TAOReducerState {
	constructor() {
		this.nameId = null;
	}
}

const handleSetNameId = (state, action) => {
	return {
		...state,
		nameId: action.nameId
	};
};

export const taoReducer = (state = new TAOReducerState(), action) => {
	switch (action.type) {
		case actionsEnums.SET_NAME_ID:
			return handleSetNameId(state, action);
		default:
			return state;
	}
};
