import { connect } from "react-redux";
import { UploadProfileImageForm } from "./UploadProfileImageForm";
import { setProfileImage } from "./actions";

const mapStateToProps = (state) => {
	return {
		nameId: state.nameReducer.nameId
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		setProfileImage: (profileImage) => dispatch(setProfileImage(profileImage))
	};
};

export const UploadProfileImageFormContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(UploadProfileImageForm);
