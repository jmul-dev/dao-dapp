import { actionsEnums } from "../common/actionsEnums";

class ContractReducerState {
	constructor() {
		this.nameFactory = null;
		this.nameTAOLookup = null;
	}
}

const handleSetNameFactory = (state, action) => {
	return {
		...state,
		nameFactory: action.nameFactory
	};
};

const handleSetNameTAOLookup = (state, action) => {
	return {
		...state,
		nameTAOLookup: action.nameTAOLookup
	};
};

export const waitForTransactionReceipt = (transactionHash) => {
	return new Promise((resolve, reject) => {
		const filter = window.web3.eth.filter("latest");
		filter.watch((error, result) => {
			window.web3.eth.getTransactionReceipt(transactionHash, (err, receipt) => {
				if (err) {
					reject(err);
				} else if (receipt) {
					filter.stopWatching();
					if (receipt.status === "0x0") {
						reject(new Error("Transaction failed"));
					} else {
						resolve();
					}
				}
			});
		});
	});
};

export const contractReducer = (state = new ContractReducerState(), action) => {
	switch (action.type) {
		case actionsEnums.SET_NAME_FACTORY:
			return handleSetNameFactory(state, action);
		case actionsEnums.SET_NAME_TAO_LOOKUP:
			return handleSetNameTAOLookup(state, action);
		default:
			return state;
	}
};
