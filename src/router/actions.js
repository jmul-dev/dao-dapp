import { actionsEnums } from "common/actionsEnums";

export const web3Connected = (web3) => {
	return {
		type: actionsEnums.WEB3_CONNECTED,
		web3
	};
};

export const setAccounts = (accounts) => {
	return {
		type: actionsEnums.SET_ACCOUNTS,
		accounts
	};
};

export const setNetworkId = (networkId) => {
	return {
		type: actionsEnums.SET_NETWORK_ID,
		networkId
	};
};

export const setContracts = (contracts) => {
	return {
		type: actionsEnums.SET_CONTRACTS,
		contracts
	};
};

export const setNames = (names) => {
	return {
		type: actionsEnums.SET_NAMES,
		names
	};
};

export const appendName = (name) => {
	return {
		type: actionsEnums.APPEND_NAME,
		name
	};
};
