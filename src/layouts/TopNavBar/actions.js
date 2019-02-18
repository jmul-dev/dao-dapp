import { actionsEnums } from "common/actionsEnums";

export const setNameInfo = (nameInfo) => {
	return {
		type: actionsEnums.SET_NAME_INFO,
		nameInfo
	};
};

export const setProfileImage = (profileImage) => {
	return {
		type: actionsEnums.SET_PROFILE_IMAGE,
		profileImage
	};
};

export const setTAOCurrencyBalances = (balances) => {
	return {
		type: actionsEnums.SET_TAO_CURRENCY_BALANCES,
		balances
	};
};
