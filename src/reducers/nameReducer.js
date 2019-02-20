import { actionsEnums } from "common/actionsEnums";

class NameReducerState {
	constructor() {
		this.nameId = null;
		this.nameInfo = null;
		this.profileImage = null;
		this.taoCurrencyBalances = null;
		this.taos = [];
	}
}

const handleSetNameId = (state, action) => {
	return {
		...state,
		nameId: action.nameId
	};
};

const handleSetNameInfo = (state, action) => {
	return {
		...state,
		nameInfo: action.nameInfo
	};
};

const handleSetProfileImage = (state, action) => {
	return {
		...state,
		profileImage: action.profileImage
	};
};

const handleSetTAOCurrencyBalances = (state, action) => {
	return {
		...state,
		taoCurrencyBalances: action.balances
	};
};

const handleSetNameTAOs = (state, action) => {
	return {
		...state,
		taos: action.taos
	};
};

const handleAppendNameTAO = (state, action) => {
	const _taos = state.taos.slice();
	if (!_taos.find((tao) => tao.taoId === action.tao.taoId)) {
		_taos.push(action.tao);
	}
	return {
		...state,
		taos: _taos
	};
};

export const nameReducer = (state = new NameReducerState(), action) => {
	switch (action.type) {
		case actionsEnums.SET_NAME_ID:
			return handleSetNameId(state, action);
		case actionsEnums.SET_NAME_INFO:
			return handleSetNameInfo(state, action);
		case actionsEnums.SET_PROFILE_IMAGE:
			return handleSetProfileImage(state, action);
		case actionsEnums.SET_TAO_CURRENCY_BALANCES:
			return handleSetTAOCurrencyBalances(state, action);
		case actionsEnums.SET_NAME_TAOS:
			return handleSetNameTAOs(state, action);
		case actionsEnums.APPEND_NAME_TAO:
			return handleAppendNameTAO(state, action);
		default:
			return state;
	}
};
