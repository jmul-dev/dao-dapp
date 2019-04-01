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

export const setNameId = (nameId) => {
	return {
		type: actionsEnums.SET_NAME_ID,
		nameId
	};
};

export const pastEventsRetrieved = () => {
	return {
		type: actionsEnums.PAST_EVENTS_RETRIEVED
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

export const removeTAONeedApproval = (taoId) => {
	return {
		type: actionsEnums.REMOVE_TAO_NEED_APPROVAL,
		taoId
	};
};

export const setTAOAsChild = (tao) => {
	return {
		type: actionsEnums.SET_TAO_AS_CHILD,
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

export const withdrawLogos = (tao) => {
	return {
		type: actionsEnums.WITHDRAW_LOGOS,
		tao
	};
};

export const nameStakeEthos = (tao) => {
	return {
		type: actionsEnums.NAME_STAKE_ETHOS,
		tao
	};
};

export const nameStakePathos = (tao) => {
	return {
		type: actionsEnums.NAME_STAKE_PATHOS,
		tao
	};
};

export const updateLogosEarned = (tao) => {
	return {
		type: actionsEnums.UPDATE_LOGOS_EARNED,
		tao
	};
};

export const nameWithdrawLogos = (tao) => {
	return {
		type: actionsEnums.NAME_WITHDRAW_LOGOS,
		tao
	};
};

export const appendTAOPosition = (tao) => {
	return {
		type: actionsEnums.APPEND_TAO_POSITION,
		tao
	};
};

export const setTAOAdvocate = (taoId, advocateId) => {
	return {
		type: actionsEnums.SET_TAO_ADVOCATE,
		taoId,
		advocateId
	};
};

export const setTAOListener = (taoId, listenerId) => {
	return {
		type: actionsEnums.SET_TAO_LISTENER,
		taoId,
		listenerId
	};
};

export const setTAOSpeaker = (taoId, speakerId) => {
	return {
		type: actionsEnums.SET_TAO_SPEAKER,
		taoId,
		speakerId
	};
};

export const appendNamePosition = (name) => {
	return {
		type: actionsEnums.APPEND_NAME_POSITION,
		name
	};
};

export const setNameListener = (nameId, listenerId) => {
	return {
		type: actionsEnums.SET_NAME_LISTENER,
		nameId,
		listenerId
	};
};

export const setNameSpeaker = (nameId, speakerId) => {
	return {
		type: actionsEnums.SET_NAME_SPEAKER,
		nameId,
		speakerId
	};
};

export const appendNameCompromised = (name) => {
	return {
		type: actionsEnums.APPEND_NAME_COMPROMISED,
		name
	};
};

export const setNameCompromised = (nameId, submittedTimestamp, lockedUntilTimestamp) => {
	return {
		type: actionsEnums.SET_NAME_COMPROMISED,
		nameId,
		submittedTimestamp,
		lockedUntilTimestamp
	};
};

export const setLoggedInNameCompromised = (submittedTimestamp, lockedUntilTimestamp) => {
	return {
		type: actionsEnums.SET_LOGGED_IN_NAME_COMPROMISED,
		submittedTimestamp,
		lockedUntilTimestamp
	};
};

export const resetNameCompromised = (nameId) => {
	return {
		type: actionsEnums.RESET_NAME_COMPROMISED,
		nameId
	};
};

export const resetLoggedInNameCompromised = () => {
	return {
		type: actionsEnums.RESET_LOGGED_IN_NAME_COMPROMISED
	};
};

export const appendNameSumLogos = (name) => {
	return {
		type: actionsEnums.APPEND_NAME_SUM_LOGOS,
		name
	};
};

export const updateNameSumLogos = (nameId, sumLogos) => {
	return {
		type: actionsEnums.UPDATE_NAME_SUM_LOGOS,
		nameId,
		sumLogos
	};
};
