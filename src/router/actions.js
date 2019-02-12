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

export const setNameAccountRecovery = (nameAccountRecovery) => {
	return {
		type: actionsEnums.SET_NAME_ACCOUNT_RECOVERY,
		nameAccountRecovery
	};
};

export const setNameFactory = (nameFactory) => {
	return {
		type: actionsEnums.SET_NAME_FACTORY,
		nameFactory
	};
};

export const setNamePublicKey = (namePublicKey) => {
	return {
		type: actionsEnums.SET_NAME_PUBLIC_KEY,
		namePublicKey
	};
};

export const setNameTAOLookup = (nameTAOLookup) => {
	return {
		type: actionsEnums.SET_NAME_TAO_LOOKUP,
		nameTAOLookup
	};
};

export const setNameTAOPosition = (nameTAOPosition) => {
	return {
		type: actionsEnums.SET_NAME_TAO_POSITION,
		nameTAOPosition
	};
};

export const setNameTAOVault = (nameTAOVault) => {
	return {
		type: actionsEnums.SET_NAME_TAO_VAULT,
		nameTAOVault
	};
};

export const setEthos = (ethos) => {
	return {
		type: actionsEnums.SET_ETHOS,
		ethos
	};
};

export const setPathos = (pathos) => {
	return {
		type: actionsEnums.SET_PATHOS,
		pathos
	};
};

export const setLogos = (logos) => {
	return {
		type: actionsEnums.SET_LOGOS,
		logos
	};
};

export const setAOIon = (aoion) => {
	return {
		type: actionsEnums.SET_AOION,
		aoion
	};
};
