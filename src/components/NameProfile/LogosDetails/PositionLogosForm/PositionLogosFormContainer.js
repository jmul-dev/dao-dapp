import { connect } from "react-redux";
import { PositionLogosForm } from "./PositionLogosForm";

const mapStateToProps = (state) => {
	return {
		accounts: state.web3Reducer.accounts,
		nameId: state.nameReducer.nameId,
		logos: state.contractReducer.contracts.logos,
		names: state.globalReducer.names,
		namesCompromised: state.globalReducer.namesCompromised
	};
};

const mapDispatchToProps = (dispatch) => {
	return {};
};

export const PositionLogosFormContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(PositionLogosForm);
