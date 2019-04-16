import { connect } from "react-redux";
import { UpdateWriterKey } from "./UpdateWriterKey";

const mapStateToProps = (state) => {
	return {
		accounts: state.web3Reducer.accounts,
		namePublicKey: state.contractReducer.contracts.namePublicKey,
		nameFactory: state.contractReducer.contracts.nameFactory
	};
};

const mapDispatchToProps = (dispatch) => {
	return {};
};

export const UpdateWriterKeyContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(UpdateWriterKey);
