import { connect } from "react-redux";
import { TransferResources } from "./TransferResources";
import { setSuccess } from "widgets/Toast/actions";

const mapStateToProps = (state) => {
	return {
		web3: state.web3Reducer.web3,
		accounts: state.web3Reducer.accounts,
		nameId: state.nameReducer.nameId,
		nameTAOVault: state.contractReducer.contracts.nameTAOVault
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		setSuccess: (headline, message) => dispatch(setSuccess(headline, message))
	};
};

export const TransferResourcesContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(TransferResources);
