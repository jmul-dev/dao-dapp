import { actionsEnums } from "common/actionsEnums";

class ContractReducerState {
	constructor() {
		this.contracts = {};
	}
}

const handleSetContracts = (state, action) => {
	return {
		...state,
		contracts: action.contracts
	};
};

export const contractReducer = (state = new ContractReducerState(), action) => {
	switch (action.type) {
		case actionsEnums.SET_CONTRACTS:
			return handleSetContracts(state, action);
		default:
			return state;
	}
};
