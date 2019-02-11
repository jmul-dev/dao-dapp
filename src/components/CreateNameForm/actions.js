import { actionsEnums } from "../../common/actionsEnums";

export const setNameId = (nameId) => {
	return {
		type: actionsEnums.SET_NAME_ID,
		nameId
	};
};
