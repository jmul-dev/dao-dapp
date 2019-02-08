import { actionsEnums } from "../common/actionsEnums";

export const web3Connected = (web3) => {
	return {
		type: actionsEnums.WEB3_CONNECTED,
		web3: web3
	};
};

export const setAccounts = (accounts) => {
	return {
		type: actionsEnums.SET_ACCOUNTS,
		accounts: accounts
	};
};

export const setNetworkId = (networkId) => {
	return {
		type: actionsEnums.SET_NETWORK_ID,
		networkId: networkId
	};
};

export const setNameFactory = (nameFactory) => {
	return {
		type: actionsEnums.SET_NAME_FACTORY,
		nameFactory: nameFactory
	};
};

export const setNameTAOLookup = (nameTAOLookup) => {
	return {
		type: actionsEnums.SET_NAME_TAO_LOOKUP,
		nameTAOLookup: nameTAOLookup
	};
};
