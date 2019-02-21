import { connect } from "react-redux";
import { PublicKeys } from "./PublicKeys";
import { setError } from "widgets/Toast/actions";

const mapStateToProps = (state) => {
	return {
		web3: state.web3Reducer.web3,
		accounts: state.web3Reducer.accounts,
		namePublicKey: state.contractReducer.contracts.namePublicKey,
		aoion: state.contractReducer.contracts.aoion
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		setError: (headline, message, persisted) => dispatch(setError(headline, message, persisted))
	};
};

export const PublicKeysContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(PublicKeys);
