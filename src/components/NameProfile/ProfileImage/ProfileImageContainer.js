import { connect } from "react-redux";
import { ProfileImage } from "./ProfileImage";

const mapStateToProps = (state) => {
	return {
		nameId: state.nameReducer.nameId
	};
};

const mapDispatchToProps = (dispatch) => {
	return {};
};

export const ProfileImageContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(ProfileImage);
