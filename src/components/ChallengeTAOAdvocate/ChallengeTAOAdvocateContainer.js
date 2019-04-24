import { connect } from "react-redux";
import { ChallengeTAOAdvocate } from "./ChallengeTAOAdvocate";

const mapStateToProps = (state) => {
	return {
		pastEventsRetrieved: state.globalReducer.pastEventsRetrieved,
		names: state.globalReducer.names,
		nameId: state.nameReducer.nameId,
		taoCurrencyBalances: state.nameReducer.taoCurrencyBalances,
		accounts: state.web3Reducer.accounts,
		taoFactory: state.contractReducer.contracts.taoFactory,
		nameTAOPosition: state.contractReducer.contracts.nameTAOPosition,
		logos: state.contractReducer.contracts.logos
	};
};

const mapDispatchToProps = (dispatch) => {
	return {};
};

export const ChallengeTAOAdvocateContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(ChallengeTAOAdvocate);
