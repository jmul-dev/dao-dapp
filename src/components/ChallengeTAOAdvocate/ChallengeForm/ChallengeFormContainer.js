import { connect } from "react-redux";
import { ChallengeForm } from "./ChallengeForm";

const mapStateToProps = (state) => {
	return {
		pastEventsRetrieved: state.globalReducer.pastEventsRetrieved,
		names: state.globalReducer.names,
		nameId: state.nameReducer.nameId,
		taoCurrencyBalances: state.nameReducer.taoCurrencyBalances,
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
