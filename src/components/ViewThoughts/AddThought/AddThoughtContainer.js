import { connect } from "react-redux";
import { AddThought } from "./AddThought";
import { setSuccess } from "widgets/Toast/actions";

const mapStateToProps = (state) => {
	return {
		nameId: state.nameReducer.nameId
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		setSuccess: (headline, message) => dispatch(setSuccess(headline, message))
	};
};

export const AddThoughtContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(AddThought);
