import { connect } from "react-redux";
import { ChallengeForm } from "./ChallengeForm";

const mapStateToProps = (state) => {
	return {
		pastEventsRetrieved: state.globalReducer.pastEventsRetrieved,
		nameId: state.nameReducer.nameId,
		accounts: state.web3Reducer.accounts,
		nameTAOPosition: state.contractReducer.contracts.nameTAOPosition,
		logos: state.contractReducer.contracts.logos
	};
};

const mapDispatchToProps = (dispatch) => {
	return {};
};

export const ChallengeFormContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(ChallengeForm);
