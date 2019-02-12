import { actionsEnums } from "common/actionsEnums";

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

export const setNameAccountRecovery = (nameAccountRecovery) => {
	return {
		type: actionsEnums.SET_NAME_ACCOUNT_RECOVERY,
		nameAccountRecovery: nameAccountRecovery
	};
};

export const setNameFactory = (nameFactory) => {
	return {
		type: actionsEnums.SET_NAME_FACTORY,
		nameFactory: nameFactory
	};
};

export const setNamePublicKey = (namePublicKey) => {
	return {
		type: actionsEnums.SET_NAME_PUBLIC_KEY,
		namePublicKey: namePublicKey
	};
};

export const setNameTAOLookup = (nameTAOLookup) => {
	return {
		type: actionsEnums.SET_NAME_TAO_LOOKUP,
		nameTAOLookup: nameTAOLookup
	};
};

export const setNameTAOPosition = (nameTAOPosition) => {
	return {
		type: actionsEnums.SET_NAME_TAO_POSITION,
		nameTAOPosition: nameTAOPosition
	};
};

export const setNameTAOVault = (nameTAOVault) => {
	return {
		type: actionsEnums.SET_NAME_TAO_VAULT,
		nameTAOVault: nameTAOVault
	};
};

export const setEthos = (ethos) => {
	return {
		type: actionsEnums.SET_ETHOS,
		ethos: ethos
	};
};

export const setPathos = (pathos) => {
	return {
		type: actionsEnums.SET_PATHOS,
		pathos: pathos
	};
};

export const setLogos = (logos) => {
	return {
		type: actionsEnums.SET_LOGOS,
		logos: logos
	};
};
