import { connect } from "react-redux";
import { SetAdvocateForm } from "./SetAdvocateForm";
import { setSuccess } from "widgets/Toast/actions";

const mapStateToProps = (state) => {
	return {
		accounts: state.web3Reducer.accounts,
		nameId: state.nameReducer.nameId,
		nameTAOPosition: state.contractReducer.contracts.nameTAOPosition,
		names: state.globalReducer.names
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		setSuccess: (headline, message) => dispatch(setSuccess(headline, message))
	};
};

export const SetAdvocateFormContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(SetAdvocateForm);
