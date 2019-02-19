import { connect } from "react-redux";
import { TransferIon } from "./TransferIon";

const mapStateToProps = (state) => {
	return {
		accounts: state.web3Reducer.accounts,
		nameId: state.nameReducer.nameId,
		aoion: state.contractReducer.contracts.aoion
	};
};

const mapDispatchToProps = (dispatch) => {
	return {};
};

export const TransferIonContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(TransferIon);
