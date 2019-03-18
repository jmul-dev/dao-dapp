import { actionsEnums } from "common/actionsEnums";

class NameReducerState {
	constructor() {
		this.nameId = null;
		this.nameInfo = null;
		this.profileImage = null;
		this.taoCurrencyBalances = null;
		this.taos = [];
		this.taosNeedApproval = [];
		this.positionLogos = [];
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

const handleSetTAOsNeedApproval = (state, action) => {
	return {
		...state,
		taosNeedApproval: action.taosNeedApproval
	};
};

const handleAppendTAONeedApproval = (state, action) => {
	const _taosNeedApproval = state.taosNeedApproval.slice();
	if (!_taosNeedApproval.find((tao) => tao.childId === action.tao.childId)) {
		_taosNeedApproval.push(action.tao);
	}
	return {
		...state,
		taosNeedApproval: _taosNeedApproval
	};
};

const handleRemoveTAONeedApproval = (state, action) => {
	const _taosNeedApproval = state.taosNeedApproval.filter((tao) => tao.childId !== action.tao.childId);
	return {
		...state,
		taosNeedApproval: _taosNeedApproval
	};
};

const handleSetNameTAOAsChild = (state, action) => {
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

const handlePositionLogos = (state, action) => {
	const _positionLogos = state.positionLogos.slice();
	if (!_positionLogos.find((position) => position.nameId === action.nameId)) {
		_positionLogos.push({
			nameId: action.nameId,
			name: action.name,
			value: action.value
		});
	} else {
		const positionIndex = _positionLogos.findIndex((position) => position.nameId === action.nameId);
		_positionLogos[positionIndex].value = _positionLogos[positionIndex].value.plus(action.value);
	}
	return {
		...state,
		positionLogos: _positionLogos
	};
};

const handleUnpositionLogos = (state, action) => {
	const _positionLogos = state.positionLogos.slice();
	const positionIndex = _positionLogos.findIndex((position) => position.nameId === action.nameId);
	_positionLogos[positionIndex].value = _positionLogos[positionIndex].value.minus(action.value);
	if (_positionLogos[positionIndex].value.eq(0)) {
		delete _positionLogos[positionIndex];
	}
	return {
		...state,
		positionLogos: _positionLogos
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
		case actionsEnums.SET_TAOS_NEED_APPROVAL:
			return handleSetTAOsNeedApproval(state, action);
		case actionsEnums.APPEND_TAO_NEED_APPROVAL:
			return handleAppendTAONeedApproval(state, action);
		case actionsEnums.REMOVE_TAO_NEED_APPROVAL:
			return handleRemoveTAONeedApproval(state, action);
		case actionsEnums.SET_NAME_TAO_AS_CHILD:
			return handleSetNameTAOAsChild(state, action);
		case actionsEnums.POSITION_LOGOS:
			return handlePositionLogos(state, action);
		case actionsEnums.UNPOSITION_LOGOS:
			return handleUnpositionLogos(state, action);
		default:
			return state;
	}
};
