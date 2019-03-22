import { actionsEnums } from "common/actionsEnums";
import { BigNumber } from "bignumber.js";

class NameReducerState {
	constructor() {
		this.nameId = null;
		this.nameInfo = null;
		this.profileImage = null;
		this.taoCurrencyBalances = null;
		this.taos = [];
		this.taosNeedApproval = [];
		this.positionLogosOn = [];
		this.positionLogosFrom = [];
		this.stakeEthos = [];
		this.stakePathos = [];
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

const handlePositionLogosOn = (state, action) => {
	const _positionLogosOn = state.positionLogosOn.slice();
	if (!_positionLogosOn.find((position) => position.nameId === action.nameId)) {
		_positionLogosOn.push({
			nameId: action.nameId,
			name: action.name,
			value: action.value
		});
	} else {
		const positionIndex = _positionLogosOn.findIndex((position) => position.nameId === action.nameId);
		_positionLogosOn[positionIndex].value = _positionLogosOn[positionIndex].value.plus(action.value);
	}
	return {
		...state,
		positionLogosOn: _positionLogosOn
	};
};

const handleUnpositionLogosOn = (state, action) => {
	const _positionLogosOn = state.positionLogosOn.slice();
	const positionIndex = _positionLogosOn.findIndex((position) => position.nameId === action.nameId);
	_positionLogosOn[positionIndex].value = _positionLogosOn[positionIndex].value.minus(action.value);
	if (_positionLogosOn[positionIndex].value.eq(0)) {
		delete _positionLogosOn[positionIndex];
	}
	return {
		...state,
		positionLogosOn: _positionLogosOn
	};
};

const handlePositionLogosFrom = (state, action) => {
	const _positionLogosFrom = state.positionLogosFrom.slice();
	if (!_positionLogosFrom.find((position) => position.nameId === action.nameId)) {
		_positionLogosFrom.push({
			nameId: action.nameId,
			name: action.name,
			value: action.value
		});
	} else {
		const positionIndex = _positionLogosFrom.findIndex((position) => position.nameId === action.nameId);
		_positionLogosFrom[positionIndex].value = _positionLogosFrom[positionIndex].value.plus(action.value);
	}
	return {
		...state,
		positionLogosFrom: _positionLogosFrom
	};
};

const handleUnpositionLogosFrom = (state, action) => {
	const _positionLogosFrom = state.positionLogosFrom.slice();
	const positionIndex = _positionLogosFrom.findIndex((position) => position.nameId === action.nameId);
	_positionLogosFrom[positionIndex].value = _positionLogosFrom[positionIndex].value.minus(action.value);
	if (_positionLogosFrom[positionIndex].value.eq(0)) {
		delete _positionLogosFrom[positionIndex];
	}
	return {
		...state,
		positionLogosFrom: _positionLogosFrom
	};
};

const handleNameStakeEthos = (state, action) => {
	const _stakeEthos = state.stakeEthos.slice();
	if (!_stakeEthos.find((tao) => tao.taoId === action.tao.taoId)) {
		_stakeEthos.push({
			...action.tao,
			logosEarned: new BigNumber(0),
			logosWithdrawn: new BigNumber(0)
		});
	}
	return {
		...state,
		stakeEthos: _stakeEthos
	};
};

const handleNameStakePathos = (state, action) => {
	const _stakePathos = state.stakePathos.slice();
	if (!_stakePathos.find((tao) => tao.taoId === action.tao.taoId)) {
		_stakePathos.push(action.tao);
	}

	return {
		...state,
		stakePathos: _stakePathos
	};
};

const handleUpdateLogosEarned = (state, action) => {
	const _stakeEthosNonTAO = state.stakeEthos.filter((tao) => tao.taoId !== action.tao.taoId);
	const _stakeEthosTAO = state.stakeEthos.filter((tao) => tao.taoId === action.tao.taoId);
	const _ethosLotIndex = _stakeEthosTAO.findIndex(
		(tao) =>
			action.tao.currentPoolTotalStakedPathos.gt(tao.poolPreStakeSnapshot) &&
			action.tao.currentPoolTotalStakedPathos.lte(tao.poolStakeLotSnapshot)
	);
	if (_ethosLotIndex !== -1) {
		_stakeEthosTAO[_ethosLotIndex].logosEarned = action.tao.currentPoolTotalStakedPathos.gte(
			_stakeEthosTAO[_ethosLotIndex].poolStakeLotSnapshot
		)
			? _stakeEthosTAO[_ethosLotIndex].lotQuantity
			: action.tao.currentPoolTotalStakedPathos.sub(_stakeEthosTAO[_ethosLotIndex].poolPreStakeSnapshot);
	}

	return {
		...state,
		stakeEthos: [..._stakeEthosNonTAO, ..._stakeEthosTAO]
	};
};

const handleNameWithdrawLogos = (state, action) => {
	const _stakeEthos = state.stakeEthos.slice();
	const _ethosLotIndex = _stakeEthos.findIndex((tao) => tao.ethosLotId === action.tao.ethosLotId);
	if (_ethosLotIndex >= 0) {
		_stakeEthos[_ethosLotIndex].logosWithdrawn = _stakeEthos[_ethosLotIndex].logosWithdrawn.plus(action.tao.withdrawnAmount);
	}

	return {
		...state,
		stakeEthos: _stakeEthos
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
		case actionsEnums.APPEND_NAME_TAO:
			return handleAppendNameTAO(state, action);
		case actionsEnums.APPEND_TAO_NEED_APPROVAL:
			return handleAppendTAONeedApproval(state, action);
		case actionsEnums.REMOVE_TAO_NEED_APPROVAL:
			return handleRemoveTAONeedApproval(state, action);
		case actionsEnums.SET_NAME_TAO_AS_CHILD:
			return handleSetNameTAOAsChild(state, action);
		case actionsEnums.POSITION_LOGOS_ON:
			return handlePositionLogosOn(state, action);
		case actionsEnums.UNPOSITION_LOGOS_ON:
			return handleUnpositionLogosOn(state, action);
		case actionsEnums.POSITION_LOGOS_FROM:
			return handlePositionLogosFrom(state, action);
		case actionsEnums.UNPOSITION_LOGOS_FROM:
			return handleUnpositionLogosFrom(state, action);
		case actionsEnums.NAME_STAKE_ETHOS:
			return handleNameStakeEthos(state, action);
		case actionsEnums.NAME_STAKE_PATHOS:
			return handleNameStakePathos(state, action);
		case actionsEnums.NAME_WITHDRAW_LOGOS:
			return handleNameWithdrawLogos(state, action);
		case actionsEnums.UPDATE_LOGOS_EARNED:
			return handleUpdateLogosEarned(state, action);
		default:
			return state;
	}
};
