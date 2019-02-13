import { actionsEnums } from "common/actionsEnums";

class TAOReducerState {
	constructor() {
		this.names = [];
	}
}

const handleSetNames = (state, action) => {
	return {
		...state,
		names: action.names
	};
};

const handleAppendName = (state, action) => {
	const { names } = state;
	if (!names.find((name) => name.nameId === action.name.nameId)) {
		const _name = {
			nameId: action.name.nameId,
			name: action.name.name
		};
		names.push(_name);
	}
	return {
		...state,
		names
	};
};

export const taoReducer = (state = new TAOReducerState(), action) => {
	switch (action.type) {
		case actionsEnums.SET_NAMES:
			return handleSetNames(state, action);
		case actionsEnums.APPEND_NAME:
			return handleAppendName(state, action);
		default:
			return state;
	}
};
