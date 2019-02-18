import { connect } from "react-redux";
import { UploadProfileImageForm } from "./UploadProfileImageForm";

const mapStateToProps = (state) => {
	return {
		nameId: state.nameReducer.nameId
	};
};

const mapDispatchToProps = (dispatch) => {
	return {};
};

export const UploadProfileImageFormContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(UploadProfileImageForm);
