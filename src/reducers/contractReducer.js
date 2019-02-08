import { actionsEnums } from "../common/actionsEnums";

class ContractReducerState {
	constructor() {
		this.nameFactory = null;
	}
}

const handleSetNameFactory = (state, action) => {
	return {
		...state,
		nameFactory: action.nameFactory
	};
};

export const contractReducer = (state = new ContractReducerState(), action) => {
	switch (action.type) {
		case actionsEnums.SET_NAME_FACTORY:
			return handleSetNameFactory(state, action);
		default:
			return state;
	}
};
