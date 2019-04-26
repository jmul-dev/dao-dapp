import { connect } from "react-redux";
import { ViewActiveChallenge } from "./ViewActiveChallenge";

const mapStateToProps = (state) => {
	return {
		nameId: state.nameReducer.nameId,
		accounts: state.web3Reducer.accounts,
		nameTAOPosition: state.contractReducer.contracts.nameTAOPosition,
		logos: state.contractReducer.contracts.logos
	};
};

const mapDispatchToProps = (dispatch) => {
	return {};
};

export const ViewActiveChallengeContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(ViewActiveChallenge);
