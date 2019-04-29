import { connect } from "react-redux";
import { ParentReplaceTAOAdvocate } from "./ParentReplaceTAOAdvocate";

const mapStateToProps = (state) => {
	return {
		pastEventsRetrieved: state.globalReducer.pastEventsRetrieved,
		accounts: state.web3Reducer.accounts,
		names: state.globalReducer.names,
		nameId: state.nameReducer.nameId,
		taoCurrencyBalances: state.nameReducer.taoCurrencyBalances,
		taoFactory: state.contractReducer.contracts.taoFactory,
		nameTAOPosition: state.contractReducer.contracts.nameTAOPosition,
		logos: state.contractReducer.contracts.logos,
		taoPositions: state.globalReducer.taoPositions
	};
};

const mapDispatchToProps = (dispatch) => {
	return {};
};

export const ParentReplaceTAOAdvocateContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(ParentReplaceTAOAdvocate);
