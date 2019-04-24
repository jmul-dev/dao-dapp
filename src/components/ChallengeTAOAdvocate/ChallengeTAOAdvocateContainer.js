import { connect } from "react-redux";
import { ChallengeTAOAdvocate } from "./ChallengeTAOAdvocate";

const mapStateToProps = (state) => {
	return {
		pastEventsRetrieved: state.globalReducer.pastEventsRetrieved,
		taoCurrencyBalances: state.nameReducer.taoCurrencyBalances,
		accounts: state.web3Reducer.accounts,
		taoFactory: state.contractReducer.contracts.taoFactory,
		nameTAOPosition: state.contractReducer.contracts.nameTAOPosition,
		challengeTAOAdvocates: state.nameReducer.challengeTAOAdvocates
	};
};

const mapDispatchToProps = (dispatch) => {
	return {};
};

export const ChallengeTAOAdvocateContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(ChallengeTAOAdvocate);
