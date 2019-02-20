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

export const setTAOs = (taos) => {
	return {
		type: actionsEnums.SET_TAOS,
		taos
	};
};

export const appendTAO = (tao) => {
	return {
		type: actionsEnums.APPEND_TAO,
		tao
	};
};

export const setSettingTAOId = (settingTAOId) => {
	return {
		type: actionsEnums.SET_SETTING_TAO_ID,
		settingTAOId
	};
};

export const setNameTAOs = (taos) => {
	return {
		type: actionsEnums.SET_NAME_TAOS,
		taos
	};
};

export const appendNameTAO = (tao) => {
	return {
		type: actionsEnums.APPEND_NAME_TAO,
		tao
	};
};
