import { actionsEnums } from "common/actionsEnums";

export const setNameInfo = (nameInfo) => {
	return {
		type: actionsEnums.SET_NAME_INFO,
		nameInfo
	};
};

export const setTAOCurrencyBalances = (balances) => {
	return {
		type: actionsEnums.SET_TAO_CURRENCY_BALANCES,
		balances
	};
};
