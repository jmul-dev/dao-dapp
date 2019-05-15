import { actionsEnums } from "common/actionsEnums";
import { BigNumber } from "bignumber.js";

class GlobalReducerState {
	constructor() {
		this.pastEventsProgress = 0;
		this.latestBlockNumber = null;
		this.blockNumberProcessed = null;
		this.pastEventsRetrieved = false;
		this.names = [];
		this.namesPositionLogos = [];
		this.stakedTAOs = [];
		this.taos = [];
		this.settingTAOId = null;
		this.taoPositions = [];
		this.namePositions = [];
		this.namesCompromised = [];
		this.namesSumLogos = [];
		this.challengeTAOAdvocates = [];
	}
}

const handleSetPastEventsProgress = (state, action) => {
	return {
		...state,
		pastEventsProgress: action.pastEventsProgress
	};
};

const handleSetLatestBlockNumber = (state, action) => {
	return {
		...state,
		latestBlockNumber: action.blockNumber
	};
};

const handleSetBlockNumberProcessed = (state, action) => {
	return {
		...state,
		blockNumberProcessed: action.blockNumber
	};
};

const handlePastEventsRetrieved = (state, action) => {
	return {
		...state,
		pastEventsRetrieved: true
	};
};

const handleAppendName = (state, action) => {
	const _names = state.names.slice();
	if (!_names.find((name) => name.nameId === action.name.nameId)) {
		const _name = {
			nameId: action.name.nameId,
			name: action.name.name
		};
		_names.push(_name);
	}
	return {
		...state,
		names: _names
	};
};

const handleAppendTAO = (state, action) => {
	const _taos = state.taos.slice();
	if (!_taos.find((tao) => tao.taoId === action.tao.taoId)) {
		_taos.push(action.tao);
	}
	return {
		...state,
		taos: _taos
	};
};

const handleSetSettingTAOId = (state, action) => {
	return {
		...state,
		settingTAOId: action.settingTAOId
	};
};

const handleSetTAOAsChild = (state, action) => {
	const { taos } = state;
	const _taos = [];
	taos.forEach((tao) => {
		if (tao.taoId === action.tao.childId && tao.parent === action.tao.taoId) {
			tao.isChild = true;
		}
		if (tao.taoId === action.tao.taoId && !tao.children.find((taoId) => taoId === action.tao.childId)) {
			tao.children.push(action.tao.childId);
		}
		_taos.push(tao);
	});
	return {
		...state,
		taos: _taos
	};
};

const handleAddNamePositionLogos = (state, action) => {
	const _namesPositionLogos = state.namesPositionLogos.slice();
	const _nameIndex = _namesPositionLogos.findIndex((name) => name.nameId === action.nameId);
	if (_nameIndex === -1) {
		_namesPositionLogos.push({ nameId: action.nameId, positionLogos: action.value });
	} else {
		_namesPositionLogos[_nameIndex].positionLogos = _namesPositionLogos[_nameIndex].positionLogos.plus(action.value);
	}
	return {
		...state,
		namesPositionLogos: _namesPositionLogos
	};
};

const handleSubtractNamePositionLogos = (state, action) => {
	const _namesPositionLogos = state.namesPositionLogos.slice();
	const _nameIndex = _namesPositionLogos.findIndex((name) => name.nameId === action.nameId);
	if (_nameIndex === -1) {
		_namesPositionLogos.push({ nameId: action.nameId, positionLogos: new BigNumber(0).minus(action.value) });
	} else {
		_namesPositionLogos[_nameIndex].positionLogos = _namesPositionLogos[_nameIndex].positionLogos.minus(action.value);
	}
	return {
		...state,
		namesPositionLogos: _namesPositionLogos
	};
};

const handleStakeEthos = (state, action) => {
	const _stakedTAOs = state.stakedTAOs.slice();
	const _taoIndex = _stakedTAOs.findIndex((tao) => tao.taoId === action.tao.taoId);
	if (_taoIndex === -1) {
		_stakedTAOs.push({
			taoId: action.tao.taoId,
			ethos: action.tao.lotQuantity,
			pathos: new BigNumber(0),
			logosWithdrawn: new BigNumber(0)
		});
	} else {
		_stakedTAOs[_taoIndex].ethos = _stakedTAOs[_taoIndex].ethos.plus(action.tao.lotQuantity);
	}
	return {
		...state,
		stakedTAOs: _stakedTAOs
	};
};

const handleStakePathos = (state, action) => {
	const _stakedTAOs = state.stakedTAOs.slice();
	const _taoIndex = _stakedTAOs.findIndex((tao) => tao.taoId === action.tao.taoId);
	if (_taoIndex >= 0) {
		_stakedTAOs[_taoIndex].pathos = _stakedTAOs[_taoIndex].pathos.plus(action.tao.stakeQuantity);
	}
	return {
		...state,
		stakedTAOs: _stakedTAOs
	};
};

const handleWithdrawLogos = (state, action) => {
	const _stakedTAOs = state.stakedTAOs.slice();
	const _taoIndex = _stakedTAOs.findIndex((tao) => tao.taoId === action.tao.taoId);
	if (_taoIndex >= 0) {
		_stakedTAOs[_taoIndex].logosWithdrawn = _stakedTAOs[_taoIndex].logosWithdrawn.plus(action.tao.withdrawnAmount);
	}
	return {
		...state,
		stakedTAOs: _stakedTAOs
	};
};

const handleAppendTAOPosition = (state, action) => {
	const _taoPositions = state.taoPositions.slice();
	if (!_taoPositions.find((tao) => tao.taoId === action.tao.taoId)) {
		_taoPositions.push(action.tao);
	}
	return {
		...state,
		taoPositions: _taoPositions
	};
};

const handleSetTAOAdvocate = (state, action) => {
	const _taoPositions = state.taoPositions.slice();
	const taoIndex = _taoPositions.findIndex((tao) => tao.taoId === action.taoId);
	if (taoIndex >= 0) {
		_taoPositions[taoIndex].advocateId = action.advocateId;
	}
	return {
		...state,
		taoPositions: _taoPositions
	};
};

const handleSetTAOListener = (state, action) => {
	const _taoPositions = state.taoPositions.slice();
	const taoIndex = _taoPositions.findIndex((tao) => tao.taoId === action.taoId);
	if (taoIndex >= 0) {
		_taoPositions[taoIndex].listenerId = action.listenerId;
	}
	return {
		...state,
		taoPositions: _taoPositions
	};
};

const handleSetTAOSpeaker = (state, action) => {
	const _taoPositions = state.taoPositions.slice();
	const taoIndex = _taoPositions.findIndex((tao) => tao.taoId === action.taoId);
	if (taoIndex >= 0) {
		_taoPositions[taoIndex].speakerId = action.speakerId;
	}
	return {
		...state,
		taoPositions: _taoPositions
	};
};

const handleAppendNamePosition = (state, action) => {
	const _namePositions = state.namePositions.slice();
	if (!_namePositions.find((name) => name.nameId === action.name.nameId)) {
		_namePositions.push(action.name);
	}
	return {
		...state,
		namePositions: _namePositions
	};
};

const handleSetNameListener = (state, action) => {
	const _namePositions = state.namePositions.slice();
	const nameIndex = _namePositions.findIndex((name) => name.nameId === action.nameId);
	if (nameIndex >= 0) {
		_namePositions[nameIndex].listenerId = action.listenerId;
	}
	return {
		...state,
		namePositions: _namePositions
	};
};

const handleSetNameSpeaker = (state, action) => {
	const _namePositions = state.namePositions.slice();
	const nameIndex = _namePositions.findIndex((name) => name.nameId === action.nameId);
	if (nameIndex >= 0) {
		_namePositions[nameIndex].speakerId = action.speakerId;
	}
	return {
		...state,
		namePositions: _namePositions
	};
};

const handleAppendNameCompromised = (state, action) => {
	const _namesCompromised = state.namesCompromised.slice();
	if (!_namesCompromised.find((name) => name.nameId === action.name.nameId)) {
		_namesCompromised.push(action.name);
	}
	return {
		...state,
		namesCompromised: _namesCompromised
	};
};

const handleSetNameCompromised = (state, action) => {
	const _namesCompromised = state.namesCompromised.slice();
	const nameIndex = _namesCompromised.findIndex((name) => name.nameId === action.nameId);
	if (nameIndex >= 0) {
		_namesCompromised[nameIndex].compromised = true;
		_namesCompromised[nameIndex].submittedTimestamp = action.submittedTimestamp;
		_namesCompromised[nameIndex].lockedUntilTimestamp = action.lockedUntilTimestamp;
	}
	return {
		...state,
		namesCompromised: _namesCompromised
	};
};

const handleResetNameCompromised = (state, action) => {
	const _namesCompromised = state.namesCompromised.slice();
	const nameIndex = _namesCompromised.findIndex((name) => name.nameId === action.nameId);
	if (nameIndex >= 0) {
		_namesCompromised[nameIndex].compromised = false;
		_namesCompromised[nameIndex].submittedTimestamp = new BigNumber(0);
		_namesCompromised[nameIndex].lockedUntilTimestamp = new BigNumber(0);
	}
	return {
		...state,
		namesCompromised: _namesCompromised
	};
};

const handleAppendNameSumLogos = (state, action) => {
	const _namesSumLogos = state.namesSumLogos.slice();
	if (!_namesSumLogos.find((name) => name.nameId === action.name.nameId)) {
		_namesSumLogos.push(action.name);
	}
	return {
		...state,
		namesSumLogos: _namesSumLogos
	};
};

const handleUpdateNameSumLogos = (state, action) => {
	const _namesSumLogos = state.namesSumLogos.slice();
	const nameIndex = _namesSumLogos.findIndex((name) => name.nameId === action.nameId);
	if (nameIndex >= 0) {
		_namesSumLogos[nameIndex].sumLogos = action.sumLogos;
	}
	return {
		...state,
		namesSumLogos: _namesSumLogos
	};
};

const handleChallengeTAOAdvocate = (state, action) => {
	const _challengeTAOAdvocates = state.challengeTAOAdvocates.slice();
	if (!_challengeTAOAdvocates.find((challenge) => challenge.challengeId === action.challenge.challengeId)) {
		_challengeTAOAdvocates.push(action.challenge);
	}
	return {
		...state,
		challengeTAOAdvocates: _challengeTAOAdvocates
	};
};

const handleUpdateChallengeCurrentAdvocate = (state, action) => {
	const _challengeTAOAdvocates = state.challengeTAOAdvocates.slice();
	const _otherTAOChallenges = _challengeTAOAdvocates.filter((challenge) => challenge.taoId !== action.taoId);
	const _taoChallenges = _challengeTAOAdvocates.filter(
		(challenge) => challenge.taoId === action.taoId && challenge.challengerAdvocateId !== action.advocateId
	);

	if (_taoChallenges.length) {
		_taoChallenges.forEach((challenge, index) => {
			_taoChallenges[index].currentAdvocateId = action.advocateId;
		});
	}

	return {
		...state,
		challengeTAOAdvocates: [..._otherTAOChallenges, ..._taoChallenges]
	};
};

export const globalReducer = (state = new GlobalReducerState(), action) => {
	switch (action.type) {
		case actionsEnums.SET_PAST_EVENTS_PROGRESS:
			return handleSetPastEventsProgress(state, action);
		case actionsEnums.PAST_EVENTS_RETRIEVED:
			return handlePastEventsRetrieved(state, action);
		case actionsEnums.ADD_NAME_POSITION_LOGOS:
			return handleAddNamePositionLogos(state, action);
		case actionsEnums.APPEND_NAME:
			return handleAppendName(state, action);
		case actionsEnums.APPEND_TAO:
			return handleAppendTAO(state, action);
		case actionsEnums.SET_SETTING_TAO_ID:
			return handleSetSettingTAOId(state, action);
		case actionsEnums.SET_TAO_AS_CHILD:
			return handleSetTAOAsChild(state, action);
		case actionsEnums.STAKE_ETHOS:
			return handleStakeEthos(state, action);
		case actionsEnums.STAKE_PATHOS:
			return handleStakePathos(state, action);
		case actionsEnums.SUBTRACT_NAME_POSITION_LOGOS:
			return handleSubtractNamePositionLogos(state, action);
		case actionsEnums.WITHDRAW_LOGOS:
			return handleWithdrawLogos(state, action);
		case actionsEnums.APPEND_TAO_POSITION:
			return handleAppendTAOPosition(state, action);
		case actionsEnums.SET_TAO_ADVOCATE:
			return handleSetTAOAdvocate(state, action);
		case actionsEnums.SET_TAO_LISTENER:
			return handleSetTAOListener(state, action);
		case actionsEnums.SET_TAO_SPEAKER:
			return handleSetTAOSpeaker(state, action);
		case actionsEnums.APPEND_NAME_POSITION:
			return handleAppendNamePosition(state, action);
		case actionsEnums.SET_NAME_LISTENER:
			return handleSetNameListener(state, action);
		case actionsEnums.SET_NAME_SPEAKER:
			return handleSetNameSpeaker(state, action);
		case actionsEnums.APPEND_NAME_COMPROMISED:
			return handleAppendNameCompromised(state, action);
		case actionsEnums.SET_NAME_COMPROMISED:
			return handleSetNameCompromised(state, action);
		case actionsEnums.RESET_NAME_COMPROMISED:
			return handleResetNameCompromised(state, action);
		case actionsEnums.APPEND_NAME_SUM_LOGOS:
			return handleAppendNameSumLogos(state, action);
		case actionsEnums.UPDATE_NAME_SUM_LOGOS:
			return handleUpdateNameSumLogos(state, action);
		case actionsEnums.CHALLENGE_TAO_ADVOCATE:
			return handleChallengeTAOAdvocate(state, action);
		case actionsEnums.UPDATE_CHALLENGE_CURRENT_ADVOCATE:
			return handleUpdateChallengeCurrentAdvocate(state, action);
		case actionsEnums.SET_LATEST_BLOCK_NUMBER:
			return handleSetLatestBlockNumber(state, action);
		case actionsEnums.SET_BLOCK_NUMBER_PROCESSED:
			return handleSetBlockNumberProcessed(state, action);
		default:
			return state;
	}
};
