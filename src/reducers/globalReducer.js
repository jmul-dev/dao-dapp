import { actionsEnums } from "common/actionsEnums";
import { BigNumber } from "bignumber.js";

class GlobalReducerState {
	constructor() {
		this.names = [];
		this.stakedTAOs = [];
		this.taos = [];
		this.settingTAOId = null;
	}
}

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
		_taos.push(tao);
	});
	return {
		...state,
		taos: _taos
	};
};

const handleStakeEthos = (state, action) => {
	const _stakedTAOs = state.stakedTAOs.slice();
	const _taoIndex = _stakedTAOs.findIndex((tao) => tao.taoId === action.tao.taoId);
	if (_taoIndex === -1) {
		_stakedTAOs.push({ taoId: action.tao.taoId, ethos: action.tao.lotQuantity, pathos: new BigNumber(0) });
	} else {
		_stakedTAOs[_taoIndex].ethos = _stakedTAOs[_taoIndex].ethos.plus(action.tao.lotQuantity);
	}
	return {
		...state,
		stakedTAOs: _stakedTAOs
	};
};

export const globalReducer = (state = new GlobalReducerState(), action) => {
	switch (action.type) {
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
		default:
			return state;
	}
};
