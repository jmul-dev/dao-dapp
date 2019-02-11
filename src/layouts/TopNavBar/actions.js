import { actionsEnums } from "../../common/actionsEnums";

export const setNameInfo = (nameInfo) => {
	return {
		type: actionsEnums.SET_NAME_INFO,
		nameInfo
	};
};
