import { connect } from "react-redux";
import { ViewChallengedTAO } from "./ViewChallengedTAO";

const mapStateToProps = (state) => {
	return {
		pastEventsRetrieved: state.globalReducer.pastEventsRetrieved,
		names: state.globalReducer.names,
		nameId: state.nameReducer.nameId,
		accounts: state.web3Reducer.accounts,
		taoFactory: state.contractReducer.contracts.taoFactory,
		nameTAOPosition: state.contractReducer.contracts.nameTAOPosition,
		challengeTAOAdvocates: state.globalReducer.challengeTAOAdvocates,
		logos: state.contractReducer.contracts.logos,
		taoPositions: state.globalReducer.taoPositions
	};
};

const mapDispatchToProps = (dispatch) => {
	return {};
};

export const ViewChallengedTAOContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(ViewChallengedTAO);
