import { connect } from "react-redux";
import { AddTAODescriptionForm } from "./AddTAODescriptionForm";

const mapStateToProps = (state) => {
	return {
		nameId: state.nameReducer.nameId,
		nameTAOPosition: state.contractReducer.contracts.nameTAOPosition
	};
};

const mapDispatchToProps = (dispatch) => {
	return {};
};

export const AddTAODescriptionFormContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(AddTAODescriptionForm);
