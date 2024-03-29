import { actionsEnums } from "common/actionsEnums";

class Web3ReducerState {
	constructor() {
		this.web3 = null;
		this.accounts = null;
		this.networkId = null;
		this.etherscan = null;
	}
}

const handleWeb3Connected = (state, action) => {
	return {
		...state,
		web3: action.web3
	};
};

const handleSetAccounts = (state, action) => {
	return {
		...state,
		accounts: action.accounts
	};
};

const handleSetNetworkId = (state, action) => {
	let etherscan;
	switch (action.networkId) {
		case 1:
			etherscan = "https://etherscan.io";
			break;
		case 4:
			etherscan = "https://rinkeby.etherscan.io";
			break;
		default:
			etherscan = "http://localhost";
			break;
	}
	return {
		...state,
		networkId: action.networkId,
		etherscan
	};
};

export const web3Reducer = (state = new Web3ReducerState(), action) => {
	switch (action.type) {
		case actionsEnums.WEB3_CONNECTED:
			return handleWeb3Connected(state, action);
		case actionsEnums.SET_ACCOUNTS:
			return handleSetAccounts(state, action);
		case actionsEnums.SET_NETWORK_ID:
			return handleSetNetworkId(state, action);
		default:
			return state;
	}
};
