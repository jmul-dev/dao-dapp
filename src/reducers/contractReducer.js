import { actionsEnums } from "../common/actionsEnums";

class ContractReducerState {
	constructor() {
		this.nameAccountRecovery = null;
		this.nameFactory = null;
		this.namePublicKey = null;
		this.nameTAOLookup = null;
		this.nameTAOPosition = null;
		this.nameTAOVault = null;
	}
}

const handleSetNameAccountRecovery = (state, action) => {
	return {
		...state,
		nameAccountRecovery: action.nameAccountRecovery
	};
};

const handleSetNameFactory = (state, action) => {
	return {
		...state,
		nameFactory: action.nameFactory
	};
};

const handleSetNamePublicKey = (state, action) => {
	return {
		...state,
		namePublicKey: action.namePublicKey
	};
};

const handleSetNameTAOLookup = (state, action) => {
	return {
		...state,
		nameTAOLookup: action.nameTAOLookup
	};
};

const handleSetNameTAOPosition = (state, action) => {
	return {
		...state,
		nameTAOPosition: action.nameTAOPosition
	};
};

const handleSetNameTAOVault = (state, action) => {
	return {
		...state,
		nameTAOVault: action.nameTAOVault
	};
};

const handleSetEthos = (state, action) => {
	return {
		...state,
		ethos: action.ethos
	};
};

const handleSetPathos = (state, action) => {
	return {
		...state,
		pathos: action.pathos
	};
};

const handleSetLogos = (state, action) => {
	return {
		...state,
		logos: action.logos
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
		case actionsEnums.SET_NAME_ACCOUNT_RECOVERY:
			return handleSetNameAccountRecovery(state, action);
		case actionsEnums.SET_NAME_FACTORY:
			return handleSetNameFactory(state, action);
		case actionsEnums.SET_NAME_PUBLIC_KEY:
			return handleSetNamePublicKey(state, action);
		case actionsEnums.SET_NAME_TAO_LOOKUP:
			return handleSetNameTAOLookup(state, action);
		case actionsEnums.SET_NAME_TAO_POSITION:
			return handleSetNameTAOPosition(state, action);
		case actionsEnums.SET_NAME_TAO_VAULT:
			return handleSetNameTAOVault(state, action);
		case actionsEnums.SET_ETHOS:
			return handleSetEthos(state, action);
		case actionsEnums.SET_PATHOS:
			return handleSetPathos(state, action);
		case actionsEnums.SET_LOGOS:
			return handleSetLogos(state, action);
		default:
			return state;
	}
};
