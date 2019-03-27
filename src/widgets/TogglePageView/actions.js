import { actionsEnums } from "common/actionsEnums";

export const toggleView = () => {
	return {
		type: actionsEnums.TOGGLE_VIEW
	};
};
