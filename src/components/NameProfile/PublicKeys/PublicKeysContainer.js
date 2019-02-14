import { connect } from "react-redux";
import { PublicKeys } from "./PublicKeys";

const mapStateToProps = (state) => {
	return {
		web3: state.web3Reducer.web3,
		accounts: state.web3Reducer.accounts,
		nameId: state.nameReducer.nameId,
		namePublicKey: state.contractReducer.namePublicKey,
		aoion: state.contractReducer.aoion
	};
};

const mapDispatchToProps = (dispatch) => {
	return {};
};

export const PublicKeysContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(PublicKeys);
