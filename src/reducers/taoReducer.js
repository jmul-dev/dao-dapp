import { actionsEnums } from "common/actionsEnums";

class TAOReducerState {
	constructor() {
		this.names = [];
		this.taos = [];
		this.settingTAOId = null;
	}
}

const handleSetNames = (state, action) => {
	return {
		...state,
		names: action.names
	};
};

const handleSetTAOs = (state, action) => {
	return {
		...state,
		taos: action.taos
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

export const taoReducer = (state = new TAOReducerState(), action) => {
	switch (action.type) {
		case actionsEnums.SET_NAMES:
			return handleSetNames(state, action);
		case actionsEnums.APPEND_NAME:
			return handleAppendName(state, action);
		case actionsEnums.SET_TAOS:
			return handleSetTAOs(state, action);
		case actionsEnums.APPEND_TAO:
			return handleAppendTAO(state, action);
		case actionsEnums.SET_SETTING_TAO_ID:
			return handleSetSettingTAOId(state, action);
		default:
			return state;
	}
};
