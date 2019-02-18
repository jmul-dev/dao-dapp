import { actionsEnums } from "common/actionsEnums";

export const setProfileImage = (profileImage) => {
	return {
		type: actionsEnums.SET_PROFILE_IMAGE,
		profileImage
	};
};
