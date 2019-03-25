import { connect } from "react-redux";
import { SetSpeakerForm } from "./SetSpeakerForm";
import { setSuccess } from "widgets/Toast/actions";

const mapStateToProps = (state) => {
	return {
		accounts: state.web3Reducer.accounts,
		nameId: state.nameReducer.nameId,
		nameTAOPosition: state.contractReducer.contracts.nameTAOPosition,
		names: state.globalReducer.names,
		taos: state.globalReducer.taos
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		setSuccess: (headline, message) => dispatch(setSuccess(headline, message))
	};
};

export const SetSpeakerFormContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(SetSpeakerForm);
