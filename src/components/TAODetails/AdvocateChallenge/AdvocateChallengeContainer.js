import { connect } from "react-redux";
import { AdvocateChallenge } from "./AdvocateChallenge";

const mapStateToProps = (state) => {
	return {
		names: state.globalReducer.names,
		challengeTAOAdvocates: state.globalReducer.challengeTAOAdvocates
	};
};

const mapDispatchToProps = (dispatch) => {
	return {};
};

export const AdvocateChallengeContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(AdvocateChallenge);
