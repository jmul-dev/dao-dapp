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

export const setTAOsNeedApproval = (taosNeedApproval) => {
	return {
		type: actionsEnums.SET_TAOS_NEED_APPROVAL,
		taosNeedApproval
	};
};

export const appendTAONeedApproval = (tao) => {
	return {
		type: actionsEnums.APPEND_TAO_NEED_APPROVAL,
		tao
	};
};

export const removeTAONeedApproval = (tao) => {
	return {
		type: actionsEnums.REMOVE_TAO_NEED_APPROVAL,
		tao
	};
};

export const setTAOAsChild = (tao) => {
	return {
		type: actionsEnums.SET_TAO_AS_CHILD,
		tao
	};
};

export const setNameTAOAsChild = (tao) => {
	return {
		type: actionsEnums.SET_NAME_TAO_AS_CHILD,
		tao
	};
};

export const positionLogosOn = (nameId, name, value) => {
	return {
		type: actionsEnums.POSITION_LOGOS_ON,
		nameId,
		name,
		value
	};
};

export const unpositionLogosOn = (nameId, value) => {
	return {
		type: actionsEnums.UNPOSITION_LOGOS_ON,
		nameId,
		value
	};
};

export const positionLogosFrom = (nameId, name, value) => {
	return {
		type: actionsEnums.POSITION_LOGOS_FROM,
		nameId,
		name,
		value
	};
};

export const unpositionLogosFrom = (nameId, value) => {
	return {
		type: actionsEnums.UNPOSITION_LOGOS_FROM,
		nameId,
		value
	};
};

export const addNamePositionLogos = (nameId, value) => {
	return {
		type: actionsEnums.ADD_NAME_POSITION_LOGOS,
		nameId,
		value
	};
};

export const subtractNamePositionLogos = (nameId, value) => {
	return {
		type: actionsEnums.SUBTRACT_NAME_POSITION_LOGOS,
		nameId,
		value
	};
};

export const stakeEthos = (tao) => {
	return {
		type: actionsEnums.STAKE_ETHOS,
		tao
	};
};

export const stakePathos = (tao) => {
	return {
		type: actionsEnums.STAKE_PATHOS,
		tao
	};
};
