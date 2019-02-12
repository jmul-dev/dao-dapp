import { connect } from "react-redux";
import { AddPublicKey } from "./AddPublicKey";

const mapStateToProps = (state) => {
	return {
		web3: state.web3Reducer.web3,
		accounts: state.web3Reducer.accounts,
		nameId: state.taoReducer.nameId,
		namePublicKey: state.contractReducer.namePublicKey
	};
};

const mapDispatchToProps = (dispatch) => {
	return {};
};

export const AddPublicKeyContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(AddPublicKey);
