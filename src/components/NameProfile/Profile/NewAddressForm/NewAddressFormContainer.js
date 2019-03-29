import { connect } from "react-redux";
import { NewAddressForm } from "./NewAddressForm";
import { setSuccess } from "widgets/Toast/actions";

const mapStateToProps = (state) => {
	return {
		web3: state.web3Reducer.web3,
		accounts: state.web3Reducer.accounts,
		nameFactory: state.contractReducer.contracts.nameFactory,
		nameAccountRecovery: state.contractReducer.contracts.nameAccountRecovery
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		setSuccess: (headline, message) => dispatch(setSuccess(headline, message))
	};
};

export const NewAddressFormContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(NewAddressForm);
